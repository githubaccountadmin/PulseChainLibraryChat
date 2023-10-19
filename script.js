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
