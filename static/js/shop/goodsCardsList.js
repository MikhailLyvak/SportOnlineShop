function goodCardsListUrl(order_by, searchValue, filterByProducer, filterByType, aim = null) {
  let url
  url = `/api/goods/?ordering=${order_by}${searchValue ? '&search=' + encodeURIComponent(searchValue) : ''}`;

  if (filterByProducer.length > 0) {
    url += `&good__producer__name=${encodeURIComponent(filterByProducer.join(','))}`;
  }

  if ((filterByType || []).length > 0) {
    url += `&good__good_type__name=${encodeURIComponent(filterByType.join(','))}`;
  }

  if (aim) {
    url += `&aim_filter=${encodeURIComponent(aim)}`;
  }
  return url;
}

function toggleProducerFilter(producerName, checkbox) {
  if (checkbox.checked) {
    filterByProducer.push(producerName);
  } else {
    filterByProducer = filterByProducer.filter(producer => producer !== producerName);
  }
  goodCardsList(goodCardsListUrl(orderBy, searchValue, filterByProducer, filterByType), true);
}

function toggleTypeFilter(typeName, checkbox) {
  if (checkbox.checked) {
    filterByType.push(typeName);
  } else {
    filterByType = filterByType.filter(typeMl => typeMl !== typeName);
  }
  goodCardsList(goodCardsListUrl(orderBy, searchValue, filterByProducer, filterByType), true);
}

function caruselLoader() {
  const caruselDiv = document.getElementById("caruselDiv");

  // Fetch data from API
  fetch('/api/sliders/')
    .then(response => response.json())
    .then(data => {
      // Create carousel items for both PC and mobile versions
      const pcCarusel = `
        <div class="card p-2 border rounded-4 border-2 m-0">
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-indicators">
                  ${data.map((_, index) => `
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}"
                        class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>
                  `).join('')}
              </div>
              <div class="carousel-inner" role="listbox">
                  ${data.map((item, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}">
                      <img class="d-block img-fluid mx-auto" src="${item.image}" alt="Slide ${index + 1}">
                    </div>
                  `).join('')}
              </div>
              <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button"
                  data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleIndicators" role="button"
                  data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
              </a>
          </div>
        </div>
      `;

      const mobileCarusel = `
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
              ${data.map((_, index) => `
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${index}"
                    class="${index === 0 ? 'active' : ''}" aria-label="Slide ${index + 1}"></button>
              `).join('')}
          </div>
          <div class="carousel-inner" role="listbox">
              ${data.map((item, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                  <img class="d-block img-fluid mx-auto" src="${item.image}" alt="Slide ${index + 1}">
                </div>
              `).join('')}
          </div>
          <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
          </a>
          <a class="carousel-control-next" href="#carouselExampleIndicators" role="button"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
          </a>
        </div>
      `;

      // Determine which version to show based on screen width
      const isMobile = window.innerWidth <= 950;
      caruselDiv.innerHTML = isMobile ? mobileCarusel : pcCarusel;
    })
    .catch(error => {
      console.error('Error fetching slider images:', error);
      // Handle error scenario
    });
};

function AdaptiveSettings() {
  if (window.innerWidth <= 1200) {
    const contFluid = document.getElementById("container-fluid-adaptive")
    contFluid.classList.add("mt-3")
  }
}


document.addEventListener("DOMContentLoaded", function () {
  const topGoods = document.getElementById("topGoods")
  if (window.innerWidth < 1440 && window.innerWidth >= 1140) {
    topGoods.style.cssText += 'margin-left: 90px; margin-right: 90px;';
  }
  const siteData = document.getElementById("siteData")
  if (window.innerWidth < 1440 && window.innerWidth >= 1140) {
    siteData.style.cssText += 'margin-left: 90px; margin-right: 90px;';
  }
  const simpleGoods = document.getElementById("simpleGoods")
  if (window.innerWidth < 1440 && window.innerWidth >= 1140) {
    simpleGoods.style.cssText += 'margin-left: 90px; margin-right: 90px;';
  }
  const aimButtons = document.getElementById("aimButtons")
  if (window.innerWidth < 1440 && window.innerWidth >= 1140) {
    aimButtons.style.cssText += 'margin-left: 90px !important; margin-right: 90px !important';
  }
  // Load goods only once on initial page load
  const url = goodCardsListUrl(orderBy, null, filterByProducer, filterByType);
  goodCardsList(url);
  TopGoodCardsList("/api/top-goods/");
  caruselLoader();
  createAimButtons();
  AdaptiveSettings();
});

const checkboxes = document.querySelectorAll('.form-check-input');

const initialValue = document.querySelector('.form-check-label').textContent.trim();


function adjustOffcanvasClass() {
  const offcanvasElement = document.getElementById('offcanvasBottom');
  const offcanvasElement2 = document.getElementById('offcanvasBottom2');
  if (window.innerWidth > 1200) {
    offcanvasElement.classList.remove('offcanvas-bottom');
    offcanvasElement.classList.add('offcanvas-end');
    offcanvasElement2.classList.remove('offcanvas-bottom');
    offcanvasElement2.classList.add('offcanvas-end');
  } else {
    offcanvasElement.classList.remove('offcanvas-end');
    offcanvasElement.classList.add('offcanvas-bottom');
    offcanvasElement2.classList.remove('offcanvas-end');
    offcanvasElement2.classList.add('offcanvas-bottom');
  }
}

// Adjust class on load
adjustOffcanvasClass();

// Adjust class on window resize
window.addEventListener('resize', adjustOffcanvasClass);

// Set the initial value to the h5 element
document.getElementById('offcanvasBottomLabel').textContent = `Товари посортовані "${initialValue}"`;

// Add event listener to each checkbox
checkboxes.forEach(function (checkbox) {
  checkbox.addEventListener('change', function () {
    // If this checkbox is checked
    if (this.checked) {
      // Uncheck all other checkboxes
      checkboxes.forEach(function (otherCheckbox) {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });

      // Get the value of the checked checkbox
      orderBy = checkbox.id;
      let url = ''
      if (document.getElementById('searchGood')) {
        url = goodCardsListUrl(orderBy, document.getElementById('searchGood').value.trim(), filterByProducer, filterByType);
      } else {
        url = goodCardsListUrl(orderBy, document.getElementById('searchGoodPhone').value.trim(), filterByProducer, filterByType);
      }

      goodCardsList(url, true);

      // Update the h5 element with the value from the label
      document.getElementById('offcanvasBottomLabel').textContent = `Товари посортовані "${checkbox.nextElementSibling.textContent.trim()}"`;
    }
  });
});

function goodCardsList(url, isSearch = false) {
  const goodCardsListContainer = document.getElementById("goodCardsListContainer");
  const caruselDiv = document.getElementById("caruselDiv")
  const aimButtons = document.getElementById("aimButtons")
  const topGoods = document.getElementById("topGoods")
  const siteData = document.getElementById("siteData")
  const searchDataTitle = document.getElementById("searchDataTitle")
  if (isSearch === true) {
    goodCardsListContainer.innerHTML = '';
    caruselDiv.innerHTML = '';
    aimButtons.innerHTML = '';
    topGoods.innerHTML = '';
    siteData.innerHTML = '';
    searchDataTitle.textContent = 'Товари за вашим пошуком';
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
        <div class="alert border-dashed alert-danger" role="alert">
        <div class="noresult"> <!-- or display: inline-flex; -->
        <div class="text-center">
          <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#121331,secondary:#08a88a" style="width:75px;height:75px"></lord-icon>
          <h5 class="mt-2">Вибачте! Пошук на дав результатів</h5>
          <p class="text-muted mb-0">Здається товару за результатаму вашого пошуку не існує в системі.</p>
        </div>
      </div>
            </div>

        `;
        return;
      }

      data.results.forEach(good => {

        const sortedSizes = good.sizes.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 4);
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("col-6", "m-0", "p-0");

        const maxRating = 5;
        const rating = good.stars_amount || 0; // Ensure rating is between 0 and 5
        const fullStars = Math.min(maxRating, Math.max(0, rating)); // Clamp rating between 0 and 5
        const emptyStars = maxRating - fullStars;

        const ratingHtml = `
          ${'<span class="fa fa-star checked"></span>'.repeat(fullStars)}
          ${'<span class="fa fa-star"></span>'.repeat(emptyStars)}
        `;

        const cardInnerHtml = `
          <div class="card card-animate m-2 mt-2 ribbon-box border border-info border-2 rounded-4 card-height-100" style="opacity: ${opacityButton};">
            <a href="/${good.id}/">
              <img class="card-img-top img-fluid rounded-4 responsive-img"  
                src="${good.photos.length > 0 ? good.photos[0] : '/static/images/default-good.png'}" 
                alt="Card image cap">
            </a>
            ${good.on_discount ? `<div class="ribbon-two ribbon-two-danger"><span class="fs-18">-${good.discount_percentage}%</span></div>` : ''}
            <div class="card-body border-top rounded-4-top rounded-4  border-2 justify-content-end custom-card-body p-2">
            <h4 placeholder="${good.name}" class="card-title mb-2 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-13' : 'fs-14')}">${good.name.length > 30 ? good.name.substring(0, 37) + '...' : good.name}</h4>
            <div class="row my-1">
               <div class="d-flex" id="ratingGood_${good.id}">
                ${ratingHtml}
              </div>
              </div>
              <div class="row my-1">
                <div class="col-12">
                ${sortedSizes.map((size, index) => `
                <a type="button" href="/${size.variant_id}/" class="btn ${getButtonColor(index, size.variant_id, good.id)} btn-sm waves-effect waves-light rounded-4 ${window.innerWidth < 420 ? 'fs-10' : ''}"
                ${size.amount === 0 ? 'disabled' : ''}
                style="margin-bottom:5px;"
                >${size.name}</a>
              `).join('')}
                </div>
              </div>
              

              <div class="d-flex" style="justify-content: space-between; align-items: center;">
                ${good.on_discount ?
                  `<div>
                  <p class="text-danger d-flex align-items-center m-0 ${window.innerWidth < 420 ? 'fs-10' : (window.innerWidth <= 1440 ? 'fs-10' : 'fs-12')}">
                    <del>${good.sell_price} грн.</del>
                  </p>
                  <h2 class="text-success m-0 mt-0 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-15' : 'fs-14')}">
                    ${good.discount_price} грн.
                  </h2>
                </div>` :
                `<div>
                  <p class="text-primary d-flex align-items-center m-0 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-15' : 'fs-14')}">
                    ${good.sell_price} грн.
                  </p>
                </div>`
                }
                <button class="btn btn-soft-success waves-effect waves-light ${window.innerWidth < 420 ? 'm-0' : 'm-1'}" onclick=addToCart(${good.id})>
                  <i class="ri-shopping-cart-2-line ${window.innerWidth < 420 ? 'f-14' : 'fs-14'}"></i>
                </button>
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

function TopGoodCardsList(url) {
  const goodCardsListContainer = document.getElementById("TopGoodCardsListContainer");

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      data.forEach(good => {

        const sortedSizes = good.sizes.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, 4);
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("col-6", "m-0", "p-0");

        const maxRating = 5;
        const rating = good.stars_amount || 0; // Ensure rating is between 0 and 5
        const fullStars = Math.min(maxRating, Math.max(0, rating)); // Clamp rating between 0 and 5
        const emptyStars = maxRating - fullStars;

        const ratingHtml = `
          ${'<span class="fa fa-star checked"></span>'.repeat(fullStars)}
          ${'<span class="fa fa-star"></span>'.repeat(emptyStars)}
        `;

        const cardInnerHtml = `
          <div class="card card-animate m-2 mt-2 ribbon-box border border-warning border-2 rounded-4 card-height-100" style="opacity: ${opacityButton};">
            <a href="/${good.id}/">
              <img class="card-img-top img-fluid rounded-4 responsive-img"  
                src="${good.photos.length > 0 ? good.photos[0] : '/static/images/default-good.png'}" 
                alt="Card image cap">
            </a>
            ${good.on_discount ? `<div class="ribbon-two ribbon-two-danger"><span class="fs-18">-${good.discount_percentage}%</span></div>` : ''}
            <div class="card-body border-top rounded-4-top rounded-4  border-2 justify-content-end custom-card-body p-2">
              <h4 placeholder="${good.name}" class="card-title mb-2 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-13' : 'fs-14')}">${good.name.length > 30 ? good.name.substring(0, 37) + '...' : good.name}</h4>
              <div class="row my-1">
               <div class="d-flex" id="ratingGood_${good.id}">
                ${ratingHtml}
              </div>
              </div>
              <div class="row my-1">
                <div class="col-12">
                ${sortedSizes.map((size, index) => `
                <a type="button" href="/${size.variant_id}/" class="btn ${getButtonColor(index, size.variant_id, good.id)} btn-sm waves-effect waves-light rounded-4 ${window.innerWidth < 420 ? 'fs-10' : ''}"
                ${size.amount === 0 ? 'disabled' : ''}
                style="margin-bottom:5px;"
                >${size.name}</a>
              `).join('')}
                </div>
              </div>
              
              <div class="d-flex" style="justify-content: space-between; align-items: center;">
                ${good.on_discount ?
                  `<div>
                  <p class="text-danger d-flex align-items-center m-0 ${window.innerWidth < 420 ? 'fs-10' : (window.innerWidth <= 1440 ? 'fs-13' : 'fs-12')}">
                    <del>${good.sell_price} грн.</del>
                  </p>
                  <h2 class="text-success m-0 mt-0 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-15' : 'fs-14')}">
                    ${good.discount_price} грн.
                  </h2>
                </div>` :
                `<div>
                  <p class="text-primary d-flex align-items-center m-0 ${window.innerWidth < 420 ? 'fs-12' : (window.innerWidth <= 1440 ? 'fs-15' : 'fs-14')}">
                    ${good.sell_price} грн.
                  </p>
                </div>`
                }
                <button class="btn btn-soft-success waves-effect waves-light ${window.innerWidth < 420 ? 'm-0' : 'm-1'}" onclick=addToCart(${good.id})>
                  <i class="ri-shopping-cart-2-line ${window.innerWidth < 420 ? 'f-14' : 'fs-14'}"></i>
                </button>
              </div>
            </div>
          </div>
        `;

        cardDiv.innerHTML = cardInnerHtml;
        goodCardsListContainer.appendChild(cardDiv);

      })
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    }).finally(function () {
      setColumnLayout();
    })
};

function updatePaginationButtons() {
  if (nextUrl) {
    var nextButton = document.getElementById('next_button');
    document.getElementById('next_button').innerHTML = '<i class="ri-refresh-line fs-20"></i>&nbsp; &nbsp; Показати ще';
    nextButton.classList.remove('disabled');
  } else {
    var nextButton = document.getElementById('next_button');
    if (nextButton) {
      nextButton.remove();
    }
  }
}

document.getElementById('next_button').addEventListener('click', function () {
  var nextButton = document.getElementById('next_button');
  nextButton.classList.add('disabled');
  this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  goodCardsList(nextUrl);
});

function getButtonColor(index, size_good_id, good_id) {
  const colors = ['success', 'info', 'secondary', 'primary'];
  if (size_good_id === good_id) {
    return `btn-soft-${colors[index]}`;
  } else {
    return `btn-outline-${colors[index]}`;
  }

}

function notify(message, type) {
  let msg_color;
  if (type == 'alert-danger') {
    msg_color = '#F06548';
  } else if (type == 'alert-warning') {
    msg_color = '#e89d10';
  }
  else {
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

function notify(message, type) {
  let msg_color;
  if (type == 'alert-danger') {
    msg_color = '#F06548';
  } else if (type == 'alert-warning') {
    msg_color = '#e89d10';
  }
  else {
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

// 1681 < міняти стиль карткам