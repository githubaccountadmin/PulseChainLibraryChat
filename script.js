// Initialize Web3
const Web3 = require('web3');
let web3 = new Web3(Web3.givenProvider || "YOUR_RPC_URL_HERE");

// Wallet Connection Function
async function connectWallet() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  console.log(`Connected account: ${account}`);
}

// Event Listener for Wallet Connection
document.getElementById('connect-wallet').addEventListener('click', connectWallet);

// Previous code
document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll('.post-button');

    buttons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            let target = e.target.dataset.target;
            let message = document.getElementById(target + '-message').value;
            let targetSection = document.getElementById(target + '-section');

            let newMessage = document.createElement('p');
            newMessage.textContent = message;
            targetSection.appendChild(newMessage);
        });
    });
});
