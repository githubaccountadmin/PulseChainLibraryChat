document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction) {
        try {
            const decodedTransaction = decodeURIComponent(transaction);
            const transactionDetailsContainer = document.getElementById('transactionDetails');
            
            // Render transaction details HTML
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
