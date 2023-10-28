// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',    
   
];

const maxRetryCount = 3;
const pulseChainId = 369;  // PulseChain network ID - Moved outside of the function

document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let totalTransactions = 0; // Add this line at the top of your script to keep track of total transactions
    let transactionCount = 13;
    let lastIndexProcessed = 0; // Add this line at the top of your script to keep track of the last index processed
    let isConnected = false;
    let globalHexMessage = '';
    let isFirstLoad = true;
    
    console.log("Initial PulseChain ID:", pulseChainId);  // Debugging log

    async function checkInitialConnection() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = accounts.length > 0;
            const networkId = isConnected ? await window.ethereum.request({ method: 'net_version' }) : null;
            console.log("Network ID from Ethereum in checkInitialConnection:", networkId);  // Debugging log
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error checking initial connection:', error);
        }
    }

    async function connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = true;
            const networkId = await window.ethereum.request({ method: 'net_version' });
            console.log("Network ID from Ethereum in connectWallet:", networkId);  // Debugging log
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    function checkPulseChain(networkId) {
        console.log("Network ID from Ethereum:", networkId);
        console.log("PulseChain ID:", pulseChainId);
        console.log("Is connected:", isConnected);
        
        try {
            const connectButton = document.getElementById('connectButton');
    
            // Explicitly convert networkId to a number
            const networkIdNumber = Number(networkId);
            console.log("Converted Network ID:", networkIdNumber);
    
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
            
            console.log("Updating connect button");
            connectButton.innerText = isConnected ? (networkIdNumber === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
            connectButton.style.backgroundColor = isConnected ? (networkIdNumber === pulseChainId ? "green" : "red") : "grey";
            console.log("Button text:", connectButton.innerText);
            console.log("Button color:", connectButton.style.backgroundColor);
            
        } catch (error) {
            console.error('Error checking PulseChain network:', error);
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
        const contentInput = document.getElementById('postInput');
    
        // Trim leading and trailing white spaces and check if the resulting string is empty
        if (!option || option.trim() === '') {
            // If no option is selected, default to "Message"
            option = "Message";
            publishOptionSelect.value = "Message"; // Set the select element to "Message"
        }
    
        const message = `*****(${option})***** ${contentInput.value}`;
        console.log("About to update globalHexMessage: ", globalHexMessage);
        globalHexMessage = web3.utils.utf8ToHex(message);
        console.log("Updated globalHexMessage: ", globalHexMessage);
        // ...
        console.log("At the end of handlePublishOption, globalHexMessage is: ", globalHexMessage);
    }
    
    const publishOptionSelect = document.getElementById('publishOptionSelect');
    
   // Add this event listener to handle the initial click on the dropdown
    publishOptionSelect.addEventListener('click', function() {
        if (this.value === "") {
            console.log("No option selected. Defaulting to 'Message'...");
            handlePublishOption("Message");
            // Update globalHexMessage directly here
            globalHexMessage = web3.utils.utf8ToHex("*****(Message)*****");
            console.log("Updated globalHexMessage: ", globalHexMessage);
        }
    });
    
    // Event listener for changes in the dropdown menu
    publishOptionSelect.addEventListener('change', function() {
        console.log("A publish-option was selected! Invoking handlePublishOption...");
        try {
            handlePublishOption(publishOptionSelect.value);
        } catch (error) {
            console.error('Error in handlePublishOption:', error);
        }
    });
    
    // Add a boolean flag to prevent multiple executions
    let isPublishing = false;
    
    async function publishMessage() {
        if (!isConnected) {
            alert('Please connect your wallet before publishing a message.'); // Show a warning message
            try {
                await connectWallet(); // Ensure the wallet is connected
            } catch (error) {
                console.error('Error publishing message:', error);
                // Handle the error and provide user feedback
                return;
            }
        }
    
        const contentInput = document.getElementById('postInput');
        const message = contentInput.value;
    
        // Check if message is empty
        if (!message.trim()) {
            console.error('Message is empty.');
            return;
        }
    
        const selectedOption = publishOptionSelect.value || "Message"; // Default to "Message" if nothing is selected
        const fullMessage = `\n\n${message}\n\n*****(${selectedOption})*****`;
    
        const hexMessage = web3.utils.utf8ToHex(fullMessage);
    
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const fromAddress = accounts[0];
        const toAddress = '0x490eE229913202fEFbf52925bF5100CA87fb4421'; // Replace with your contract address
    
        // Get the current nonce for your account
        // const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
    
        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei('0', 'ether'),
            data: hexMessage,
            // gas: 30000000, // Set the gas limit appropriately
            // nonce: nonce, // Include the nonce in the transaction
        };
    
        try {
            // Send the transaction
            const receipt = await web3.eth.sendTransaction(tx);
            console.log('Transaction receipt:', receipt);
            // Provide user feedback for a successful transaction
    
            contentInput.value = ''; // Clear the text area
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

    async function fetchTransactionData(clearExisting = false) {
    console.log('Fetching more data...');
        try {
            const selectedTag = document.getElementById('tagFilter').value;
            console.log("Selected Tag: ", selectedTag);
                
            const window = document.getElementById('transactionDataWindow');
        
            if (isFirstLoad) {
                window.innerHTML = 'Fetching data...';
                isFirstLoad = false; // Set it to false after the first load
            }
    
            const data = await fetchDataWithFallback(apiEndpoints);
            console.log("Fetched Data:", data);
            totalTransactions = data.result.length; // Update total transactions
    
            if (transactionCount >= totalTransactions) {
                console.log("Reached the end of available transactions.");
                return; // Exit the function if we've reached the end
            }
            
            let outputText = "";
            const filteredData = data.result.filter(tx => tx.input !== '0x');
            const sliceStart = lastIndexProcessed;
            const sliceEnd = clearExisting ? lastIndexProcessed + 50 : lastIndexProcessed + 13; // Fetch more data if it's a new tag
    
            if (window.innerHTML === 'Fetching data...') {
                window.innerHTML = '';
            }
            
            if (clearExisting) {
                window.innerHTML = '';
            }
            
            filteredData.slice(sliceStart, sliceEnd).forEach(tx => {            
                try {
                    if (web3.utils.isHexStrict(tx.input)) {
                        let decodedInput = web3.utils.hexToUtf8(tx.input);
                        const tagMatch = decodedInput.match(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/);
                        const tag = tagMatch ? tagMatch[1] : null;
    
                        if (selectedTag !== 'All' && tag !== selectedTag) {
                            return;
                        }
    
                        console.log("Decoded Input: ", decodedInput);
                        console.log("Tag: ", tag);
    
                        if (tag) {
                            decodedInput = decodedInput.replace(`*****(${tag})*****`, '');
                            if (tag.toLowerCase() === 'other') {
                                outputText += `<div class="transaction"><p>Publisher: ${tx.from} - Published ${tag} <span class="transaction-body">${decodedInput}</span></p></div>`;
                            } else {
                                outputText += `<div class="transaction"><p>Publisher: ${tx.from} - Published a ${tag} <span class="transaction-body">${decodedInput}</span></p></div>`;
                            }
                            console.log("Added .transaction class to element:", tx.from);
                        } else {
                            outputText += `<div class="transaction"><p>Publisher: ${tx.from} - <span class="transaction-tag">Message:</span> <span class="transaction-body">${decodedInput.replace(/\*\*\*\*\*\(.*?\)\*\*\*\*\*/, '')}</span></p></div>`;
                        }
                    }
                } catch (error) {
                    // Skip this transaction and continue processing other transactions
                    console.error('Error processing transaction:', error);
                }
            });
    
            window.innerHTML += outputText;  // Append new transactions to the existing ones
            lastIndexProcessed = sliceEnd;  // Update the last index processed for the next fetch

            if (lastIndexProcessed >= totalTransactions) {
                console.log("Reached the end of available transactions.");
                return; // Exit the function if we've reached the end
            }            
              
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    }
    
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to toggle the visibility of the custom tag input box based on the selected option
    function toggleCustomTagInput(selectElement, inputElementId) {
        const inputElement = document.getElementById(inputElementId);
        if (selectElement.value === "Custom") {
            inputElement.style.display = "inline";
        } else {
            inputElement.style.display = "none";
        }
    }

    // Function to fetch more transaction data when scrolled to the bottom
    document.getElementById('transactionDataWindow').addEventListener('scroll', async function() {
        const { scrollTop, scrollHeight, clientHeight } = this;
        
        if(clientHeight + scrollTop >= scrollHeight - 5) {
            await fetchTransactionData();
        }
    });
    
    document.getElementById('tagFilter').addEventListener('change', async function() {
        lastIndexProcessed = 0; // Reset the last index
        const window = document.getElementById('transactionDataWindow');
        window.innerHTML = ''; // Clear the window
        await fetchTransactionData(true); // Fetch new data with clearExisting set to true
        
        let selectedTag = this.value;
        
        // If the selected tag is "Custom", use the value from the custom input field
        if (selectedTag === "Custom") {
            selectedTag = document.getElementById('customFilterInput').value;
        }
        
        // Keep fetching until a matching tag is found, the window is filled, or we reach the end
        while ((window.scrollHeight <= window.clientHeight || window.innerHTML.indexOf(selectedTag) === -1) && lastIndexProcessed < totalTransactions) {
            await fetchTransactionData();
        }
    });

    // Add event listener to toggle custom tag input for publish options
    document.getElementById('publishOptionSelect').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customTagInput');
    });
    
    // Add event listener to toggle custom tag input for filter
    document.getElementById('tagFilter').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customFilterInput');
    });
    
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    document.getElementById('confirmPublishButton').addEventListener('click', async function() {
        console.log("Confirm button clicked. Preparing to publish message...");
        // Disable the confirm button to prevent multiple clicks
        this.disabled = true;
        hidePublishOptions(); // Hide the publish options
        const publishOptionSelect = document.getElementById('publishOptionSelect');
        let selectedOption = publishOptionSelect.value;
    
        if (selectedOption === "Custom") {
            selectedOption = document.getElementById('customTagInput').value;
        }
    
        if (selectedOption === "") {
            publishOptionSelect.value = "Message";
        }
    
        try {
            await publishMessage();
        } catch (error) {
            console.error('Error publishing message:', error);
        } finally {
            // Re-enable the confirm button after the message is sent
            this.disabled = false;
        }
    });

    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();
    // setInterval(fetchTransactionData, 120000);
});
