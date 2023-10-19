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
