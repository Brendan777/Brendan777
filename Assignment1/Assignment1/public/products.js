// Fetch product data from the "products.json" file
fetch('products.json')
  .then(response => response.json())
  .then(products => {
    const productGridElement = document.querySelector('.product-grid');

    // Function to create and append product cards to the product grid
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" class="product-img">
        <h5>${product.name}</h5>
        <p>${product.description}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
        <p>Qty Available: ${product.qty_available}</p>
        <div class="quantity-form">
          <button type="button" class="btn quantity-decrease">-</button>
          <input type="text" class="quantity-input" value="" placeholder="Qty">
          <button type="button" class="btn quantity-increase">+</button>
        </div>
      `;

      productGridElement.appendChild(productCard);

      // Decrease button event
      productCard.querySelector('.quantity-decrease').addEventListener('click', () => {
        const quantityInput = productCard.querySelector('.quantity-input');
        quantityInput.value = Math.max(0, (parseInt(quantityInput.value) || 0) - 1);
      });

      // Increase button event
      productCard.querySelector('.quantity-increase').addEventListener('click', () => {
        const quantityInput = productCard.querySelector('.quantity-input');
        quantityInput.value = Math.min(product.qty_available, (parseInt(quantityInput.value) || 0) + 1);
      });
    });

    // Purchase button event
    document.getElementById('purchase').addEventListener('click', () => {
      // Gather selected product data into an array
      const selectedProducts = Array.from(document.querySelectorAll('.quantity-input'))
        .map(input => {
          const productCard = input.closest('.product-card');
          const productName = productCard.querySelector('h5').textContent;
          const price = parseFloat(productCard.querySelector('p:nth-of-type(2)').textContent.replace(/Price: \$?/, ''));
          const quantity = parseInt(input.value) || 0;
          return { productName, quantity, price, subtotal: quantity * price };
        })
        .filter(product => product.quantity > 0);

      // Check if any product has been selected
      if (selectedProducts.length === 0) {
        alert('Please select at least one product to purchase.');
        return;
      }

      // Store the selected products in local storage
      localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));

      // Redirect to the invoice page
      window.location.href = 'invoice.html';
    });
  })
  .catch(error => {
    console.error('Error fetching product data:', error);
  });
