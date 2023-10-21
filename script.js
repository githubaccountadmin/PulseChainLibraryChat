// Initialize Web3
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

document.addEventListener('DOMContentLoaded', function() {
    const connectButton = document.getElementById('connectButton');
    const publishButton = document.getElementById('publishButton');
    const fetchDataButton = document.getElementById('fetchDataButton');
    const blockCountInput = document.getElementById('blockCountInput');
    const networkStatus = document.getElementById('networkStatus');

    connectButton.addEventListener('click', connectWallet);
    publishButton.addEventListener('click', publishPost);
    fetchDataButton.addEventListener('click', function() {
        const count = parseInt(blockCountInput.value, 10);
        fetchBlocks(count);
    });

    // Display initial network status
    getNetworkStatus().then(status => networkStatus.innerHTML = status);
});

// Connect to Wallet
async function connectWallet() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const network = await web3.eth.net.getNetworkType();
    const networkStatus = document.getElementById('networkStatus');
    networkStatus.innerHTML = network === "pulse" ? "Connected to Pulse Network" : "Please switch to the Pulse network";
}

// Publish Post
async function publishPost() {
    const postInput = document.getElementById('postInput');
    const postValue = postInput.value;

    // Your code to publish a post using web3 can go here.
}

// Fetch Blocks
async function fetchBlocks(count) {
    const latestBlock = await web3.eth.getBlockNumber();
    const fromBlock = Math.max(latestBlock - count, 0);
    const transactionDataWindow = document.getElementById('transaction-data-window');

    for (let i = fromBlock; i <= latestBlock; i++) {
        const block = await web3.eth.getBlock(i, true);
        displayBlockData(block, transactionDataWindow);
    }
}

// Display Block Data
function displayBlockData(block, displayWindow) {
    for (const tx of block.transactions) {
        if (tx.input && tx.input !== "0x") {
            const inputData = web3.utils.hexToUtf8(tx.input);
            displayWindow.innerHTML += `<p>${inputData}</p>`;
        }
    }
}

// Get Network Status
async function getNetworkStatus() {
    const network = await web3.eth.net.getNetworkType();
    return network === "pulse" ? "Connected to Pulse Network" : "Not connected to Pulse Network";
}

