const express = require('express');
const bodyParser = require('body-parser'); // To parse request body
const app = express();

// Load the product data from the "products.json" file
// Assuming products.json is in the same directory as server.js
let products = require('./products.json');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware for logging all requests regardless of their method and path
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// Serve static files from the "public" directory
app.use(express.static(__dirname + '/public'));

// Route to load product data as JavaScript code when a request is made for "products.js"
app.get('/products.js', (req, res) => {
    res.type('.js');
    const products_str = `let products = ${JSON.stringify(products)};`;
    res.send(products_str);
});

// Route to get the list of products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Route to validate purchase data and provide an invoice
app.post('/api/purchase', (req, res) => {
    const purchaseItems = req.body; // The body should be structured as an array of items
    let purchaseValid = true;
    let errorMessage = "";
    let totalAmount = 0;
    
    // Validate each item in the purchase
    for (let item of purchaseItems) {
        // Check if quantity is a non-negative integer
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
            purchaseValid = false;
            errorMessage = `Invalid quantity for ${item.productName}. Quantity must be a positive integer.`;
            break;
        }
        // Find the product in the products array
        const productIndex = products.findIndex(p => p.name === item.productName);
        if (productIndex !== -1) {
            const product = products[productIndex];
            // Check if enough quantity is available
            if (item.quantity <= product.qty_available) {
                // Update the quantity available
                products[productIndex].qty_available -= item.quantity;
                // Add the subtotal for this item to the total amount
                totalAmount += item.quantity * product.price;
            } else {
                purchaseValid = false;
                errorMessage = `Insufficient quantity for ${item.productName}.`;
                break;
            }
        } else {
            purchaseValid = false;
            errorMessage = `Product ${item.productName} not found.`;
            break;
        }
    }

    if (purchaseValid) {
        // Assuming a tax rate of 10%
        const taxRate = 0.10;
        const taxAmount = totalAmount * taxRate;
        // Assuming a flat shipping rate
        const shippingCost = 5.00;
        const finalAmount = totalAmount + taxAmount + shippingCost;

        // Create the invoice
        const invoice = {
            orderId: 'INV' + Date.now(), // Generate a unique order ID
            items: purchaseItems,
            subtotal: totalAmount,
            tax: taxAmount,
            shipping: shippingCost,
            total: finalAmount
        };

        // Send the invoice back in the response
        res.json(invoice);
    } else {
        // If the purchase is not valid, send an error response
        res.status(400).json({ error: errorMessage });
    }
});

// Start the server on the specified port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
