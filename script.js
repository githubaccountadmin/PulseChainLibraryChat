// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    // Add more fallback endpoints as needed
];

// Define the maximum number of retries for each endpoint
const maxRetryCount = 3;

// Define function to check if string is valid UTF-8
function isValidUtf8(str) {
    try {
        decodeURIComponent(escape(str));
        return true;
    } catch (e) {
        return false;
    }
}

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
        const tagElement = document.getElementById('tagInput');
        const tag = tagElement.value;
        const hexMessage = web3.utils.utf8ToHex(message + " [#Tag: " + tag + "]");

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
            const tagElement = document.getElementById('tagInput');
            const targetSection = document.getElementById('postList');
            const newContent = document.createElement('li');
            newContent.innerText = contentInput.value + " [#Tag: " + tagElement.value + "]";
            targetSection.appendChild(newContent);
            contentInput.value = '';
            tagElement.value = '';
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

   // Fetch and display transactions based on filter selection
async function fetchTransactionData() {
    try {
        const filterValue = document.getElementById("filterSelect").value;
        const window = document.getElementById("transactionDataWindow");
        window.innerHTML = '';  // Clear the window content

        const response = await fetch('/fetch-transactions');
        const data = await response.json();
        
        let filteredData = data;

        // Apply filtering logic if the value isn't 'all'
        if (filterValue !== 'all') {
            filteredData = data.filter(item => item.tag === filterValue);
        }

        for (let transaction of filteredData) {
            const p = document.createElement('p');
            p.textContent = `ID: ${transaction.id}, Content: ${transaction.content}, Tag: ${transaction.tag}`;
            window.appendChild(p);
        }

    } catch (error) {
        console.error('There was an error fetching the transaction data:', error);
    }
}

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('postButton').addEventListener('click', postContent);
    document.getElementById('publishButton').addEventListener('click', publishMessage);
    document.getElementById('fetchDataButton').addEventListener('click', fetchTransactionData);
    document.getElementById("applyFilterButton").addEventListener('click', fetchTransactionData);

    checkInitialConnection();
    setRandomTitle();
});
