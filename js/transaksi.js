document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-edit-status');
    const closeButton = modal.querySelector('.close');
    const form = document.getElementById('edit-status-form');
    const transactionIdField = document.getElementById('transaction-id');
    const statusField = document.getElementById('status');
    const ticketNoField = document.getElementById('ticket-no');
    const transactionDateField = document.getElementById('transaction-date');
    const concertNameField = document.getElementById('concert-name');
    const customerNameField = document.getElementById('customer-name');
    const ticketQuantityField = document.getElementById('ticket-quantity');
    const totalAmountField = document.getElementById('total-amount');
    const paymentProofImage = document.getElementById('payment-proof');

    // Open Modal on Button Click
    document.querySelectorAll('.btn.detail').forEach(button => {
        button.addEventListener('click', () => {
            const row = button.closest('tr');
            const id = button.getAttribute('data-id');
            const ticketNo = row.cells[1].textContent;
            const transactionDate = row.cells[2].textContent;
            const concertName = row.cells[3].textContent;
            const customerName = row.cells[4].textContent;
            const ticketQuantity = row.cells[5].textContent;
            const totalAmount = row.cells[6].textContent;
            const currentStatus = row.cells[8].textContent;
            const qrCodeSrc = row.querySelector('img').src;

            // Populate modal fields
            transactionIdField.value = id;
            ticketNoField.textContent = ticketNo;
            transactionDateField.textContent = transactionDate;
            concertNameField.textContent = concertName;
            customerNameField.textContent = customerName;
            ticketQuantityField.textContent = ticketQuantity;
            totalAmountField.textContent = totalAmount;
            paymentProofImage.src = qrCodeSrc;
            statusField.value = currentStatus;

            modal.style.display = 'block';
        });
    });

    // Close Modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = transactionIdField.value;
        const newStatus = statusField.value;

        // Update the table
        const row = document.querySelector(`.btn.detail[data-id="${id}"]`).closest('tr');
        row.cells[8].textContent = newStatus;

        // Close Modal
        modal.style.display = 'none';
    });
});
