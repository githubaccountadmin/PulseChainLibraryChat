document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction) {
        try {
            console.log('Transaction:', transaction); // Log the transaction data
            if (!transaction) {
                console.error('Transaction data not found.');
                return;
            }
            
            const decodedTransaction = decodeURIComponent(transaction);
            console.log('Decoded transaction:', decodedTransaction); // Log the decoded transaction
            
            const transactionDetailsContainer = document.getElementById('transactionContent');
            console.log('Transaction details container:', transactionDetailsContainer); // Log the transaction details container

            if (!transactionDetailsContainer) {
                console.error('Transaction details container not found.');
                return;
            }
            
            // Separate the header and body of the message
            const headerEndIndex = decodedTransaction.indexOf('\n'); // Find the end of the header
            
            if (headerEndIndex === -1) {
                console.error('Header end index not found.');
                return;
            }

            const header = decodedTransaction.slice(0, headerEndIndex).trim(); // Extract the header
            const body = decodedTransaction.slice(headerEndIndex + 1).trim(); // Extract the body
            
            // Render transaction details HTML with header and body
            let html = `<div class="transaction-details">
                            <p>${header}</p>
                            <p>${body}</p>
                        </div>`;
            
            console.log('Generated HTML:', html); // Log the generated HTML
            
            transactionDetailsContainer.innerHTML = html;
            console.log('Transaction details rendered successfully.'); // Log successful rendering
        } catch (error) {
            console.error('Error rendering transaction details:', error);
        }
    }

    // Call function to render transaction details
    renderTransactionDetails(transaction);
});
