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
    const window = document.getElementById('transaction-data-window');
    window.innerHTML = 'Fetching data...';

    const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        const filteredData = data.result.filter(tx => tx.input !== '0x').slice(0, 10).map(tx => {
            let decodedInput;
            try {
                decodedInput = web3.utils.hexToUtf8(tx.input);
            } catch (e) {
                console.error("Failed to decode input:", tx.input, e);
                decodedInput = "Invalid UTF-8 data";
            }

            return {
                from: tx.from,
                input: decodedInput
            };
        });

        // Formatting the data for display
        let formattedData = '';
        filteredData.forEach(tx => {
            formattedData += `From - ${tx.from}\nMessage - ${tx.input}\n\n`;
        });

        window.innerText = formattedData;

    } catch (error) {
        console.error("Error details:", error.name, error.message);
        window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
    }
}

    // Update Transaction Count
    function updateTransactionCount() {
        const newCount = parseInt(prompt('Enter the number of transactions to fetch:', transactionCount), 10);
        if (!isNaN(newCount)) {
            transactionCount = newCount;
        }
    }
}
