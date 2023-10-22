// Listen for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Web3
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    
    // Set initial transaction count and connection state
    let transactionCount = 33;
    let isConnected = false;

    // Check initial connection to a wallet
    async function checkInitialConnection() {
        const accounts = await web3.eth.getAccounts();
        isConnected = accounts.length > 0;
        const networkId = isConnected ? await web3.eth.net.getId() : null;
        checkPulseChain(networkId);
    }

    // Connect to a wallet
    async function connectWallet() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        isConnected = true;
        const networkId = await web3.eth.net.getId();
        checkPulseChain(networkId);
    }

    // Check if the current network is PulseChain
    function checkPulseChain(networkId) {
        const connectButton = document.getElementById('connectButton');
        const pulseChainId = 369;  // PulseChain network ID
        connectButton.innerText = isConnected ? (networkId === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
        connectButton.style.backgroundColor = isConnected ? (networkId === pulseChainId ? "green" : "red") : "grey";
    }

     // Function to set a random title
    function setRandomTitle() {
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
    }
    
    // Publish a message to the blockchain
    async function publishMessage() {
        if (!isConnected) await connectWallet();  // Ensure wallet is connected

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

        // Send the transaction
        web3.eth.sendTransaction(tx)
            .on('transactionHash', hash => console.log('transactionHash', hash))
            .on('receipt', receipt => console.log('receipt', receipt))
            .on('error', (error, receipt) => console.log('error', error));
    }

    // Post content to a list on the web page
    function postContent() {
        const contentInput = document.getElementById('postInput');
        const targetSection = document.getElementById('postList');
        const newContent = document.createElement('li');
        newContent.innerText = contentInput.value;
        targetSection.appendChild(newContent);
        contentInput.value = '';
    }

  // Define an array of API endpoints in the order of preference
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc',
    // Add more fallback endpoints as needed
];

const maxRetryCount = 3; // Maximum number of retries for each endpoint

// Function to fetch data from a list of endpoints with fallbacks
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

// Fetch transactions and display them with fallback
async function fetchTransactionData() {
    const window = document.getElementById('transactionDataWindow');
    window.innerHTML = 'Fetching data...';

    try {
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
            }
        });
        window.innerText = outputText;
    } catch (error) {
        console.error("Error details:", error.name, error.message);
        window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
    }
}

// Function to create a timeout promise
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initial call to fetch transaction data
fetchTransactionData();

    // Update the transaction count to fetch
    function updateTransactionCount() {
        const newCount = parseInt(document.getElementById('transactionCountInput').value);
        if (!isNaN(newCount)) {
            transactionCount = newCount;
        }
    }

    // Event listeners
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', publishMessage);
    document.getElementById('loadMoreTransactionsButton').addEventListener('click', fetchTransactionData);
    document.getElementById('transactionCountInput').addEventListener('input', updateTransactionCount);

    // Perform initial checks
    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();  // Call the function to set a random title

    // Automatically update the feed every 10 seconds
    setInterval(fetchTransactionData, 120000);
});
