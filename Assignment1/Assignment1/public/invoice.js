// Function to calculate and render the invoice on the invoice page
function renderInvoice() {
  // Retrieve the selected products from local storage
  const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts'));

  // Reference to DOM elements where invoice details will be displayed
  const invoiceItemsElement = document.getElementById('invoice-items');
  const subtotalElement = document.getElementById('subtotal');
  const taxElement = document.getElementById('tax');
  const shippingElement = document.getElementById('shipping');
  const totalElement = document.getElementById('total');

  // Initialize subtotal
  let subtotal = 0;

  // Iterate over each selected product to create table rows for the invoice
  selectedProducts.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.productName}</td>
      <td>${product.quantity}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>$${product.subtotal.toFixed(2)}</td>
    `;
    invoiceItemsElement.appendChild(row);
    subtotal += product.subtotal;
  });

  // Calculate tax, shipping, and total
  const taxRate = 0.1; // Example tax rate of 10%
  const tax = subtotal * taxRate;
  const shippingCost = 10; // Example flat shipping cost
  const total = subtotal + tax + shippingCost;

  // Display calculated costs
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  shippingElement.textContent = `$${shippingCost.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;

  // Clear the selected products from local storage
  localStorage.removeItem('selectedProducts');
}

// Ensure the DOM is fully loaded before rendering the invoice
document.addEventListener('DOMContentLoaded', renderInvoice);
