// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    // Add more fallback endpoints as needed
];

// Define the maximum number of retries for each endpoint
const maxRetryCount = 3;

document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    
    let transactionCount = 33;
    let isConnected = false;

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
    
    async function publishMessage() {
        if (!isConnected) {
            try {
                await connectWallet();  // Ensure wallet is connected
            } catch (error) {
                console.error('Error publishing message:', error);
                // Handle the error and provide user feedback
                return;
            }
        }

        const contentInput = document.getElementById('postInput');
        const message = contentInput.value;
        const hexMessage = web3.utils.utf8ToHex(message);

        const accounts = await web3.eth.getAccounts();
        const fromAddress = accounts[0];
        const toAddress = '0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB';  // Replace with your contract address

        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei('0', 'ether'),
            data: hexMessage,
            gas: 30000000  // Set the gas limit
        };

        try {
            // Send the transaction
            const receipt = await web3.eth.sendTransaction(tx);
            console.log('Transaction receipt:', receipt);
            // Provide user feedback for successful transaction
        } catch (error) {
            console.error('Error sending transaction:', error);
            // Handle the error and provide user feedback
        }
    }

    function postContent() {
        try {
            const contentInput = document.getElementById('postInput');
            const targetSection = document.getElementById('postList');
            const newContent = document.createElement('li');
            newContent.innerText = contentInput.value;
            targetSection.appendChild(newContent);
            contentInput.value = '';
        } catch (error) {
            console.error('Error posting content:', error);
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
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = 'Fetching data...';

            const data = await fetchDataWithFallback(apiEndpoints);
            let outputText = "";
            data.result.filter(tx => tx.input !== '0x').slice(0, transactionCount).forEach(tx => {
                try {
                    if (web3.utils.isHexStrict(tx.input)) {
                        const decodedInput = web3.utils.hexToUtf8(tx.input);
                        outputText += `User: ${tx.from}\nMessage: ${decodedInput}\n\n`;
                    }
                } catch (error) {
                    // Skip this transaction
                    console.error('Error processing transaction:', error);
                    // Handle the error, but continue processing other transactions
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
    document.getElementById('publishButton').addEventListener('click', publishMessage);
    document.getElementById('loadMoreTransactionsButton').addEventListener('click', fetchTransactionData);
    document.getElementById('transactionCountInput').addEventListener('input', updateTransactionCount);

    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();
    
    setInterval(fetchTransactionData, 120000); // Automatically update the feed every 10 seconds
});
