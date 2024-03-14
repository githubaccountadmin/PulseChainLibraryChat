function renderTransactionDetails(transaction) {
    try {
        if (!transaction) {
            console.error('Transaction data not found.');
            return;
        }
        
        const decodedTransaction = decodeURIComponent(transaction);
        console.log('Decoded transaction:', decodedTransaction); // Debugging: Log decoded transaction
        
        const transactionDetailsContainer = document.getElementById('transactionContent');
        console.log('Transaction details container:', transactionDetailsContainer);

        if (!transactionDetailsContainer) {
            console.error('Transaction details container not found.');
            return;
        }
        
        // Render transaction details HTML with header and body
        let html = `<div class="transaction-details">${decodedTransaction}</div>`;
        
        transactionDetailsContainer.innerHTML = html;
    } catch (error) {
        console.error('Error rendering transaction details:', error);
    }
}
