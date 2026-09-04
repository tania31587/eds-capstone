function createCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  card.innerHTML = `
    <div class="product-card-content">
      <h3>${product.name}</h3>
      <p class="product-card-sku">${product.sku}</p>
      <p class="product-card-price">${product.price}</p>
      <p>${product.description}</p>
      ${product.link}View Product</a>
    </div>
  `;

  return card;
}
