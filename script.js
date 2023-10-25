// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',    
   
];

const maxRetryCount = 3;
let timer = null;
let mainAddress;

// Move setMainAddress outside of publishMessage
async function setMainAddress() {
    try {
        const addresses = await publishMessage();
        console.log("Inside setMainAddress: addresses returned are ", addresses);
        mainAddress = addresses.toAddress;
        console.log("Inside setMainAddress: mainAddress is now ", mainAddress);
    } catch (error) {
        console.error("Error in setMainAddress:", error);
    }
}
        
document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let transactionCount = 33;
    let isConnected = false;
    let globalHexMessage = '';
    const savedPublisherName = localStorage.getItem('publisherName');
    if (savedPublisherName) {
        document.getElementById('publisherNameInput').value = savedPublisherName;
    }
    
    const savedWalletAddress = localStorage.getItem('walletAddress');
    if (savedWalletAddress) {
    // Do something with the saved wallet address if needed
    }
    
    // After setting up the savedWalletAddress and savedPublisherName from localStorage
    if (savedWalletAddress) {
        // Trigger the username fetch for the saved wallet address
        startUserNameFetchTimer(savedWalletAddress, /* mainAddress, if needed */);
    }
    
    document.getElementById('transactionCountInput').value = transactionCount;

    async function checkInitialConnection() {
        try {
            const accounts = await web3.eth.getAccounts();
            isConnected = accounts.length > 0;
            const networkId = isConnected ? await web3.eth.net.getId() : null;
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error checking initial connection:', error);
            // Handle the error and provide user feedback
        }
    }

    // Saving wallet address to localStorage when connecting
    async function connectWallet() {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        isConnected = true;
        const walletAddress = accounts[0];
        localStorage.setItem('walletAddress', walletAddress);  // Save to localStorage
        const networkId = await web3.eth.net.getId();
        checkPulseChain(networkId);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        // Handle the error and provide user feedback
      }
    }

    function checkPulseChain(networkId) {
        try {
            const connectButton = document.getElementById('connectButton');
            const pulseChainId = 369;  // PulseChain network ID

            // Add hover effect for connectButton
            connectButton.addEventListener('mouseover', function() {
                if (!isConnected) {
                    this.style.backgroundColor = 'green';
                }
            });

            connectButton.addEventListener('mouseout', function() {
                if (!isConnected) {
                    this.style.backgroundColor = 'grey';
                }
            });
            
            connectButton.innerText = isConnected ? (networkId === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
            connectButton.style.backgroundColor = isConnected ? (networkId === pulseChainId ? "green" : "red") : "grey";
        } catch (error) {
            console.error('Error checking PulseChain network:', error);
            // Handle the error and provide user feedback
        }
    }

    function startUserNameFetchTimer(walletAddress, mainAddress) {
        // If a timer already exists, clear it
        console.log("About to check timer, which is:", timer);
        if (timer !== null) {
            clearInterval(timer);
        }
        
        // Create an asynchronous function to use await within it
        const fetchUserNameIfEmpty = async () => {
            const publisherNameInput = document.getElementById('publisherNameInput');
            
            // Only fetch the user name if the input box is empty
            if (!publisherNameInput.value) {
                await fetchUserNameFromBlockchain(walletAddress, mainAddress);
            }
        };
    
        // Immediately call the function when startUserNameFetchTimer is called
        fetchUserNameIfEmpty();
    
        // Then set up the timer to call it every 2 minutes (120000 milliseconds)
        timer = setInterval(fetchUserNameIfEmpty, 120000);
    }
    
    // Save to localStorage when setting publisher name
    function setPublisherName() {
      const publisherName = publisherNameInput.value.trim();
    
      if (publisherName) {
        publisherNameInput.value = publisherName; // Keep the publisher name inside the input field
        localStorage.setItem('publisherName', publisherName);  // Save to localStorage
    
        // Add a flash effect
        publisherNameInput.classList.add("flash");
        setTimeout(() => publisherNameInput.classList.remove("flash"), 500); // Remove flash effect after 500ms
      } else {
        alert('Please enter a valid publisher name.');
      }
    }

    function setRandomTitle() {
        try {
            const titles = [
                // Array of random titles
                "The Great Library of PulseChain: Home of the Immutable Publishing House",
                "The Great Library & Publishing House of PulseChain: Your Words, Our Blocks",
                "PulseChain's Magna Bibliotheca: A Great Library and Publishing House",
                "The Great Library of PulseChain: Where Publishers Become Historians",
                "PulseChain Publishing House: An Annex to The Great Library",
                "The Pulsating Shelves: The Great Library & Publishing House of PulseChain",
                "The Grand Archive and Publishing House of PulseChain: A Great Library for All",
                "PulseChain’s Scholarly Publishing House: A Chapter in The Great Library",
                "The Great Library of PulseChain's Eternal Publishing House: A Living Ledger",
                "The Great Library & Immutable Publishing House of PulseChain: Where Every Word Counts"
            ];
            
            const titleElement = document.getElementById('dynamicTitle');
            const randomIndex = Math.floor(Math.random() * titles.length);
            titleElement.innerText = titles[randomIndex];
        } catch (error) {
            console.error('Error setting random title:', error);
            // Handle the error and provide user feedback
        }
    }
    
    // Function to show publish options (the dropdown)
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    // Function to hide publish options (the dropdown)
    function hidePublishOptions() {
        document.getElementById('publishOptions').style.display = 'none';
    }
    
    // Update handlePublishOption function to call hidePublishOptions() after publishing
    function handlePublishOption(option) {
        console.log("handlePublishOption called with option: ", option);
        const contentInput = document.getElementById('postInput');
    
        // Trim leading and trailing white spaces and check if the resulting string is empty
        if (!option || option.trim() === '') {
            // If no option is selected, default to "Message"
            option = "Message";
            publishOptionSelect.value = "Message"; // Set the select element to "Message"
        }
    
        const message = `*****(${option})***** ${contentInput.value}`;
        console.log("About to update globalHexMessage: ", globalHexMessage);
        globalHexMessage = web3.utils.utf8ToHex(message);
        console.log("Updated globalHexMessage: ", globalHexMessage);
        // ...
        console.log("At the end of handlePublishOption, globalHexMessage is: ", globalHexMessage);
    }
    
    const publishOptionSelect = document.getElementById('publishOptionSelect');
    
   // Add this event listener to handle the initial click on the dropdown
    publishOptionSelect.addEventListener('click', function() {
        if (this.value === "") {
            console.log("No option selected. Defaulting to 'Message'...");
            handlePublishOption("Message");
            // Update globalHexMessage directly here
            globalHexMessage = web3.utils.utf8ToHex("*****(Message)*****");
            console.log("Updated globalHexMessage: ", globalHexMessage);
        }
    });
    
    // Event listener for changes in the dropdown menu
    publishOptionSelect.addEventListener('change', function() {
        console.log("A publish-option was selected! Invoking handlePublishOption...");
        try {
            handlePublishOption(publishOptionSelect.value);
        } catch (error) {
            console.error('Error in handlePublishOption:', error);
        }
    });
    
    // Add a boolean flag to prevent multiple executions
    let isPublishing = false;
    
    async function publishMessage() {
        try {
            console.log("Is Connected:", isConnected); // Diagnostic Log
            if (!isConnected) {
                alert('Please connect your wallet first.');
                return;
            }
        
            const contentInput = document.getElementById('postInput');
            const message = contentInput.value;
        
            // Check if message is empty
            if (!message.trim()) {
                console.error('Message is empty.');
                return;
            }
            
            const publishOptionSelect = document.getElementById('publishOptionSelect'); 
            const selectedOption = publishOptionSelect.value || "Message"; // Default to "Message" if nothing is selected
            
            // Get the publisher name from the input field
            const publisherName = document.getElementById('publisherNameInput').value;
        
            // Updated to include publisher's name
            const fullMessage = `\n\n${message}\n\n*****(${selectedOption})*****\n\nPublisher: ${publisherName}`;
        
            const hexMessage = web3.utils.utf8ToHex(fullMessage);
        
            const accounts = await web3.eth.getAccounts();
            console.log("Accounts:", accounts); // Diagnostic Log
            const fromAddress = accounts[0];
            console.log("From Address:", fromAddress); // Diagnostic Log
            const toAddress = '0x490eE229913202fEFbf52925bF5100CA87fb4421'; // Replace with the main contract address to send transactions to
            console.log("Direct To Address:", '0x490eE229913202fEFbf52925bF5100CA87fb4421');
            
            // Get the current nonce for your account
            const nonce = await web3.eth.getTransactionCount(fromAddress, 'latest');
        
            const tx = {
                from: fromAddress,
                to: toAddress,
                value: web3.utils.toWei('0', 'ether'),
                data: hexMessage,
                gas: 30000000, // Set the gas limit appropriately
                nonce: nonce, // Include the nonce in the transaction
            };
        
            try {
                // Send the transaction
                const receipt = await web3.eth.sendTransaction(tx);
                console.log('Transaction receipt:', receipt);
        
                // Provide user feedback for a successful transaction
                contentInput.value = ''; // Clear the text area
                return {
                    fromAddress: fromAddress,
                    toAddress: toAddress
                };
            } catch (error) {
                console.error('Error sending transaction:', error);
            }
        } catch (error) {
            console.error('Error in publishMessage function:', error);
        }
    }

    // Then you can call setMainAddress when needed
    setMainAddress();
    
    async function fetchDataWithFallback(endpoints) {
        for (const endpoint of endpoints) {
            for (let retryCount = 1; retryCount <= maxRetryCount; retryCount++) {
                try {
                    const response = await fetch(endpoint);
                    if (response.status === 200) {
                        return await response.json();
                    }
                } catch (error) {
                    console.log(`Fetching data from ${endpoint} failed (Retry ${retryCount}). Trying again...`);
                }
            }
        }
        throw new Error('All API endpoints have failed. Please reload the page to try again.');
    }

    async function fetchTransactionData() {
        try {
            // Get the selected tag from the dropdown
            const selectedTag = document.getElementById('tagFilter').value;
    
            // Update this line to get the count from the input box
            const newCount = parseInt(document.getElementById('transactionCountInput').value);
            if (!isNaN(newCount)) {
                transactionCount = newCount;
            }
    
            console.log("Selected Tag: ", selectedTag);
            console.log("Transaction Count: ", transactionCount);
    
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = 'Fetching data...';
    
            const data = await fetchDataWithFallback(apiEndpoints);
            let outputText = "";
            data.result.filter(tx => tx.input !== '0x').slice(0, transactionCount).forEach(tx => {
                try {
                    if (web3.utils.isHexStrict(tx.input)) {
                        let decodedInput = web3.utils.hexToUtf8(tx.input);
            
                        // Extract the tag from the message
                        const tagMatch = decodedInput.match(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/);
                        const tag = tagMatch ? tagMatch[1] : null;
            
                        // Skip if the selected tag does not match the message's tag
                        if (selectedTag !== 'All' && tag !== selectedTag) {
                            return;
                        }
            
                        // Extract the publisher's name from the message
                        const publisherMatch = decodedInput.match(/Publisher: (.+)/);
                        const publisherName = publisherMatch ? publisherMatch[1] : tx.from;  // Use tx.from as fallback
            
                        // Remove tag and publisher's name from the message
                        if (tag) {
                            decodedInput = decodedInput.replace(`*****(${tag})*****`, '');
                        }
                        if (publisherName) {
                            decodedInput = decodedInput.replace(`Publisher: ${publisherName}`, '');
                        }
            
                        // Build the output text
                        if (tag) {
                            outputText += `<div class="transaction"><p>Publisher: ${publisherName} - Published a ${tag}<br><br>${decodedInput.trim()}</p></div>`;
                        } else {
                            outputText += `<div class="transaction"><p>Publisher: ${publisherName} - Message: ${decodedInput.trim()}</p></div>`;
                        }
                    }
                } catch (error) {
                    // Skip this transaction and continue processing other transactions
                    console.error('Error processing transaction:', error);
                }
            });
    
            window.innerHTML = outputText;
    
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    }
    
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function updateTransactionCount() {
        try {
            const newCount = parseInt(document.getElementById('transactionCountInput').value);
            if (!isNaN(newCount)) {
                transactionCount = newCount;
            }
        } catch (error) {
            console.error('Error updating transaction count:', error);
            // Handle the error and provide user feedback
        }
    }

    // Get the publisher's name input field, "Set Publisher" button, and display area
    const publisherNameInput = document.getElementById('publisherNameInput');
    const setPublisherNameButton = document.getElementById('setPublisherNameButton');
    const publisherNameDisplay = document.getElementById('publisherNameDisplay');
    
    // Get the content input field and publish button
    const postInput = document.getElementById('postInput');
    const publishButton = document.getElementById('publishButton');
    
    // Function to set publisher name
    function setPublisherName() {
      const publisherName = publisherNameInput.value.trim();
    
      if (publisherName) {
        publisherNameInput.value = publisherName; // Keep the publisher name inside the input field
        
        // Add a flash effect
        publisherNameInput.classList.add("flash");
        setTimeout(() => publisherNameInput.classList.remove("flash"), 500); // Remove flash effect after 500ms
      } else {
        alert('Please enter a valid publisher name.');
      }
    }
    
    // Attach an event listener to the "Set Publisher Name" button
    setPublisherNameButton.addEventListener('click', setPublisherName);
    
    // Function to publish content with the publisher's name
    function publishContent() {
      console.log("Publish button clicked"); // Debugging log
      
      const content = postInput.value;
      
      let parts = [content.trim()];
    
      // Add the tag
      const selectedTag = document.getElementById('publishOptionSelect').value;
      if (selectedTag) {
        parts.push(`*****(${selectedTag})*****`);
      }
    
      // Add the publisher name
      const publisherName = publisherNameInput.value;
      console.log("Publisher name is:", publisherName); // Debugging log
      if (publisherName) {
        parts.push(`Publisher: ${publisherName}`);
      }
    
      const fullContent = parts.join(' ');
      console.log("Full content is:", fullContent);  // Add this line for debugging
    
      // Check if the content is empty before proceeding
      if (!fullContent.trim()) {
        alert('Message cannot be empty');
        return;
      }
    
      // You can now proceed to publish or display fullContent
      // ...
      // postInput.value = ''; // This clears the textbox after publishing
    }
    
    // Add an event listener to the "Publish" button
    publishButton.addEventListener('click', publishContent);
    
    async function extractPublisherName() {
        console.log('extractPublisherName called');  // Debugging line 1
        const message = await fetchUserNameFromBlockchain();  // I'm assuming this function fetches the necessary message data
    
        console.log('Fetched message:', message);  // Debugging line 2
    
        // The regular expression assumes the tag will appear before the publisher name.
        // Capture any of these five specific tags: Message, Story, Book, Document, Other
        const tagRegExp = /\*\*\*\*\*(Message|Story|Book|Document|Other)\*\*\*\*\*/;
    
        // Extract the tag
        const tagMatch = message.match(tagRegExp);
        const tag = tagMatch ? tagMatch[1] : null;
    
        console.log('Extracted tag:', tag);  // Debugging line 3
    
        if (tag) {
            // Now that we have the tag, look for the publisher name after it.
            const publisherRegExp = new RegExp(`\\*\\*\\*\\*\\*${tag}\\*\\*\\*\\*\\*.*Publisher: (.+)`);
            const publisherMatch = message.match(publisherRegExp);
            const publisherName = publisherMatch ? publisherMatch[1] : 'Unknown';
    
            console.log('Extracted publisher name:', publisherName);  // Debugging line 4
            return publisherName;
        } else {
            console.log('No tag found in the message.');  // Debugging line 5
            return 'Unknown';
        }
    }
    
    async function fetchUserNameFromBlockchain(walletAddress, mainAddress) {
        console.log("Starting fetchUserNameFromBlockchain..."); // Log the start of the function
        console.log("Wallet Address: ", walletAddress);  // Debugging line for walletAddress
        console.log("Main Address: ", mainAddress);  // Debugging line for mainAddress
    
        const apiUrl = `https://scan.pulsechain.com/api?module=account&action=txlist&address=${walletAddress}&sort=desc`;
    
        try {
            console.log(`Fetching data from ${apiUrl}`); // Log the API URL being fetched
            
            // Here we'll use fetch() directly to get the data
            const response = await fetch(apiUrl);
            
            // Debugging line for complete HTTP response
            console.log("Complete HTTP response: ", response);  
    
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const jsonData = await response.json();
            
            // Debugging line for complete JSON response
            console.log("Complete JSON response: ", jsonData);  
    
            const transactions = jsonData.result;  // Assuming 'result' contains the list of transactions
            
            console.log("Fetched data: ", transactions);  // Log fetched data
    
            if (transactions && transactions.length > 0) {
                console.log("Transactions found"); 
                
                for (const tx of transactions) {
                    const message = tx.data || tx.input;
                    
                    // Call extractPublisherName with the fetched message
                    const publisherName = await extractPublisherName(message);
                    
                    console.log("Examined transaction: ", tx);  // Log examined transaction
                    
                    if (publisherName) {
                        console.log(`Publisher name found: ${publisherName}`);
                        document.getElementById('publisherNameInput').value = publisherName;
                        return; 
                    }
                }
            } else {
                console.log("No transactions found");
            }
        } catch (error) {
            console.log(`Failed to fetch data from ${apiUrl}: ${error}`);
        }
        
        // If no publisher name is found, display the wallet address
        document.getElementById('publisherNameInput').value = walletAddress;
    }
    
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    document.getElementById('loadMoreTransactionsButton').addEventListener('click', fetchTransactionData);
    document.getElementById('tagFilter').addEventListener('change', fetchTransactionData);
    
    // Single Event Listener for "Confirm" button to hide publish options and send the message
    document.getElementById('confirmPublishButton').addEventListener('click', async function() {
        console.log("Confirm button clicked. Preparing to publish message...");
        
        // Disable the confirm button to prevent multiple clicks
        this.disabled = true;
    
        hidePublishOptions(); // Hide the publish options
    
        const publishOptionSelect = document.getElementById('publishOptionSelect');
        const selectedOption = publishOptionSelect.value;
    
        if (selectedOption === "") {
            // If no option is selected, set it to "Message"
            publishOptionSelect.value = "Message";
        }
    
        try {
            await publishMessage(); // Publish the message
        } catch (error) {
            console.error('Error publishing message:', error);
        } finally {
            // Re-enable the confirm button after the message is sent
            this.disabled = false;
        }
    });
    
    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();
    
    setInterval(fetchTransactionData, 120000);
    
});
