document.addEventListener('DOMContentLoaded', function() {
    
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 10;  // Default to the last 10 transactions

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

        console.log("Fetched data:", data);

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

        console.log("Filtered data:", filteredData);

        window.innerText = JSON.stringify(filteredData, null, 2);
    } catch (error) {
        console.error("Error details:", error.name, error.message);
        window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
    }
}

        window.innerText = JSON.stringify(filteredData, null, 2);
    } catch (error) {
        console.error("Error details:", error.name, error.message);
        window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
    }
}

    function updateTransactionCount() {
        const newCount = parseInt(prompt('Enter the number of transactions to fetch:', '10'));
        if (!isNaN(newCount)) {
            transactionCount = newCount;
        }
    }

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', postContent);
    document.getElementById('fetchDataButton').addEventListener('click', fetchTransactionData);
    document.getElementById('fetchDataButton').addEventListener('dblclick', updateTransactionCount);
    web3.eth.net.getId().then(checkPulseChain);
    fetchTransactionData();

});

