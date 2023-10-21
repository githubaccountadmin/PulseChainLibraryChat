document.addEventListener('DOMContentLoaded', async function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    
    // Fetch the last 100 blocks initially
    fetchBlocks(100);

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
    
    async function fetchBlocks(blockCount) {
        const latestBlock = await web3.eth.getBlockNumber();
        const fromBlock = Math.max(latestBlock - blockCount, 0);
        
        for(let i = fromBlock; i <= latestBlock; i++) {
            const block = await web3.eth.getBlock(i);
            displayBlockData(block);
        }
    }

    function displayBlockData(block) {
        const window = document.getElementById('transaction-data-window');
        const blockData = {
            number: block.number,
            hash: block.hash,
            transactions: block.transactions
        };
        window.innerHTML += JSON.stringify(blockData, null, 2) + '\n';
    }

    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', postContent);
    document.getElementById('fetchDataButton').addEventListener('click', function() {
        const count = parseInt(document.getElementById('blockCountInput').value);
        fetchBlocks(count);
    });

    web3.eth.net.getId().then(checkPulseChain);
});
