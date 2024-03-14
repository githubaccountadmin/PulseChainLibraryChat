document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction) {
        try {
            const decodedTransaction = decodeURIComponent(transaction);
            const transactionDetailsContainer = document.getElementById('transactionContent');
            console.log('Transaction details container:', transactionDetailsContainer);
            
            // Separate the header and body of the message
            const headerEndIndex = decodedTransaction.indexOf('\n'); // Find the end of the header
            const header = decodedTransaction.slice(0, headerEndIndex).trim(); // Extract the header
            const body = decodedTransaction.slice(headerEndIndex + 1).trim(); // Extract the body
            
            // Render transaction details HTML with header and body
            let html = `<div class="transaction-details">
                            <p>${header}</p>
                            <p>${body}</p>
                        </div>`;
            
            transactionDetailsContainer.innerHTML = html;
        } catch (error) {
            console.error('Error rendering transaction details:', error);
        }
    }

    // Call function to render transaction details
    renderTransactionDetails(transaction);
});
