document.addEventListener('DOMContentLoaded', () => {
    
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 10;
    
    const networkDisplay = document.getElementById('networkStatus');
    const postInput = document.getElementById('postInput');
    const postList = document.getElementById('postList');
    const transactionDataWindow = document.getElementById('transaction-data-window');
    const transactionCountInput = document.getElementById('transactionCountInput');
    
    const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const networkId = await web3.eth.net.getId();
        checkPulseChain(networkId);
    };

    const checkPulseChain = (networkId) => {
        const pulseChainId = 369;
        networkDisplay.innerHTML = networkId === pulseChainId ? "Connected to PulseChain" : "Not connected to PulseChain";
        networkDisplay.style.color = networkId === pulseChainId ? "green" : "red";
    };

    const postContent = () => {
        const newContent = document.createElement('li');
        newContent.innerText = postInput.value;
        postList.appendChild(newContent);
        postInput.value = '';
    };

    const updateTransactionCount = () => {
        const newCount = parseInt(transactionCountInput.value);
        if (!isNaN(newCount)) {
            transactionCount = newCount;
        }
    };

    const fetchTransactionData = async () => {
        transactionDataWindow.innerHTML = 'Fetching data...';

        const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            const filteredData = data.result
                .filter(tx => tx.input !== '0x')
                .slice(0, transactionCount)
                .map(tx => decodeTransactionInput(tx));

            transactionDataWindow.innerHTML = filteredData.map(tx => `From - ${tx.from}\nMessage - ${tx.input}`).join('\n\n');
        } catch (error) {
            console.error("Error details:", error);
            transactionDataWindow.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    };

    const decodeTransactionInput = (tx) => {
        let decodedInput;
        try {
            decodedInput = web3.utils.hexToUtf8(tx.input);
        } catch (e) {
            console.error("Failed to decode input:", tx.input, e);
            decodedInput = "Invalid UTF-8 data";
        }
        return { from: tx.from, input: decodedInput };
    };

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', postContent);
    document.getElementById('fetchDataButton').addEventListener('click', fetchTransactionData);
    document.getElementById('fetchDataButton').addEventListener('dblclick', updateTransactionCount);

    web3.eth.net.getId().then(checkPulseChain);
    fetchTransactionData();

});
