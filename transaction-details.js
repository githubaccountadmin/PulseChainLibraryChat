document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM content loaded');
    const urlParams = new URLSearchParams(window.location.search);
    const transaction = urlParams.get('transaction');

    // Function to render the transaction details
    function renderTransactionDetails(transaction) {
        try {
            const decodedTransaction = decodeURIComponent(transaction);
            const transactionDetailsContainer = document.getElementById('transactionDetails');
            console.log('Transaction details container:', transactionDetailsContainer);
            
            // Separate the header and body of the message
            const headerMatch = decodedTransaction.match(/^.*?(\n|$)/); // Match everything before the first newline or end of string
            const header = headerMatch ? headerMatch[0].trim() : ''; // Extract and trim the header
            const body = decodedTransaction.replace(header, ''); // Remove the header from the content
            
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
