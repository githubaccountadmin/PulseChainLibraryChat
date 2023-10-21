document.addEventListener('DOMContentLoaded', init);

function init() {
    // Setup
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 10; // Default to the last 10 transactions
    
    // Initialize
    fetchTransactionData();
    setupEventListeners();
    web3.eth.net.getId().then(checkPulseChain);

    // Event Listener setup
    function setupEventListeners() {
        document.getElementById('connectButton').addEventListener('click', connectWallet);
        document.getElementById('publishButton').addEventListener('click', postContent);
        document.getElementById('fetchDataButton').addEventListener('click', fetchTransactionData);
        document.getElementById('fetchDataButton').addEventListener('dblclick', updateTransactionCount);
    }

    // Wallet Connection
    async function connectWallet() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await web3.eth.net.getId();
        checkPulseChain(networkId);
    }

    // Check Network
    function checkPulseChain(networkId) {
        const networkDisplay = document.getElementById('networkStatus');
        const pulseChainId = 369;
        networkDisplay.textContent = networkId === pulseChainId ? "Connected to PulseChain" : "Not connected to PulseChain";
        networkDisplay.style.color = networkId === pulseChainId ? "green" : "red";
    }

    // Posting Content
    function postContent() {
        const contentInput = document.getElementById('postInput');
        const targetSection = document.getElementById('postList');
        const newContent = document.createElement('li');
        newContent.textContent = contentInput.value;
        targetSection.appendChild(newContent);
        contentInput.value = '';
    }

    // Fetch Transaction Data
    async function fetchTransactionData() {
        const windowEl = document.getElementById('transaction-data-window');
        windowEl.textContent = 'Fetching data...';
        const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

        let response, data;
        try {
            response = await fetch(apiEndpoint);
            data = await response.json();
        } catch (error) {
            console.error("Fetch Error:", error);
            windowEl.textContent = `Error fetching data: ${error}`;
            return;
        }

        if (!Array.isArray(data.result)) {
            console.error("Invalid data structure", data);
            windowEl.textContent = "Error: Invalid data structure.";
            return;
        }

        const filteredData = data.result
            .filter(tx => tx.input !== '0x')
            .slice(0, transactionCount)
            .map(tx => {
                let decodedInput = 'Invalid UTF-8 data';
                try {
                    decodedInput = web3.utils.hexToUtf8(tx.input);
                } catch (e) {
                    console.error("Decode Error:", e);
                }
                return { from: tx.from, input: decodedInput };
            });

        windowEl.textContent = JSON.stringify(filteredData, null, 2);
    }

    // Update Transaction Count
    function updateTransactionCount() {
        const newCount = parseInt(prompt('Enter the number of transactions to fetch:', transactionCount), 10);
        if (!isNaN(newCount)) {
            transactionCount = newCount;
        }
    }
}
