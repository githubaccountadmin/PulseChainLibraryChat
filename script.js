// Define constants for API endpoints
const apiEndpoints = [
    'https://scan.pulsechain.com/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',
    'https://scan.9mm.pro/api?module=account&action=txlist&address=0x490eE229913202fEFbf52925bF5100CA87fb4421&sort=desc',    
   
];

const maxRetryCount = 3;
const pulseChainId = 369;  // PulseChain network ID - Moved outside of the function

document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let totalTransactions = 0; // Add this line at the top of your script to keep track of total transactions
    let transactionCount = 13;
    let lastIndexProcessed = 0; // Add this line at the top of your script to keep track of the last index processed
    let isConnected = false;
    let globalHexMessage = '';
    let isFirstLoad = true;
    
    console.log("Initial PulseChain ID:", pulseChainId);  // Debugging log

    async function checkInitialConnection() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = accounts.length > 0;
            const networkId = isConnected ? await window.ethereum.request({ method: 'net_version' }) : null;
            console.log("Network ID from Ethereum in checkInitialConnection:", networkId);  // Debugging log
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error checking initial connection:', error);
        }
    }

    async function connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = true;
            const networkId = await window.ethereum.request({ method: 'net_version' });
            console.log("Network ID from Ethereum in connectWallet:", networkId);  // Debugging log
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    function checkPulseChain(networkId) {
        console.log("Network ID from Ethereum:", networkId);
        console.log("PulseChain ID:", pulseChainId);
        console.log("Is connected:", isConnected);
        
        try {
            const connectButton = document.getElementById('connectButton');
    
            // Explicitly convert networkId to a number
            const networkIdNumber = Number(networkId);
            console.log("Converted Network ID:", networkIdNumber);
    
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
            
            console.log("Updating connect button");
            connectButton.innerText = isConnected ? (networkIdNumber === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
            connectButton.style.backgroundColor = isConnected ? (networkIdNumber === pulseChainId ? "green" : "red") : "grey";
            console.log("Button text:", connectButton.innerText);
            console.log("Button color:", connectButton.style.backgroundColor);
            
        } catch (error) {
            console.error('Error checking PulseChain network:', error);
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
    
    function constructAndEncodeMessage(message, selectedOption) {
      const tags = selectedOption.split(',').map(tag => tag.trim());
      const encodedTags = tags.map(tag => `*****(${tag})*****`).join(' ');
      const fullMessage = `${message} ${encodedTags}`;
      return web3.utils.utf8ToHex(fullMessage);
    }
    
    // Updated handlePublishOption function
    function handlePublishOption(option) {
      console.log("handlePublishOption called with option:", option);
      const contentInput = document.getElementById('postInput').value; // Directly get the value
      
      // If no option or empty string, default to "Message"
      if (!option || option.trim() === '') {
        option = "Message";
        publishOptionSelect.value = "Message"; // Update the dropdown to "Message"
      }
      
      // If the option is "Custom", get the value from the custom input field
      if (option === "Custom") {
        option = document.getElementById('customTagInput').value;
      }
      
      // Use the new constructAndEncodeMessage function to handle message construction and encoding
      globalHexMessage = constructAndEncodeMessage(contentInput, option);
      console.log("Updated globalHexMessage:", globalHexMessage);
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
      // Check if already publishing
      if (isPublishing) {
        console.log('Already publishing, please wait...');
        return;
      }
    
      // Set the flag to true
      isPublishing = true;
    
      if (!isConnected) {
        alert('Please connect your wallet before publishing a message.');
        try {
          await connectWallet();
        } catch (error) {
          console.error('Error publishing message:', error);
          isPublishing = false; // Reset the flag
          return;
        }
      }
    
      const contentInput = document.getElementById('postInput');
      const message = contentInput.value;
      const publishOptionSelect = document.getElementById('publishOptionSelect');
    
      if (!message.trim()) {
        console.error('Message is empty.');
        isPublishing = false; // Reset the flag
        return;
      }
    
      let selectedOption = publishOptionSelect.value || "Message";
    
      if (selectedOption === "Custom") {
        selectedOption = document.getElementById('customTagInput').value;
      }
    
      if (selectedOption.trim() === "") {
        selectedOption = "Message";
      }
    
      // Handle multiple tags
      const tags = selectedOption.split(',').map(tag => tag.trim());
      let encodedTags = tags.map(tag => `*****(${tag})*****`).join(' ');
    
      // Add the encoded tags to the message
      const fullMessage = `${message} ${encodedTags}`;
    
      try {
        await sendMessage(fullMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    
      contentInput.value = '';
      isPublishing = false; // Reset the flag
    }
    
    async function sendMessage(fullMessage) {
        const hexMessage = web3.utils.utf8ToHex(fullMessage);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const fromAddress = accounts[0];
        const toAddress = '0x490eE229913202fEFbf52925bF5100CA87fb4421'; // Replace with your contract address
    
        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei('0', 'ether'),
            data: hexMessage,
        };
    
        try {
            const receipt = await web3.eth.sendTransaction(tx);
            console.log('Transaction receipt:', receipt);
        } catch (error) {
            console.error('Error sending transaction:', error);
            throw error; // Added this line to propagate the error
        }
    }
    
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

    async function fetchTransactionData(clearExisting = false) {
        console.log("fetchTransactionData called");  // Debugging line
        try {
            let selectedTags = document.getElementById('tagFilter').value.split(',').map(tag => tag.trim()); // Split by comma and trim
            console.log("Selected Tags from Dropdown: ", selectedTags);  // Debugging line
    
            // New code to handle the default case
            if (selectedTags.length === 0 || selectedTags.includes("All")) {
                selectedTags = ["All"];
                console.log("Defaulting to All Tags");  // Debugging line
            }
            
            // If the selected tag is "Custom", use the value from the custom input field
            if (selectedTags.includes("Custom")) {
                selectedTags = document.getElementById('customFilterInput').value.split(',').map(tag => tag.trim());
                console.log("Selected Tags from Custom Input: ", selectedTags);  // Debugging line
            }
                
            const window = document.getElementById('transactionDataWindow');
        
            if (isFirstLoad) {
                window.innerHTML = 'Fetching data...';
                isFirstLoad = false; // Set it to false after the first load
            }
    
            const data = await fetchDataWithFallback(apiEndpoints);
            console.log("Fetched Data:", data);
            totalTransactions = data.result.length; // Update total transactions
    
            if (transactionCount >= totalTransactions) {
                console.log("Reached the end of available transactions.");
                return; // Exit the function if we've reached the end
            }
            
            let outputText = "";
            const filteredData = data.result.filter(tx => tx.input !== '0x');
            const sliceStart = lastIndexProcessed;
            const sliceEnd = clearExisting ? lastIndexProcessed + 50 : lastIndexProcessed + 13; // Fetch more data if it's a new tag
    
            if (window.innerHTML === 'Fetching data...') {
                window.innerHTML = '';
            }
            
            if (clearExisting) {
                window.innerHTML = '';
            }
            
            filteredData.slice(sliceStart, sliceEnd).forEach(tx => {            
                try {
                    if (web3.utils.isHexStrict(tx.input)) {
                        let decodedInput = web3.utils.hexToUtf8(tx.input);
                        const tagMatches = decodedInput.match(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/g);
                        const tags = tagMatches ? tagMatches.map(match => match.replace(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/, '$1')) : [];
                        console.log("Tags extracted from transaction: ", tags);
                        console.log("Processing transaction with tags: ", tags);  // New Debugging line
                        console.log("Transaction Tags: ", tags);  // Debugging line
                        console.log("Selected Tags: ", selectedTags);  // Debugging line
                        console.log("Selected Tags from Custom Input: ", selectedTags);
                        console.log("Actual value of selectedTags: ", JSON.stringify(selectedTags));
            
                        // Remove the tags from the decoded input
                        tags.forEach(tag => {
                            decodedInput = decodedInput.replace(`*****(${tag})*****`, '');
                        });
            
                        // Check if all of the selectedTags are present in the tags of the transaction
                        console.log("Selected Tags: ", selectedTags);
                        console.log("Transaction Tags: ", tags);
                        const hasAnyMatchingTags = selectedTags.some(selTag => tags.includes(selTag));
                        console.log("Has Any Matching Tags: ", hasAnyMatchingTags);  // Debugging line
            
                        if (selectedTags.includes("All") || hasAnyMatchingTags || selectedTags.length === 0) {
                            const tagString = tags.join(', ');
            
                            if (tags.length > 0) {
                                outputText += `<div class="transaction"><p>Publisher: ${tx.from} - Published a ${tagString}<br><br><br><span class="transaction-body">${decodedInput.trim()}</span></p></div>`;
                            } else {
                                outputText += `<div class="transaction"><p>Publisher: ${tx.from} - <span class="transaction-tag">Message:</span> <span class="transaction-body">${decodedInput.trim()}</span></p></div>`;
                            }
                        }
                    }
                } catch (error) {
                    // Skip this transaction and continue processing other transactions
                    console.error('Error processing transaction:', error);
                }
            });

            window.innerHTML += outputText;  // Append new transactions to the existing ones
            lastIndexProcessed = sliceEnd;  // Update the last index processed for the next fetch

            if (lastIndexProcessed >= totalTransactions) {
                console.log("Reached the end of available transactions.");
                return; // Exit the function if we've reached the end
            }            
              
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = `Error fetching data: ${error.name} - ${error.message}`;
        }
    }
    
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to toggle the visibility of the custom tag input box based on the selected option
    function toggleCustomTagInput(selectElement, inputElementId) {
        const inputElement = document.getElementById(inputElementId);
        if (selectElement.value === "Custom") {
            inputElement.style.display = "inline";
        } else {
            inputElement.style.display = "none";
        }
    }

    // Function to fetch more transaction data when scrolled to the bottom
    document.getElementById('transactionDataWindow').addEventListener('scroll', async function() {
        const { scrollTop, scrollHeight, clientHeight } = this;
        
        if(clientHeight + scrollTop >= scrollHeight - 5) {
            await fetchTransactionData();
        }
    });
    
    document.getElementById('tagFilter').addEventListener('change', async function() {
        lastIndexProcessed = 0; // Reset the last index
        const window = document.getElementById('transactionDataWindow');
        window.innerHTML = ''; // Clear the window
        await fetchTransactionData(true); // Fetch new data with clearExisting set to true
        
        let selectedTags = this.value;
        
        // If the selected tag is "Custom", use the value from the custom input field
        if (selectedTags === "Custom") {
            selectedTags = document.getElementById('customFilterInput').value;
        }
        
        // Keep fetching until a matching tag is found, the window is filled, or we reach the end
        while ((window.scrollHeight <= window.clientHeight || window.innerHTML.indexOf(selectedTags) === -1) && lastIndexProcessed < totalTransactions) {
            await fetchTransactionData();
        }
    });

    // Add event listener to toggle custom tag input for publish options
    document.getElementById('publishOptionSelect').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customTagInput');
    });
    
    // Add event listener to toggle custom tag input for filter
    document.getElementById('tagFilter').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customFilterInput');
    });
    
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    document.getElementById('confirmPublishButton').addEventListener('click', async function() {
        console.log("Confirm button clicked. Preparing to publish message...");
        // Disable the confirm button to prevent multiple clicks
        this.disabled = true;
        hidePublishOptions(); // Hide the publish options
        const publishOptionSelect = document.getElementById('publishOptionSelect');
        let selectedOption = publishOptionSelect.value;
    
        if (selectedTags.includes("Custom")) {
            selectedTags = document.getElementById('customFilterInput').value.split(',').map(tag => tag.trim());
        }
    
        if (selectedOption === "") {
            publishOptionSelect.value = "Message";
        }
    
        try {
            await publishMessage();
        } catch (error) {
            console.error('Error publishing message:', error);
        } finally {
            // Re-enable the confirm button after the message is sent
            this.disabled = false;
        }
    });

    let searchTimer;  // Declare a variable to hold the timer

    document.getElementById('customFilterInput').addEventListener('input', function() {
        console.log("Custom input changed: ", this.value);  // Debugging line
        clearTimeout(searchTimer);  // Clear the existing timer
    
        // Start a new timer
        searchTimer = setTimeout(async function() {
            console.log("Timer completed, starting search");  // Add this line
            lastIndexProcessed = 0; // Reset the last index
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = ''; // Clear the window
    
            let selectedTags = document.getElementById('customFilterInput').value.split(',').map(tag => tag.trim());
    
            await fetchTransactionData(true);  // Fetch new data with clearExisting set to true
    
            // Keep fetching until a matching tag is found, the window is filled, or we reach the end
            let iterationCount = 0;  // Add this line to count iterations
            const maxIterations = 10;  // Maximum number of iterations
    
            while ((window.scrollHeight <= window.clientHeight) && lastIndexProcessed < totalTransactions) {
                if (iterationCount >= maxIterations) {  // Check if maximum iterations reached
                    console.log("Maximum iterations reached. Breaking loop.");
                    break;
                }
    
                let previousLastIndex = lastIndexProcessed;  // Store the previous last index
    
                await fetchTransactionData();
    
                // Check if new data was fetched
                if (previousLastIndex === lastIndexProcessed) {
                    console.log("No new data fetched. Breaking loop.");
                    break;
                }
    
                iterationCount++;  // Increment the iteration count
            }
        }, 3000);  // 3-second delay
    });

    checkInitialConnection();
    fetchTransactionData();
    setRandomTitle();
    // setInterval(fetchTransactionData, 120000);
    
});
