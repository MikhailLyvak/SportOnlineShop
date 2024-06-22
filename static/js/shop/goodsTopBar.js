const pcHtml = `
<div class="d-flex">
  <button class="btn btn-ghost" style="margin-right: 15px;" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
    <i class="ri-align-left text-muted fs-24"></i>
  </button>
  <form class="app-search">
    <div class="position-relative" id="pc-search">
      <input type="text" id="searchGood" class="form-control border border-2" placeholder="Search..." autocomplete="off"
        id="search-options" value="">
      <span class="mdi mdi-magnify search-widget-icon"></span>
      <span class="mdi mdi-close-circle search-widget-icon search-widget-icon-close d-none"
        id="search-close-options"></span>
    </div>
  </form>
  <div class="dropdown topbar-head-dropdown ms-1 header-item">  <!-- Корзина -->
    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      id="page-header-cart-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true"
      aria-expanded="false">
      <i class="bx bx-shopping-bag fs-22"></i>
      <span
        class="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info"
        id="cartItemsAmount1">0</span>
    </button>
    <div class="dropdown-menu dropdown-menu-xl dropdown-menu-center p-0 dropdown-menu-cart"
      aria-labelledby="page-header-cart-dropdown"
      style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(0px, 58px);"
      data-popper-placement="bottom-end">
      <div class="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
        <div class="row align-items-center">
          <div class="col">
            <h6 class="m-0 fs-16 fw-semibold"> Моя корзина</h6>
          </div>
          <div class="col-auto">
            <!-- <button type="button" class="btn btn-soft-secondary waves-effect">secondary</button> -->
            <a class="badge bg-secondary-subtle text-secondary fs-13"><span class="cartitem-badge"
                id="cartItemsAmount2">0</span>
              товари</a>
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary close-cart-btn" onclick="closeCartDropdown()">
              <i class="ri-close-fill fs-16"></i>
            </button>
          </div>
        </div>
      </div>
      <div data-simplebar="init" style="max-height: 160px;" class="simplebar-scrollable-y">
        <div class="simplebar-wrapper" style="margin: 0px;">
          <div class="simplebar-height-auto-observer-wrapper">
            <div class="simplebar-height-auto-observer"></div>
          </div>
          <div class="simplebar-mask">
            <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
              <div class="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content"
                style="height: auto; overflow: hidden scroll;">
                <div class="simplebar-content" style="padding: 0px;">
                  <div class="p-2" id="ItemsContainerCart">
                    <div class="text-center empty-cart" id="empty-cart" style="display: none;">
                      <div class="avatar-md mx-auto my-3">
                        <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                          <i class="bx bx-cart"></i>
                        </div>
                      </div>
                      <h5 class="mb-3">Your Cart is Empty!</h5>
                      <a href="apps-ecommerce-products.html" class="btn btn-success w-md mb-3">Shop Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="simplebar-placeholder" style="width: 420px; height: 336px;"></div>
        </div>
        <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
          <div class="simplebar-scrollbar" style="width: 0px; display: none;"></div>
        </div>
        <div class="simplebar-track simplebar-vertical" style="visibility: visible;">
          <div class="simplebar-scrollbar"
            style="height: 50px; display: block; transform: translate3d(0px, 33px, 0px);"></div>
        </div>
      </div>
      <div class="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border" style="display: block;">
        <div class="d-flex justify-content-between align-items-center pb-3">
          <h5 class="m-0 text-muted">Сума:</h5>
          <div class="px-2">
            <h5 class="m-0" id="totalCartPrice"></h5>
          </div>
        </div>

        <a href="/cart/" class="btn btn-success text-center w-100">
          До корзини
        </a>
      </div>
    </div>
  </div>
  </div>
  <div class="d-flex">
    <a href="https://www.sportrelaxnutritions.com">
      <img src="/static/images/logo-srn.png" alt="" height="56">
    </a>
  </div>
  <div id="phone-div" class="d-flex">
    <img src="/static/images/vodafon.png" alt="" height="38">
      <h4 class="m-2">+380 50 954 91 70</h4>
  </div>
</div>
`

const mobileHtml = `
<div class="d-flex">
  <button class="btn btn-ghost" style="margin-right: 15px;" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
    <i class="ri-align-left text-muted fs-24"></i>
  </button>
</div>
<div class="d-flex">
  <a href="https://www.sportrelaxnutritions.com">
    <img src="/static/images/logo-srn.png" alt="" height="56">
  </a>
</div>
<div class="d-flex">
  <div class="dropdown d-md-none topbar-head-dropdown header-item" id="mobile-search">
    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle" id="page-header-search-dropdown" data-bs-toggle="dropdown" aria-haspopup="false" aria-expanded="false">
        <i class="bx bx-search fs-22"></i>
    </button>
    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0" aria-labelledby="page-header-search-dropdown">
        <form class="p-3">
            <div class="form-group m-0">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Search ..." id="searchGoodPhone">
                    <button class="btn btn-info" type="button" id="mobileSearchButton" value=""><i class="mdi mdi-magnify"></i></button>
                </div>
            </div>
        </form>
    </div>
  </div>
  <div class="dropdown topbar-head-dropdown ms-1 header-item">  <!-- Корзина -->
    <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
      id="page-header-cart-dropdown" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-haspopup="true"
      aria-expanded="false">
      <i class="bx bx-shopping-bag fs-22"></i>
      <span
        class="position-absolute topbar-badge cartitem-badge fs-10 translate-middle badge rounded-pill bg-info"
        id="cartItemsAmount1">0</span>
    </button>
    <div class="dropdown-menu dropdown-menu-xl dropdown-menu-center p-0 dropdown-menu-cart"
      aria-labelledby="page-header-cart-dropdown"
      style="position: absolute; inset: 0px 0px auto auto; margin: 0px; transform: translate(0px, 58px);"
      data-popper-placement="bottom-end">
      <div class="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
        <div class="row align-items-center">
          <div class="col">
            <h6 class="m-0 fs-16 fw-semibold"> Моя корзина</h6>
          </div>
          <div class="col-auto">
            <!-- <button type="button" class="btn btn-soft-secondary waves-effect">secondary</button> -->
            <a class="badge bg-secondary-subtle text-secondary fs-13"><span class="cartitem-badge"
                id="cartItemsAmount2">0</span>
              товари</a>
          </div>
          <div class="col-auto">
            <button type="button" class="btn btn-icon btn-sm btn-ghost-secondary close-cart-btn" onclick="closeCartDropdown()">
              <i class="ri-close-fill fs-16"></i>
            </button>
          </div>
        </div>
      </div>
      <div data-simplebar="init" style="max-height: 160px;" class="simplebar-scrollable-y">
        <div class="simplebar-wrapper" style="margin: 0px;">
          <div class="simplebar-height-auto-observer-wrapper">
            <div class="simplebar-height-auto-observer"></div>
          </div>
          <div class="simplebar-mask">
            <div class="simplebar-offset" style="right: 0px; bottom: 0px;">
              <div class="simplebar-content-wrapper" tabindex="0" role="region" aria-label="scrollable content"
                style="height: auto; overflow: hidden scroll;">
                <div class="simplebar-content" style="padding: 0px;">
                  <div class="p-2" id="ItemsContainerCart">
                    <div class="text-center empty-cart" id="empty-cart" style="display: none;">
                      <div class="avatar-md mx-auto my-3">
                        <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                          <i class="bx bx-cart"></i>
                        </div>
                      </div>
                      <h5 class="mb-3">Your Cart is Empty!</h5>
                      <a href="apps-ecommerce-products.html" class="btn btn-success w-md mb-3">Shop Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="simplebar-placeholder" style="width: 420px; height: 336px;"></div>
        </div>
        <div class="simplebar-track simplebar-horizontal" style="visibility: hidden;">
          <div class="simplebar-scrollbar" style="width: 0px; display: none;"></div>
        </div>
        <div class="simplebar-track simplebar-vertical" style="visibility: visible;">
          <div class="simplebar-scrollbar"
            style="height: 50px; display: block; transform: translate3d(0px, 33px, 0px);"></div>
        </div>
      </div>
      <div class="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border" style="display: block;">
        <div class="d-flex justify-content-between align-items-center pb-3">
          <h5 class="m-0 text-muted">Сума:</h5>
          <div class="px-2">
            <h5 class="m-0" id="totalCartPrice"></h5>
          </div>
        </div>

        <a href="/cart/" class="btn btn-success text-center w-100">
          До корзини
        </a>
      </div>
    </div>
  </div>
</div>
`
function setupSearchEventListeners() {
  const searchGood = document.getElementById("searchGood");
  const mobileSearchButton = document.getElementById("mobileSearchButton");
  
  if (searchGood) {
    searchGood.addEventListener("input", function () {
      clearTimeout(typingTimer);
      searchValue = this.value.trim();
      typingTimer = setTimeout(function () {
        currentPage = 1;
        const url = goodCardsListUrl(orderBy, searchValue, filterByProducer);
        goodCardsList(url, true);
      }, doneTypingInterval);
    });
  } else {
    console.error("searchGood element not found");
  }

  if (mobileSearchButton) {
    mobileSearchButton.addEventListener("click", function () {
      searchValue = document.getElementById("searchGoodPhone").value.trim();
      currentPage = 1;
      const url = goodCardsListUrl(orderBy, searchValue, filterByProducer);
      goodCardsList(url, true);
    });
  } else {
    console.error("mobileSearchButton element not found");
  }
}

// Function to insert the correct HTML content based on window width
function topBarContent() {
  const goodsTopBar = document.getElementById("goodsTopBar");
  if (goodsTopBar) {
    if (window.innerWidth > 950) {
      goodsTopBar.innerHTML = pcHtml;
    } else {
      goodsTopBar.innerHTML = mobileHtml;
    }
    setupSearchEventListeners(); // Attach event listeners after updating content
  } else {
    console.error("goodsTopBar element not found");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  topBarContent();
  window.addEventListener("resize", topBarContent);
});