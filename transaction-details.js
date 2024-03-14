document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');

    // Function to handle click events on transaction window links
    function handleTransactionWindowClick(event) {
        // Ensure the clicked element is a link within the transaction window
        const isTransactionLink = event.target.closest('.transaction-wrapper a');
        if (isTransactionLink) {
            // Check if the required elements are available before proceeding
            const txTimeElement = document.querySelector('.transaction-details.transaction-time');
            const fromAddressElement = document.querySelector('.transaction-details.from-address');
            const transactionTagsElement = document.querySelector('.transaction-details.transaction-tags');

            // Check if any required element is missing
            if (!txTimeElement || !fromAddressElement || !transactionTagsElement) {
                console.error('One or more required elements not found.');
                event.preventDefault(); // Prevent default behavior of the link
            }
        }
    }

    // Add event listener to handle click events on transaction window links
    document.addEventListener('click', handleTransactionWindowClick);

    // Check if the URL contains transaction details
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');
    const decodedInput = urlParams.get('decodedInput');

    // Get the text content of the elements
    const txTime = document.getElementById('txTime').textContent;
    const fromAddress = document.getElementById('fromAddress').textContent;
    const transactionTags = document.getElementById('transactionTags').textContent;

    renderTransactionDetails(transaction, txTime, fromAddress, transactionTags, decodedInput);
});

// Function to render the transaction details
function renderTransactionDetails(transaction, txTime, fromAddress, transactionTags, decodedInput) {
    try {
        // Render transaction details HTML with the decoded transaction
        let html = `<div class="transaction-details">`;

        // Add transaction header
        html += `<p>Published on ${txTime} by ${fromAddress}${transactionTags ? ' - ' + transactionTags : ''}</p>`;

        // Add transaction body
        html += `<p>${transaction}</p>`;

        // Add decoded input if available
        if (decodedInput) {
            html += `<p>Decoded Input: ${decodedInput}</p>`;
        }

        html += `</div>`;

        // Append transaction HTML to transaction window
        const transactionDetailsContainer = document.getElementById('transactionContent');
        transactionDetailsContainer.innerHTML = html;
    } catch (error) {
        console.error('Error rendering transaction details:', error);
    }
}
