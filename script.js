document.addEventListener('DOMContentLoaded', function() {

    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 10; // Default to fetching the last 10 transactions

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
        const window = document.getElementById('transactionDataWindow');
        window.innerHTML = 'Fetching data...';

        const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';

        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            const filteredData = data.result.filter(tx => tx.input !== '0x').slice(0, transactionCount).map(tx => {
                let decodedInput;
                try {
                    decodedInput = web3.utils.isHexStrict(tx.input) ? web3.utils.hexToUtf8(tx.input) : 'Not a hex string';
                } catch (error) {
                    console.error(`Error decoding hex to UTF-8 for tx.input: ${tx.input}`);
                    console.error(error);
                    decodedInput = 'Invalid UTF-8 data';
                }
                return {
                    from: tx.from,
                    input: decodedInput
                };
            });
            window.innerText = JSON.stringify(filteredData, null, 2);
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    }

    function updateTransactionCount() {
        const newCount = parseInt(document.getElementById('transactionCountInput').value);
        if (!isNaN(newCount) && newCount > 0) {
            transactionCount = newCount;
        }
    }

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', postContent);
    document.getElementById('loadMoreTransactionsButton').addEventListener('click', fetchTransactionData);
    document.getElementById('transactionCountInput').addEventListener('input', updateTransactionCount);

    web3.eth.net.getId().then(checkPulseChain);
    fetchTransactionData();
});
