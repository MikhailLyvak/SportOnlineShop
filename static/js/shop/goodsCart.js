document.addEventListener('DOMContentLoaded', function () {
  cartGoodsUpdate()
});


function cartGoodsUpdate() {
  fetch('/api/cart_items/')
    .then(response => response.json())
    .then(data => {
      const cartItemsAmount1 = document.getElementById('cartItemsAmount1');
      const cartItemsAmount2 = document.getElementById('cartItemsAmount2');
      const ItemsContainerCart = document.getElementById('ItemsContainerCart');
      const totalCartPrice = document.getElementById('totalCartPrice');

      // Update cart item count
      const itemCount = data[0].items.length;
      cartItemsAmount1.textContent = itemCount;
      cartItemsAmount2.textContent = itemCount;

      // Show all items in the cart
      if (itemCount !== 0) {
        let html = '';
        data[0].items.forEach(item => {
          const truncatedVariant = item.good_variant.length > 23 ? item.good_variant.substring(0, 23) + '...' : item.good_variant;
          html += `
            <div class="d-block dropdown-item dropdown-item-cart text-wrap px-3 py-2" id="cartItem_${item.id}">
              <div class="d-flex align-items-center">
                <img src="${item.photo}"
                  class="me-3 rounded-circle avatar-sm p-2 bg-light" alt="user-pic">
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1 fs-14">
                    <a href="#" title="${item.good_variant}" class="text-reset">${truncatedVariant}</a>
                  </h6>
                  <p class="mb-0 fs-12 text-muted">
                    К-ть: <span>${item.amount} x ${item.item_on_discount ? item.item_discount_price : item.item_price}грн.</span>
                  </p>
                </div>
                <div class="px-2">
                  <h5 class="m-0 fw-normal"><span class="cart-item-price">${item.items_total_price} грн.</span></h5>
                </div>
                <div class="ps-2">
                  <button
                    type="button"
                    class="btn btn-icon btn-sm btn-ghost-secondary remove-item-btn"
                    onclick="deleteCartItem(${item.id})"
                    >
                    <i class="ri-close-fill fs-16"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        });
        ItemsContainerCart.innerHTML = html;
        totalCartPrice.textContent = `${data[0].total_price} грн.`;
      } else {
        let html = '';
        html += `
        <div class="p-2">
          <div class="text-center empty-cart">
            <div class="avatar-md mx-auto my-3">
              <div class="avatar-title bg-info-subtle text-info fs-36 rounded-circle" style="background-color: #48b8f745;">
                <i class="bx bx-cart"></i>
              </div>
            </div>
            <h5 class="mb-3">Ваша корзина пуста!</h5>
          </div>
        </div>
        `;
        ItemsContainerCart.innerHTML = html;
        totalCartPrice.textContent = `${data[0].total_price} грн.`;
      }
    })
    .catch(error => {
      console.error('Error fetching cart data:', error);
    })
    .finally(function () {});
}


const deleteCartItem = (itemId) => {
  fetch(`/api/cart_items/${itemId}/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete cart item');
      }
    })
    .catch(error => {
      console.error('Error deleting cart item:', error.message);
    })
    .finally(() => {
      cartGoodsUpdate();
    });
};