let orderBy = "name";
let filterBy = null;
let typingTimer;
let nextUrl = null;
const doneTypingInterval = 500;


function goodCardsListUrl(order_by, searchValue, goodType, filterBy) {
  let url
  if (filterBy === undefined || filterBy === null) {
    url = `/api/goods/?ordering=${order_by}${searchValue ? '&search=' + encodeURIComponent(searchValue) : ''}`;
  } else {
    url = `/api/goods/?ordering=${order_by}&good_type_name=${filterBy}${searchValue ? '&search=' + encodeURIComponent(searchValue) : ''}`;
  }
  
  if (goodType) {
    url += `&good_type_name=${goodType}`;
  }
  return url;
}


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchGood").addEventListener("input", function () {
    clearTimeout(typingTimer);

    const searchValue = this.value.trim();

    typingTimer = setTimeout(function () {
      currentPage = 1;
      const url = goodCardsListUrl(orderBy, searchValue);
      goodCardsList(url, true);
    }, doneTypingInterval);
  });

  goodCardsList(goodCardsListUrl());
});


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("four-filter").addEventListener("change", function () {
    orderBy = this.value;
    const url = goodCardsListUrl(orderBy, document.getElementById("searchGood").value.trim(), filterBy);
    goodCardsList(url, true);
  });
  goodCardsList(goodCardsListUrl());
});


function setColumnLayout() {
  const goodCardsListContainer = document.getElementById("goodCardsListContainer");
  const totalGoods = goodCardsListContainer.children.length;
  const screenWidth = window.innerWidth;

  let numCols;
  if (screenWidth < 576) {
    numCols = 1;
  } else {
    numCols = Math.min(4, totalGoods);
  }

  goodCardsListContainer.className = `row row-cols-1 row-cols-xxl-${numCols} g-4`;
}


function goodCardsList(url, isSearch = false) {
  const goodCardsListContainer = document.getElementById("goodCardsListContainer");
  if (isSearch === true) {
    goodCardsListContainer.innerHTML = '';
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.results.length === 0) {
        goodCardsListContainer.innerHTML = `
        <div class="noresult" style="display: block;">
          <div class="text-center">
            <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#121331,secondary:#08a88a" style="width:75px;height:75px"></lord-icon>
            <h5 class="mt-2">Вибачте! Пошук на дав результатів</h5>
            <p class="text-muted mb-0">Здається товару за результатаму вашого пошуку не існує в системі.
            </p>
          </div>
        </div>
        `;
        return;
      }
      data.results.forEach(good => {

        const sortedSizes = good.sizes.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 4);
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("col");

        const cardInnerHtml = `
          <div class="card card-animate m-1 ribbon-box border border-info border-2 rounded-4 card-height-100">
            <a href="/${good.id}/">
              <img class="card-img-top img-fluid rounded-4" 
                style="max-height: 400px; min-height: 400px; object-fit: contain;" 
                src="${good.photos.length > 0 ? good.photos[0] : '/static/images/default-good.png'}" 
                alt="Card image cap">
            </a>
            ${good.on_discount ? `<div class="ribbon-two ribbon-two-danger"><span class="fs-18">-${good.discount_percentage}%</span></div>` : ''}
            <div class="card-body mt-3 border-top rounded-4-top rounded-4  border-2 justify-content-end custom-card-body">
              <h4 class="card-title mb-2">${good.name}</h4>
              <div class="row mt-3 mb-3">
                <div class="col-12">
                ${sortedSizes.map((size, index) => `
                <a type="button" href="/${size.variant_id}/" class="btn ${getButtonColor(index)} waves-effect waves-light rounded-4"
                ${size.amount === 0 ? 'disabled' : ''}
                >${size.name}</a>
              `).join('')}
                </div>
              </div>
              <p class="card-text">${good.description}</p>
              <div class="row align-items-center justify-content-center mb-3">
                <div class="col-7 text-start align-self-center pt-2">
                  ${good.on_discount ?
            `<p class="text-danger m-3 mb-0"><del>${good.sell_price} грн.</del></p> <h2 class="text-success m-3 mt-0">${good.discount_price} грн.</h2>` :
            `<h2 class="text-primary m-3 mt-0">${good.sell_price} грн.</h2>`
          }
                </div>
                <div class="col-5 text-end pr-3">
                <button class="btn btn-soft-success waves-effect waves-light m-1" onclick=addToCart(${good.id})>
                  <i class="ri-shopping-cart-2-line fs-19"></i>
                </button>
                  
                </div>
              </div>
            </div>
          </div>
        `;
        // Кнопка купити відразу (ірмлементувати пізніше)

        // <a class="btn btn-soft-success waves-effect waves-light m-1" href="#">
        //   <i class="ri-shopping-cart-2-line fs-19"></i>
        // </a>
        // <i class="ri-shopping-basket-fill fs-19"></i>

        cardDiv.innerHTML = cardInnerHtml;
        goodCardsListContainer.appendChild(cardDiv);

      })

      nextUrl = data.next;
      if (nextUrl) {
        document.getElementById('next_button').classList.remove('disabled');
        document.getElementById('next_button').innerHTML = 'Next';
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    }).finally(function () {
      updatePaginationButtons();
      setColumnLayout();
    })
};

function updatePaginationButtons() {
  var nextButton = document.getElementById('next_button');
  document.getElementById('next_button').innerHTML = '<i class="ri-refresh-line fs-20"></i>&nbsp; &nbsp; Показати ще';
  nextButton.classList.remove('disabled');
  if (!nextUrl) {
    nextButton.classList.add('disabled');
  }
}

document.getElementById('next_button').addEventListener('click', function () {
  var nextButton = document.getElementById('next_button');
  nextButton.classList.add('disabled');
  this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  goodCardsList(nextUrl);
});

function getButtonColor(index) {
  const colors = ['success', 'info', 'secondary', 'primary'];
  return `btn-outline-${colors[index]}`;
}

function notify(message, type){
  let msg_color;
  if (type == 'alert-danger'){
      msg_color = '#F06548';
  } else if (type == 'alert-warning'){
      msg_color = '#e89d10';
  }
  else{
      msg_color = '#0AB39C';
  }
  Toastify({
      text: message,
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: msg_color,
      stopOnFocus: true,
  }).showToast();
}

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
    })
    .catch(error => {
      // Handle errors
      console.error('Error adding item to cart:', error);
    })
    .finally(() => {
      notify("Додано в корзину.", 'alert-success');
      cartGoodsUpdate();
    })
}

function notify(message, type){
  let msg_color;
  if (type == 'alert-danger'){
      msg_color = '#F06548';
  } else if (type == 'alert-warning'){
      msg_color = '#e89d10';
  }
  else{
      msg_color = '#0AB39C';
  }
  Toastify({
      text: message,
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: msg_color,
      stopOnFocus: true,
  }).showToast();
}