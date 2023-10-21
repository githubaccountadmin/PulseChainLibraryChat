// Initialize web3 instance
const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

// Function to post content to a specific section
function postContent(section) {
    const contentInput = document.getElementById(section + '-input');
    const targetSection = document.getElementById(section + '-section');
    const newContent = document.createElement('p');
    newContent.innerText = contentInput.value;
    targetSection.appendChild(newContent);
}

// Function to check if connected to PulseChain
function checkPulseChain(networkId) {
    const networkDisplay = document.getElementById('network-display');

    // PulseChain's Chain ID is 369
    const pulseChainId = 369;

    if (networkId === pulseChainId) {
        networkDisplay.innerHTML = "Connected to PulseChain";
        networkDisplay.style.color = "green";
    } else {
        networkDisplay.innerHTML = "Not connected to PulseChain";
        networkDisplay.style.color = "red";
    }
}

// Event listeners for the buttons
document.getElementById('tweets-button').addEventListener('click', () => postContent('tweets'));
document.getElementById('stories-button').addEventListener('click', () => postContent('stories'));
document.getElementById('books-button').addEventListener('click', () => postContent('books'));

// Get and display the current network ID
web3.eth.net.getId().then(checkPulseChain);

// Listen for network changes and update the display accordingly
web3.eth.net.isListening().then(() => {
    window.ethereum.on('chainChanged', (chainId) => {
        const networkId = parseInt(chainId.substring(2), 16);  // Convert hexadecimal to decimal
        checkPulseChain(networkId);
    });
});

// Default number of blocks to load
let blockCount = 100;

// Function to fetch transaction data for the given number of blocks
async function fetchTransactionData() {
    const address = '0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB'; // Replace with your address
    const response = await fetch(`https://scan.pulsechain.com/api?module=transaction&action=gettxlist&address=${address}&sort=desc&startblock=0&endblock=${blockCount}`);
    const data = await response.json();
    
    // Clear the transaction data window
    const transactionDataWindow = document.getElementById('transaction-data-window');
    transactionDataWindow.innerHTML = '';

    if (data.status === '1') {
        const transactions = data.result;
        transactions.forEach((transaction, index) => {
            const transactionData = transaction.input;
            const listItem = document.createElement('div');
            listItem.textContent = `Transaction ${index + 1}: ${transactionData}`;
            transactionDataWindow.appendChild(listItem);
        });
    } else {
        transactionDataWindow.textContent = 'No transactions found.';
    }
}

// Load transaction data when the page loads
window.addEventListener('load', () => {
    fetchTransactionData();
});

// Listen for the "Load More Blocks" button click
document.getElementById('fetchDataButton').addEventListener('click', () => {
    blockCount += 100; // Increase the number of blocks to load by 100
    fetchTransactionData();
});
