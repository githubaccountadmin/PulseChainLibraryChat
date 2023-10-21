// Initialize web3 instance
const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

// Function to post content to a specific section
function postContent(section) {
    const contentInput = document.getElementById(section + 'Input');
    const targetSection = document.getElementById(section + 'List');
    const newContent = document.createElement('li');
    newContent.innerText = contentInput.value;
    targetSection.appendChild(newContent);
}

// Function to fetch and display external transaction data as UTF-8 text
async function fetchAndDisplayExternalTransactions(address) {
    const apiUrl = `https://scan.pulsechain.com/api?module=account&action=txlist&address=${address}&sort=desc`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if there are any transactions
        if (data.result && data.result.length > 0) {
            // Get the raw input data from the latest transaction
            const latestTransaction = data.result[0];
            const inputData = latestTransaction.input;

            // Convert hexadecimal to UTF-8 text
            const utf8Text = hexToUtf8(inputData);

            // Display the UTF-8 text in a window or element on your website
            const dataWindow = document.getElementById('transaction-data-window');
            dataWindow.textContent = utf8Text;
        } else {
            // No transactions found
            console.log('No transactions found for the given address.');
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
}

// Helper function to convert hexadecimal to UTF-8 text
function hexToUtf8(hex) {
    const hexString = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = [];

    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }

    const utf8Text = new TextDecoder('utf-8').decode(new Uint8Array(bytes));
    return utf8Text;
}

// Call the function to fetch and display external transaction data as UTF-8 text
fetchAndDisplayExternalTransactions('0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB');

// Function to check if connected to PulseChain
async function checkPulseChain() {
    const networkId = await web3.eth.net.getId();
    const networkDisplay = document.getElementById('networkStatus');

    // PulseChain's Chain ID is 369
    if (networkId === 369) {
        networkDisplay.innerHTML = "Connected to PulseChain";
    } else {
        networkDisplay.innerHTML = "Not connected to PulseChain";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for the buttons
    document.getElementById('tweetButton').addEventListener('click', () => postContent('tweet'));
    document.getElementById('storyButton').addEventListener('click', () => postContent('story'));
    document.getElementById('bookButton').addEventListener('click', () => postContent('book'));

    document.getElementById("connectButton").addEventListener("click", async () => {
        await ethereum.request({ method: 'eth_requestAccounts' });
        await checkPulseChain();
    });

    // Initial network check
    checkPulseChain();

    // Listen for network changes and update the display accordingly
    window.ethereum.on('chainChanged', async () => {
        await checkPulseChain();
    });
});
