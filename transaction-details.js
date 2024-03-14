document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction, txTime, fromAddress, transactionTags) {
        try {
            // Render transaction details HTML with the decoded transaction
            let html = `<div class="transaction-details">`;
    
            // Add transaction header
            html += `<p>Published on ${txTime} by ${fromAddress}${transactionTags && transactionTags.length > 0 ? ' - ' + transactionTags.join(', ') : ''}</p>`;
    
            // Add transaction body
            html += `<p>${transaction}</p>`;
    
            html += `</div>`;
    
            // Append transaction HTML to transaction window
            const transactionDetailsContainer = document.getElementById('transactionContent');
            transactionDetailsContainer.innerHTML = html;
        } catch (error) {
            console.error('Error rendering transaction details:', error);
        }
    }

    // Call function to render transaction details
    renderTransactionDetails(transaction);
});
