const maxRetryCount = 3;
const pulseChainId = 369;

document.addEventListener('DOMContentLoaded', function() {
    const web3 = new Web3(Web3.givenProvider || 'https://rpc.pulsechain.com');
    let totalTransactions = 0;
    let transactionCount = 13;
    let lastIndexProcessed = 0;
    let isConnected = false;
    let globalHexMessage = '';
    let isFirstLoad = true;

    async function checkInitialConnection() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            isConnected = accounts.length > 0;
            const networkId = isConnected ? await window.ethereum.request({ method: 'net_version' }) : null;

            console.log('isConnected:', isConnected);
            console.log('networkId:', networkId);
            
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
            checkPulseChain(networkId);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    }

    function checkPulseChain(networkId) {
        try {
            const connectButton = document.getElementById('connectButton');
    
            const networkIdNumber = Number(networkId);
                
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
            
            connectButton.innerText = isConnected ? (networkIdNumber === pulseChainId ? "Connected" : "Not connected to PulseChain") : "Connect Wallet";
            connectButton.style.backgroundColor = isConnected ? (networkIdNumber === pulseChainId ? "green" : "red") : "grey";
                        
        } catch (error) {
            console.error('Error checking PulseChain network:', error);
        }
    }

    function setRandomTitle() {
        try {
            const titles = [
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
        }
    }
    
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    function hidePublishOptions() {
        document.getElementById('publishOptions').style.display = 'none';
    }
    
    function constructAndEncodeMessage(message, selectedOption) {
      const tags = selectedOption.split(',').map(tag => tag.trim());
      const encodedTags = tags.map(tag => `*****(${tag})*****`).join(' ');
      const fullMessage = `${message} ${encodedTags}`;
      return web3.utils.utf8ToHex(fullMessage);
    }
    
    function handlePublishOption(option) {
      const contentInput = document.getElementById('postInput').value;
      
      if (!option || option.trim() === '') {
        option = "Message";
        publishOptionSelect.value = "Message";
      }
      
      if (option === "Custom") {
        option = document.getElementById('customTagInput').value;
      }
      
      globalHexMessage = constructAndEncodeMessage(contentInput, option);
    }
    
    const publishOptionSelect = document.getElementById('publishOptionSelect');
    
    publishOptionSelect.addEventListener('click', function() {
        if (this.value === "") {
            handlePublishOption("Message");
            globalHexMessage = web3.utils.utf8ToHex("*****(Message)*****");
        }
    });
    
    publishOptionSelect.addEventListener('change', function() {
        try {
            handlePublishOption(publishOptionSelect.value);
        } catch (error) {
            console.error('Error in handlePublishOption:', error);
        }
    });
    
    let isPublishing = false;
    
    async function publishMessage(selectedTags) {
      if (isPublishing) {
        return;
      }
    
      isPublishing = true;
    
      if (!isConnected) {
        alert('Please connect your wallet before publishing a message.');
        try {
          await connectWallet();
        } catch (error) {
          console.error('Error publishing message:', error);
          isPublishing = false;
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
    
      const tags = selectedOption.split(',').map(tag => tag.trim());
      let encodedTags = tags.map(tag => `*****(${tag})*****`).join(' ');
    
      const fullMessage = `${message} ${encodedTags}`;
    
      try {
        await sendMessage(fullMessage);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    
      contentInput.value = '';
      isPublishing = false;
    }
    
    async function sendMessage(fullMessage) {
        const hexMessage = web3.utils.utf8ToHex(fullMessage);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const fromAddress = accounts[0];
        const toAddress = '0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB';
        
        if (!isConnected) {
            console.error('Wallet is not connected. Cannot send message.');
            return;
        }
        
        const tx = {
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei('0', 'ether'),
            data: hexMessage,
        };
    
        try {
            await web3.eth.sendTransaction(tx);
        } catch (error) {
            console.error('Error sending transaction:', error);
            await checkInitialConnection();
            throw error;
        }
    }
    
    async function fetchTransactionData(clearExisting = false) {
        try {
            const endpoint = 'https://api.scan.pulsechain.com/api/v2/addresses/0x9Cd83BE15a79646A3D22B81fc8dDf7B7240a62cB/transactions?filter=to%20%7C%20from';
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status code: ${response.status}`);
            }

            // Log the entire API response here
            console.log("API Response:", response);
            
            let selectedTags = document.getElementById('tagFilter').value.split(',').map(tag => tag.trim());
            
            if (selectedTags.length === 0 || selectedTags.includes("All")) {
                selectedTags = ["All"];
            }
            
            if (selectedTags.includes("Custom")) {
                selectedTags = document.getElementById('customFilterInput').value.split(',').map(tag => tag.trim());
            }
                
            const window = document.getElementById('transactionDataWindow');
        
            if (isFirstLoad) {
                window.innerHTML = 'Fetching data...';
                isFirstLoad = false;
            }
    
            const data = await response.json();
            console.log("API Response:", data); // Add this line

            if (!data || !Array.isArray(data.items)) {
                throw new Error('Invalid data format or missing result array.');
            }
            
            totalTransactions = data.items.length;
    
            if (transactionCount >= totalTransactions) {
                return;
            }
            
            let outputText = "";
            const filteredData = data.items.filter(tx => tx.raw_input !== '0x');
            const sliceStart = lastIndexProcessed;
            const sliceEnd = clearExisting ? lastIndexProcessed + 50 : lastIndexProcessed + 13;
    
            if (window.innerHTML === 'Fetching data...') {
                window.innerHTML = '';
            }
            
            if (clearExisting) {
                window.innerHTML = '';
            }
            
            filteredData.slice(sliceStart, sliceEnd).forEach(tx => {            
                try {
                    if (web3.utils.isHexStrict(tx.raw_input)) {
                        let decodedInput = '';
                        try {
                            decodedInput = web3.utils.hexToUtf8(tx.raw_input);
                        } catch (utfError) {
                            console.error('Error decoding UTF-8:', utfError);
                            // Handle the error gracefully or skip this transaction
                            return;
                        }
                        const tagMatches = decodedInput.match(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/g);
                        const tags = tagMatches ? tagMatches.map(match => match.replace(/\*\*\*\*\*\((.*?)\)\*\*\*\*\*/, '$1')) : [];
                        
                        tags.forEach(tag => {
                            decodedInput = decodedInput.replace(`*****(${tag})*****`, '');
                        });
            
                        const hasAllMatchingTags = selectedTags.every(selTag => tags.includes(selTag));
            
                        if (selectedTags.includes("All") || hasAllMatchingTags || selectedTags.length === 0) {
                            const tagString = tags.join(', ');
                        
                            // Convert the ISO 8601 timestamp to a JavaScript Date object
                            const txTime = new Date(tx.timestamp);
                            
                            // Format the Date object to a human-readable string
                            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
                            const formattedTime = new Intl.DateTimeFormat('en-US', options).format(txTime);
                        
                            if (tags.length > 0) {
                                outputText += `<div class="transaction"><p>Published on ${formattedTime} by ${tx.from.hash} - ${tagString}<br><br><br><span class="transaction-body">${decodedInput.trim()}</span></p></div>`;
                            } else {
                                outputText += `<div class="transaction"><p>Published on ${formattedTime} by ${tx.from.hash} - <span class="transaction-tag">Message:</span> <span class="transaction-body">${decodedInput.trim()}</span></p></div>`;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error processing transaction:', error);
                }
            });

            window.innerHTML += outputText;
            lastIndexProcessed = sliceEnd;

            if (lastIndexProcessed >= totalTransactions) {
                return;
            }            
              
        } catch (error) {
            console.error("Error details:", error.name, error.message);
            const window = document.getElementById('transactionDataWindow');
            window.innerHTML = `Error fetching data: ${error.message}`;
        }
    }
    
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function toggleCustomTagInput(selectElement, inputElementId) {
        const inputElement = document.getElementById(inputElementId);
        if (selectElement.value === "Custom") {
            inputElement.style.display = "inline";
        } else {
            inputElement.style.display = "none";
        }
    }

    document.getElementById('transactionDataWindow').addEventListener('scroll', async function() {
        const { scrollTop, scrollHeight, clientHeight } = this;
        
        if(clientHeight + scrollTop >= scrollHeight - 5) {
            await fetchTransactionData();
        }
    });
    
    document.getElementById('tagFilter').addEventListener('change', async function() {
        lastIndexProcessed = 0;
        const window = document.getElementById('transactionDataWindow');
        window.innerHTML = '';
        await fetchTransactionData(true);
        
        let selectedTags = this.value;
        
        if (selectedTags === "Custom") {
            selectedTags = document.getElementById('customFilterInput').value;
        }
        
        while ((window.scrollHeight <= window.clientHeight || window.innerHTML.indexOf(selectedTags) === -1) && lastIndexProcessed < totalTransactions) {
            await fetchTransactionData();
        }
    });

    document.getElementById('publishOptionSelect').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customTagInput');
    });
    
    document.getElementById('tagFilter').addEventListener('change', function() {
        toggleCustomTagInput(this, 'customFilterInput');
    });
    
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('publishButton').addEventListener('click', function() {
        document.getElementById('publishOptions').style.display = 'block';
    });
    
    document.getElementById('confirmPublishButton').addEventListener('click', async function() {
        this.disabled = true;
        hidePublishOptions();
        const publishOptionSelect = document.getElementById('publishOptionSelect');
        let selectedOption = publishOptionSelect.value;
        let selectedTags = document.getElementById('tagFilter').value.split(',').map(tag => tag.trim());
        if (selectedTags.includes("Custom")) {
            selectedTags = document.getElementById('customFilterInput').value.split(',').map(tag => tag.trim());
        }
    
        if (selectedOption === "") {
            publishOptionSelect.value = "Message";
        }
    
        try {
            await publishMessage(selectedTags);
        } catch (error) {
            console.error('Error publishing message:', error);
        } finally {
            this.disabled = false;
        }
    });

    let searchTimer;  // Declare a variable to hold the timer

    document.getElementById('customFilterInput').addEventListener('input', function() {
        clearTimeout(searchTimer);  // Clear the existing timer
    
        // Start a new timer
        searchTimer = setTimeout(async function() {
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
                    break;
                }
    
                let previousLastIndex = lastIndexProcessed;  // Store the previous last index
    
                await fetchTransactionData();
    
                // Check if new data was fetched
                if (previousLastIndex === lastIndexProcessed) {
                    break;
                }
    
                iterationCount++;  // Increment the iteration count
            }
        }, 3000);  // 3-second delay
    });

    // checkInitialConnection();
    setRandomTitle();
    fetchTransactionData();
    // setInterval(fetchTransactionData, 120000);
    
});
