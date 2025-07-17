async function getProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;

    const container = document.getElementById('product-details');
    if (container) {
        container.innerHTML = '<p>Loading product details...</p>';
    }

    try {
       
        const response = await fetch(`http://67.205.143.29:3000/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const product = await response.json();

        console.log('Product data:', product);


        const hasDiscount = product.discount && product.discount > 0;
        const discountedPrice = hasDiscount
            ? (product.price * (1 - product.discount / 100)).toFixed(2)
            : product.price.toFixed(2);

        
        if (container) {
            container.innerHTML = `
                <div class="image-gallery">
                    ${product.images.map((img, index) => `
                        <img src="${img}" class="${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)" alt="${product.name}">
                    `).join('')}
                </div>
                <div class="main-image-container">
                    <img id="mainImage" src="${product.images[0]}" class="main-image" alt="${product.name}">
                </div>
                <div class="details">
                    <h1>${product.name}</h1>
                    <i>${product.sellerName}</i>
                    <p class="stars">${product.ratingAverage} ${getStars(product.ratingAverage)} (${product.numberOfRatings} Ratings)</p>
                    <p class="description">${product.description}</p>
                    <p class="product-prices">
                        ${hasDiscount
                            ? `<span class="original-price">$${product.price.toFixed(2)}</span> 
                               <span class="discounted-price">$${discountedPrice}</span>`
                            : `$${product.price.toFixed(2)}`
                        }
                    </p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        if (container) {
            container.innerHTML = '<p>Failed to load product details. Please try again later.</p>';
        }
    }
}

function getStars(rating) {
    const fullStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star">
                     <path fill="rgb(222, 121, 38)" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;
    const halfStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star">
                      <defs>
                        <linearGradient id="half-gradient">
                        <stop offset="50%" stop-color="rgb(222, 121, 38)"/><stop offset="50%" stop-color="grey"/>
                        </linearGradient>
                      </defs>
                        <path fill="url(#half-gradient)" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;
    const emptyStar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="star"><path fill="grey" d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118l11.547-1.2L16.026,0.6L20.388,10.918z"/></svg>`;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - hasHalfStar;

    return fullStar.repeat(fullStars) + (hasHalfStar ? halfStar : '') + emptyStar.repeat(emptyStars);
}

function changeImage(imageSrc, element) {
    console.log('Image clicked:', imageSrc);
    document.getElementById('mainImage').src = imageSrc;
    const thumbnails = document.querySelectorAll('.image-gallery img');
    thumbnails.forEach(img => img.classList.remove('active'));
    element.classList.add('active');
}


window.onload = getProductDetails;