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

async function fetchTransactions(address) {
    try {
        const apiUrl = `https://scan.pulsechain.com/api?module=transaction&action=gettxlist&address=${address}&sort=desc`;

        // Fetch transaction data
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Process and display transaction data
        if (data.result && data.result.length > 0) {
            data.result.forEach(transaction => {
                const transactionData = transaction.input;
                // Decode transactionData as UTF-8, you might need a library for this
                // For example, you can use TextDecoder:
                const decoder = new TextDecoder('utf-8');
                const decodedData = decoder.decode(new Uint8Array(Buffer.from(transactionData.slice(2), 'hex')));

                // Display the decoded data on your webpage
                console.log('Decoded Transaction Data:', decodedData);
            });
        } else {
            console.log('No transactions found for the given address.');
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
}

// Usage example with the provided address
const targetAddress = '0x490eE229913202fEFbf52925bF5100CA87fb4421';
fetchTransactions(targetAddress);


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
