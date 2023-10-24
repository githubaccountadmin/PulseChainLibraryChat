// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',    
   
];

const maxRetryCount = 3;

document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 33;
    let isConnected = false;
    let globalHexMessage = '';
    
    document.getElementById('transactionCountInput').value = transactionCount;

    async function checkInitialConnection() {
        try {
            const accounts = await web3.eth.getAccounts();
            isConnected = accounts.length > 0;
            const networkId = isConnected ? await web3.eth.net.getId() : null;
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error checking initial connection:', error);
            // Handle the error and provide user feedback
        }
    }

    async function connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = true;
            const networkId = await web3.eth.net.getId();
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            // Handle the error and provide user feedback
        }
    }

    function checkPulseChain(networkId) {
        try {
            const connectButton = document.getElementById('connectButton');
            const pulseChainId = 369;  // PulseChain network ID

            // Add hover effect for connectButton
            connectButton.addEventListener('mouseover', function() {
                if (!isConnected) {
                    this.style.backgroundColor = 'green';
                }
            });

            connectButton.addEventListener('mouseout', function() {
                if (!isConnected) {
                    this.style.backgroundColor = 'grey';
                }
            });
            
            connectButton.innerText = isConnected ? (networkId === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
            connectButton.style.backgroundColor = isConnected ? (networkId === pulseChainId ? "green" : "red") : "grey";
        } catch (error) {
            console.error('Error checking PulseChain network:', error);
            // Handle the error and provide user feedback
        }
    }

    function setRandomTitle() {
        try {
            const titles = [
                // Array of random titles
                "The Great Library of PulseChain: Home of the Immutable Publishing House",
                "The Great Library & Publishing House of PulseChain: Your Words, Our Blocks",
                "PulseChain's Magna Bibliotheca: A Great Library and Publishing House",
                "The Great Library of PulseChain: Where Publishers Become Historians",
                "PulseChain Publishing House: An Annex to The Great Library",
                "The Pulsating Shelves: The Great Library & Publishing House of PulseChain",
                "The Grand Archive and Publishing House of PulseChain: A Great Library for All",
                "PulseChain’s Scholarly Publishing House: A Chapter in The Great Library",
                "The Great Library of PulseChain's Eternal Publishing House: A Living Ledger",
                "The Great Library & Immutable Publishing House of PulseChain: Where Every Word Counts"
            ];
            
            const titleElement = document.getElementById('dynamicTitle');
            const randomIndex = Math.floor(Math.random() * titles.length);
            titleElement.innerText = titles[randomIndex];
        } catch (error) {
            console.error('Error setting random title:', error);
            // Handle the error and provide user feedback
        }
    }
    
    // Function to show publish options (the dropdown)
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    // Function to hide publish options (the dropdown)
    function hidePublishOptions() {
        document.getElementById('publishOptions').style.display = 'none';
    }
    
    // Update handlePublishOption function to call hidePublishOptions() after publishing
    function handlePublishOption(option) {
        console.log("handlePublishOption called with option: ", option);
        const message = `*****(${option})*****`; // Include the option in the message
        console.log("About to update globalHexMessage: ", globalHexMessage);
        globalHexMessage = web3.utils.utf8ToHex(message);
        console.log("Updated globalHexMessage: ", globalHexMessage);
        // ...
        console.log("At the end of handlePublishOption, globalHexMessage is: ", globalHexMessage);
    }
    
    const publishOptionSelect = document.getElementById('publishOptionSelect');
    publishOptionSelect.addEventListener('change', function() {
        console.log("A publish-option was selected! Invoking handlePublishOption...");
        try {
            handlePublishOption(this.value);
        } catch (error) {
            console.error('Error in handlePublishOption:', error);
        }
    });
    
    async function publishMessage() {
        if (!isConnected) {
            alert('Please connect your wallet before publishing a message.');  // Show a warning message
            try {
                await connectWallet();  // Ensure wallet is connected
            } catch (error) {
                console.error('Error publishing message:', error);
                // Handle the error and provide user feedback
                return;
            }
        }
    
        // Automatically select the first option ("Message") in the dropdown
        const publishOptionSelect = document.getElementById('publishOptionSelect');
        publishOptionSelect.selectedIndex = 0;
    
        console.log("globalHexMessage before concatenation: ", globalHexMessage);
        const contentInput = document.getElementById('postInput');
        const message = contentInput.value;
        const hexMessage = web3.utils.utf8ToHex(message); // Convert new message to hex
    
        // Concatenate the globalHexMessage with the new hexMessage
        console.log("Before substring, hexMessage is: ", hexMessage);
        const hexMessageToSend = globalHexMessage + hexMessage.substring(2); // Removing '0x' from the new hex message
        console.log("hexMessageToSend: ", hexMessageToSend);
    
        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];
        const toAddress = '0x490eE229913202fEFbf52925bF5100CA87fb4421';  // Replace with your contract address
    
        // Get the current nonce for your account
        const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        
        console.log("Nonce: ", nonce);
    
        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei('0', 'ether'),
            data: hexMessageToSend,
            gas: 30000000,  // Set the gas limit appropriately
            nonce: nonce, // Include the nonce in the transaction
        };
    
        console.log("Transaction Object: ", tx);
    
        try {
            // Send the transaction
            const receipt = await web3.eth.sendTransaction(tx);
            console.log('Transaction receipt:', receipt);
            // Provide user feedback for successful transaction
    
            document.getElementById('postInput').value = ''; // Clear the text area
            globalHexMessage = null; // Reset the globalHexMessage
        } catch (error) {
            console.error('Error sending transaction:', error);
            // Handle the error and provide user feedback
        }
    }

    async function fetchDataWithFallback(endpoints) {
        for (const endpoint of endpoints) {
            for (let retryCount = 1; retryCount <= maxRetryCount; retryCount++) {
                try {
                    const response = await fetch(endpoint);
                    if (response.status === 200) {
                        return await response.json();
                    }
                } catch (error) {
                    console.log(`Fetching data from ${endpoint} failed (Retry ${retryCount}). Trying again...`);
                }
            }
        }
        throw new Error('All API endpoints have failed. Please reload the page to try again.');
    }

    async function fetchTransactionData() {
        try {
            // Get the selected tag from the dropdown
            const selectedTag = document.getElementById('tagFilter').value;
    
            // Update this line to get the count from the input box
            const newCount = parseInt(document.getElementById('transactionCountInput').value);
            if (!isNaN(newCount)) {
                transactionCount = newCount;
            }
    
            console.log("Selected Tag: ", selectedTag);
            console.log("Transaction Count: ", transactionCount);
    
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = 'Fetching data...';
    
            const data = await fetchDataWithFallback(apiEndpoints);
            let outputText = "";
            data.result.filter(tx => tx.input !== '0x').slice(0, transactionCount).forEach(tx => {
                try {
                    if (web3.utils.isHexStrict(tx.input)) {
                        let decodedInput = web3.utils.hexToUtf8(tx.input);
    
                        // Extract the tag from the message
                        const tagMatch = decodedInput.match(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/);
                        const tag = tagMatch ? tagMatch[1] : null;
    
                        // Skip if the selected tag does not match the message's tag
                        if (selectedTag !== 'All' && tag !== selectedTag) {
                            return;
                        }
    
                        console.log("Decoded Input: ", decodedInput);
                        console.log("Tag: ", tag);
    
                        if (tag) {
                            decodedInput = decodedInput.replace(`*****(${tag})*****`, '');
                            outputText += `User: ${tx.from}\n${tag}: ${decodedInput}\n\n`;
                        } else {
                            outputText += `User: ${tx.from}\nMessage: ${decodedInput.replace(/\*\*\*\*\*\(.*?\)\*\*\*\*\*/, '')}\n\n`;
                        }
                    }
                } catch (error) {
                    // Skip this transaction and continue processing other transactions
                    console.error('Error processing transaction:', error);
                }
            });
    
            window.innerText = outputText;
    
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    }
    
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateTransactionCount() {
        try {
            const newCount = parseInt(document.getElementById('transactionCountInput').value);
            if (!isNaN(newCount)) {
                transactionCount = newCount;
            }
        } catch (error) {
            console.error('Error updating transaction count:', error);
            // Handle the error and provide user feedback
        }
    }

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    document.getElementById('loadMoreTransactionsButton').addEventListener('click', fetchTransactionData);
    document.getElementById('tagFilter').addEventListener('change', fetchTransactionData);
    
    // Single Event Listener for "Confirm" button to hide publish options and send the message
    document.getElementById('confirmPublishButton').addEventListener('click', async function() {
        console.log("Confirm button clicked. Preparing to publish message...");
    
        hidePublishOptions(); // Hide the publish options
    
        try {
            await publishMessage(); // Publish the message
        } catch (error) {
            console.error('Error publishing message:', error);
        }
    });
    
    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();
    
    setInterval(fetchTransactionData, 120000);
    
});
