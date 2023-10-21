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

async function fetchAndDisplayTransactions(address) {
    try {
        const apiUrl = `https://scan.pulsechain.com/api?module=transaction&action=gettxlist&address=${address}&sort=desc`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.result && data.result.length > 0) {
            const transactionDataWindow = document.getElementById('transaction-data-window');

            for (const transaction of data.result) {
                const input = transaction.input;
                const decoder = new TextDecoder('utf-8');
                const decodedInput = decoder.decode(new Uint8Array(Buffer.from(input.slice(2), 'hex')));

                const transactionDataElement = document.createElement('p');
                transactionDataElement.innerText = decodedInput;
                transactionDataWindow.appendChild(transactionDataElement);
            }
        } else {
            console.log('No transactions found for the given address.');
        }
    } catch (error) {
        console.error('Error fetching transaction data:', error);
    }
}

// Usage example with the provided address
const targetAddress = '0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB';
fetchAndDisplayTransactions(targetAddress);

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
