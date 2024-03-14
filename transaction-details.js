document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');
    const txTime = urlParams.get('txTime');
    const fromAddress = urlParams.get('fromAddress');
    const transactionTags = urlParams.get('transactionTags');
    const decodedInput = urlParams.get('decodedInput');

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
