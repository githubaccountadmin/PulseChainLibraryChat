// Initialize web3 instance
const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

// Function to post content to a specific section
function postContent(section) {
    const contentInput = document.getElementById(section + '-input');
    const targetSection = document.getElementById(section + '-list');
    const newContent = document.createElement('li');
    newContent.innerText = contentInput.value;
    targetSection.appendChild(newContent);
    contentInput.value = ''; // Clear the input field after posting
}

// Function to check if connected to PulseChain
function checkPulseChain(networkId) {
    const networkDisplay = document.getElementById('networkStatus');

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
document.getElementById('connectButton').addEventListener('click', () => {
    // Add your code to connect the wallet here
});

document.getElementById('tweet-button').addEventListener('click', () => postContent('tweets'));
document.getElementById('book-button').addEventListener('click', () => postContent('books'));
document.getElementById('story-button').addEventListener('click', () => postContent('stories'));

// Function to fetch transaction data
async function fetchTransactionData() {
    const window = document.getElementById('transaction-data-window');
    window.innerHTML = 'Fetching data...';

    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

    // Make a GET request to fetch transaction data
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        
        // Process and display the data in the window
        window.innerHTML = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error(error);
        window.innerHTML = 'Error fetching data.';
    }
}

// Event listener for the fetch data button
document.getElementById('fetchDataButton').addEventListener('click', () => {
    fetchTransactionData();
});

// Get and display the current network ID
web3.eth.net.getId().then(checkPulseChain);

// Listen for network changes and update the display accordingly
web3.eth.net.isListening().then(() => {
    window.ethereum.on('chainChanged', (chainId) => {
        const networkId = parseInt(chainId.substring(2), 16);  // Convert hexadecimal to decimal
        checkPulseChain(networkId);
    });
});
