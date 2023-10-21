document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

    async function connectWallet() {
        try {
            const accounts = await ethereum.enable();
            const account = accounts[0];
            console.log(`Connected to account ${account}`);
        } catch (error) {
            console.error('User denied account access');
        }
    }

    function postContent(section) {
        const contentInput = document.getElementById(section + 'Input');
        const targetSection = document.getElementById(section + 'List');
        const newContent = document.createElement('li');
        newContent.innerText = contentInput.value;
        targetSection.appendChild(newContent);
        contentInput.value = '';
    }

    function checkPulseChain(networkId) {
        const networkDisplay = document.getElementById('networkStatus');
        const pulseChainId = 369;
        if (networkId === pulseChainId) {
            networkDisplay.innerHTML = "Connected to PulseChain";
            networkDisplay.style.color = "green";
        } else {
            networkDisplay.innerHTML = "Not connected to PulseChain";
            networkDisplay.style.color = "red";
        }
    }

    document.getElementById('connectButton').addEventListener('click', () => {
        connectWallet();
    });

    document.getElementById('tweetButton').addEventListener('click', () => postContent('tweet'));
    document.getElementById('bookButton').addEventListener('click', () => postContent('book'));
    document.getElementById('storyButton').addEventListener('click', () => postContent('story'));

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

    document.getElementById('fetchDataButton').addEventListener('click', () => {
        fetchTransactionData();
    });

    web3.eth.net.getId().then(checkPulseChain);
});
