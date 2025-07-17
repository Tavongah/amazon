async function getProducts() {
    const container = document.getElementById('products-container');
    const itemCountElement = document.getElementById('item-count');

    if (container) {
        container.innerHTML = '<p>Loading products...</p>';
    }

    try {
        const response = await fetch('http://67.205.143.29:3000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();


        products.sort((a, b) => a.name.localeCompare(b.name));

        
        if (itemCountElement) {
            itemCountElement.textContent = `Number of items: ${products.length}`;
        }

        
        if (container) {
            container.innerHTML = '';
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';

                
                const hasDiscount = product.discount && product.discount > 0;
                const discountedPrice = hasDiscount
                    ? (product.price * (1 - product.discount / 100)).toFixed(2)
                    : product.price.toFixed(2);

                card.innerHTML = `
                    <img src="${product.images[0] || 'placeholder.jpg'}" alt="${product.name}">
                    <p class="prod-name">${product.name}</p>
                    <p class="stars">${getStars(product.ratingAverage)}</p>
                    <p class="product-prices">
                        ${hasDiscount
                            ? `<span class="original-price">$${product.price.toFixed(2)}</span> 
                               <span class="discounted-price">$${discountedPrice}</span>`
                            : `$${product.price.toFixed(2)}`
                        }
                    </p>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `product.html?id=${product.id}`;
                });
                container.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        if (container) {
            container.innerHTML = '<p>Failed to load products. Please try again later.</p>';
        }
    }
}

function getStars(rating) {
    const fullStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star">
                     <path fill="rgb(222, 121, 38)" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;
    const halfStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star">
                        <defs>
                           <linearGradient id="half-gradient"><stop offset="50%" stop-color="rgb(222, 121, 38)"/>
                           <stop offset="50%" stop-color="grey"/>
                           </linearGradient>
                        </defs>
                           <path fill="url(#half-gradient)" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;
    const emptyStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star"><path fill="grey" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - hasHalfStar;

    return fullStar.repeat(fullStars) + (hasHalfStar ? halfStar : '') + emptyStar.repeat(emptyStars);
}

getProducts();
