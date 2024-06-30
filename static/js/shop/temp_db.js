let orderBy = "name";
let searchValue = null;
let filterByProducer = [];
let filterByType = [];

let typingTimer;
let nextUrl = null;
const doneTypingInterval = 500;
let opacityButton = 0.9;
let isFirstItemAdded = true;

function addToCart(variantId) {
    // Define the URL of the API endpoint
    const addToCartUrl = '/api/add_to_cart/';
  
    // Create the request body
    const requestBody = {
      variant_id: variantId
    };
  
    // Define Fetch options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    };
  
    // Perform the Fetch request
    fetch(addToCartUrl, requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add item to cart');
        }
        return response.json();
      })
      .then(data => {
        // Handle successful response
        console.log(data.message);
  
        // Check if the cart was empty before adding this item
        const cartItemsAmount1 = document.getElementById('cartItemsAmount1');
        const currentItemCount = parseInt(cartItemsAmount1.textContent, 10);
        
        // Update the cart items
        cartGoodsUpdate();
  
        // If the cart was empty before, open the cart
        if (currentItemCount === 0) {
          openCartDropdown();
        }
      })
      .catch(error => {
        // Handle errors
        console.error('Error adding item to cart:', error);
      });
  }
  
  function openCartDropdown() {
    const cartButton = document.getElementById('page-header-cart-dropdown');
    cartButton.classList.add('show');
    const cartDropdown = document.querySelector('.dropdown-menu-cart');
    cartDropdown.classList.add('show');
    cartDropdown.style.position = 'absolute';
    cartDropdown.style.inset = '0px auto auto 0px';
    cartDropdown.style.margin = '0px';
    cartDropdown.style.transform = 'translate(0px, 58px)';
    cartDropdown.setAttribute('data-popper-placement', 'bottom-start');
    cartButton.setAttribute('aria-expanded', 'true');
  }
  
  function closeCartDropdown() {
    const cartButton = document.getElementById('page-header-cart-dropdown');
    cartButton.classList.remove('show');
    const cartDropdown = document.querySelector('.dropdown-menu-cart');
    cartDropdown.classList.remove('show');
    cartButton.setAttribute('aria-expanded', 'false');
  }

  function setColumnLayout() {
    let goodCardsListContainer;
    try {
      goodCardsListContainer = document.getElementById("goodCardsListContainer");
    } finally {
      goodCardsListContainer = document.getElementById("TopGoodCardsListContainer");
    }
    
    const totalGoods = goodCardsListContainer.children.length;
    const screenWidth = window.innerWidth;
  
    let numCols;
    if (screenWidth < 576) {
      numCols = 1;
    } else {
      numCols = Math.min(6, totalGoods);
    }
  
    goodCardsListContainer.className = `row row-cols-1 row-cols-md-${numCols} m-0`;
  }