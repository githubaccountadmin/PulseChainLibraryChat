document.addEventListener('DOMContentLoaded', function() {
    
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

    async function connectWallet() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await web3.eth.net.getId();
        checkPulseChain(networkId);
    }

    function checkPulseChain(networkId) {
        const networkDisplay = document.getElementById('networkStatus');
        const pulseChainId = 369;
        networkDisplay.innerHTML = networkId === pulseChainId ? "Connected to PulseChain" : "Not connected to PulseChain";
        networkDisplay.style.color = networkId === pulseChainId ? "green" : "red";
    }

    function postContent() {
        const contentInput = document.getElementById('postInput');
        const targetSection = document.getElementById('postList');
        const newContent = document.createElement('li');
        newContent.innerText = contentInput.value;
        targetSection.appendChild(newContent);
        contentInput.value = '';
    }

    async function fetchTransactionData() {
        const window = document.getElementById('transaction-data-window');
        window.innerHTML = 'Fetching data...';
        const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            window.innerHTML = JSON.stringify(data, null, 2);
        } catch (error) {
            console.error(error);
            window.innerHTML = 'Error fetching data.';
        }
    }

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', postContent);
    document.getElementById('fetchDataButton').addEventListener('click', fetchTransactionData);
    web3.eth.net.getId().then(checkPulseChain);

});
