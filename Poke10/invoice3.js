// invoice3.js
import { items } from './products_data.js';

document.addEventListener("DOMContentLoaded", function() {
    // Initialize the subtotal to 0
    let subtotal = 0;

    // Get the table by its ID
    let table = document.getElementById('invoiceTable');

    // Function to validate quantity and return specific error messages
    function validateQuantity(quantity) {
        let errors = [];

        if (isNaN(quantity)) {
            errors.push("Not a number");
        } else {
            if (!Number.isInteger(quantity)) {
                errors.push("Not an integer");
            }
            if (quantity < 0) {
                errors.push("Negative inventory");
            }
        }

        // Join multiple error messages, or return null if there are no errors
        return errors.length ? errors.join(", ") : null;
    }

    // Function to generate item rows with validation on quantity
    function generate_item_rows(items) {
        items.forEach(item => {
            // Skip items that are not for sale (quantity = 0)
            if (item.quantity === 0) return;

            // Validate the item quantity
            let errorMessage = validateQuantity(item.quantity);

            // Insert a new row in the table for the current item
            let row = table.insertRow();

            // If there's an error, display the item with the error message
            if (errorMessage) {
                row.insertCell(0).innerHTML = item.name;
                let errorCell = row.insertCell(1);
                errorCell.innerHTML = errorMessage;
                errorCell.colSpan = 3; // Error message takes the remaining space
                errorCell.style.color = 'red'; // Styling for error message
            } else {
                // If the quantity is valid, calculate the extended price, display the item, and update the subtotal
                let extended_price = item.quantity * item.price;
                subtotal += extended_price;

                row.insertCell(0).innerHTML = item.name;
                row.insertCell(1).innerHTML = item.quantity;
                row.insertCell(2).innerHTML = '$' + item.price.toFixed(2);
                row.insertCell(3).innerHTML = '$' + extended_price.toFixed(2);
            }
        });
    }

    // Call the function to generate item rows
    generate_item_rows(items);

    // Define the tax rate
    let taxRate = 0.0575;

    // Calculate the tax based on the subtotal and tax rate
    let tax = subtotal * taxRate;

    // Initialize shipping to 0
    let shipping = 0;

    // Determine the shipping cost based on the subtotal
    if (subtotal <= 49.99) {
        shipping = 2;
    } else if (subtotal <= 99.99) {
        shipping = 5;
    } else {
        shipping = 0.05 * subtotal;  // 5% of subtotal for orders above $100
    }

    // Calculate the total cost including subtotal, tax, and shipping
    let total = subtotal + tax + shipping;

    // Update the DOM to display the calculated values
    document.getElementById('subtotal_cell').innerHTML = '$' + subtotal.toFixed(2);
    document.getElementById('tax_cell').innerHTML = '$' + tax.toFixed(2);
    document.getElementById('shipping_cell').innerHTML = '$' + shipping.toFixed(2);
    document.getElementById('total_cell').innerHTML = '$' + total.toFixed(2);
});
