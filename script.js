document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize web3 instance
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');

    // Function to post content to a specific section
    function postContent() {
        const contentInput = document.getElementById('content-input');
        const targetSection = document.getElementById('content-list');
        const newContent = document.createElement('li');
        newContent.innerText = contentInput.value;
        targetSection.appendChild(newContent);
        contentInput.value = ''; // Clear the input field after posting
    }

    // Function to check if connected to PulseChain
    function checkPulseChain(networkId) {
        const networkDisplay = document.getElementById('networkStatus');

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

    // Event listener for the Connect Wallet button
    document.getElementById('connectButton').addEventListener('click', () => {
        // Add your code to connect the wallet here
    });

    // Event listener for the Publish button
    document.getElementById('publish-button').addEventListener('click', () => postContent());

    // Function to fetch transaction data
    async function fetchTransactionData() {
        const window = document.getElementById('transaction-data-window');
        window.innerHTML = 'Fetching data...';
        const apiEndpoint = 'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB&sort=desc';
        try {
            const response = await fetch(apiEndpoint);
            const data = await response.json();
            
            let formattedData = '';
            if (data.status === "1") {
                for (const tx of data.result) {
                    formattedData += `Transaction Hash: ${tx.hash}\n`;
                    formattedData += `From: ${tx.from}\n`;
                    formattedData += `To: ${tx.to}\n`;
                    formattedData += `Value: ${tx.value}\n`;
                    formattedData += `-------------------------------------------------\n`;
                }
            } else {
                formattedData = 'No transactions found';
            }

            window.innerText = formattedData;  // Set innerText to preserve newlines
        } catch (error) {
            console.error(error);
            window.innerHTML = 'Error fetching data.';
        }
    }

    // Event listener for the fetch data button
    document.getElementById('fetchDataButton').addEventListener('click', () => {
        fetchTransactionData();
    });

    // Get and display the current network ID
    web3.eth.net.getId().then(checkPulseChain);
});
