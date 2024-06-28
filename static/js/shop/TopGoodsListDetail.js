function getButtonColor(index, size_good_id, good_id) {
  const colors = ['success', 'info', 'secondary', 'primary'];
  if (size_good_id === good_id) {
    return `btn-soft-${colors[index]}`;
  } else {
    return `btn-outline-${colors[index]}`;
  }

}

function TopGoodCardsList(url) {
  console.log("TopGoodCardsList loaded");
  const goodCardsListContainer = document.getElementById("TopGoodCardsListContainer");
  let numberOfGoods = 6;
  let containerClass = "row row-cols-1 row-cols-md-6 m-0";

  if (window.innerWidth < 1440) {
    numberOfGoods = 4;
    containerClass = "row row-cols-1 row-cols-md-4 m-0";
  }

  goodCardsListContainer.className = containerClass;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const limitedData = data.slice(0, numberOfGoods);
      limitedData.forEach(good => {

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
          <div class="card card-animate m-2 mt-2 ribbon-box border border-warning border-2 rounded-4 card-height-100" style="opacity: 0.9;">
            <a href="/${good.id}/">
              <img class="card-img-top img-fluid rounded-4 responsive-img"  
                src="${good.photos.length > 0 ? good.photos[0] : '/static/images/default-good.png'}" 
                alt="Card image cap">
            </a>
            ${good.on_discount ? `<div class="ribbon-two ribbon-two-danger"><span class="fs-18">-${good.discount_percentage}%</span></div>` : ''}
            <div class="card-body border-top rounded-4-top rounded-4  border-2 justify-content-end custom-card-body p-2">
              <h4 placeholder="${good.name}" class="card-title mb-2 fs-12">${good.name.length > 30 ? good.name.substring(0, 37) + '...' : good.name}</h4>
              <div class="row my-1">
               <div class="d-flex" id="ratingGood_${good.id}">
                ${ratingHtml}
              </div>
              </div>
              <div class="row my-1">
                <div class="col-12">
                ${sortedSizes.map((size, index) => `
                <a type="button" href="/${size.variant_id}/" class="btn ${getButtonColor(index, size.variant_id, good.id)} btn-sm waves-effect waves-light rounded-4 fs-10"
                ${size.amount === 0 ? 'disabled' : ''}
                style="margin-bottom:5px;"
                >${size.name}</a>
              `).join('')}
                </div>
              </div>
              
              <div class="d-flex" style="justify-content: space-between; align-items: center; margin-top: auto !important;">
                ${good.on_discount ?
                  `<div>
                  <p class="text-danger d-flex align-items-center m-0 fs-10">
                    <del>${good.sell_price} грн.</del>
                  </p>
                  <h2 class="text-success m-0 mt-0 fs-12">
                    ${good.discount_price} грн.
                  </h2>
                </div>` :
                `<div>
                  <p class="text-primary d-flex align-items-center m-0 fs-12">
                    ${good.sell_price} грн.
                  </p>
                </div>`
                }
                <button class="btn btn-soft-success waves-effect waves-light m-0 mb-1" onclick=addToCart(${good.id})>
                  <i class="ri-shopping-cart-2-line fs-10"></i>
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
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    }).finally(function () {
      setColumnLayout();
    })
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded");
  TopGoodCardsList("/api/top-goods/");
});
