document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction) {
        try {
            if (!transaction) {
                console.error('Transaction data not found.');
                return;
            }
            
            const decodedTransaction = decodeURIComponent(transaction);
            console.log('Decoded transaction:', decodedTransaction); // Debugging: Log decoded transaction
            console.log('Decoded transaction length:', decodedTransaction.length); // Debugging: Log length of decoded transaction
            const transactionDetailsContainer = document.getElementById('transactionContent');
            console.log('Transaction details container:', transactionDetailsContainer);
    
            if (!transactionDetailsContainer) {
                console.error('Transaction details container not found.');
                return;
            }
            
            // Render transaction details HTML with the decoded transaction
            let html = `<div class="transaction-details">
                            <p>${decodedTransaction}</p>
                        </div>`;
            
            transactionDetailsContainer.innerHTML = html;
        } catch (error) {
            console.error('Error rendering transaction details:', error);
        }
    }

    // Call function to render transaction details
    renderTransactionDetails(transaction);
});
