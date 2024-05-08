let baitOrderBy = 'sequence_number';
let baitCurrentUrl = newManualTrapsUrl(baitOrderBy, slug)


document.addEventListener("DOMContentLoaded", function () {
  updateBaitTable(baitCurrentUrl);
});

function newManualTrapsUrl(order_by, slug) {
  return `/api/object/traps/${slug}?ordering=${order_by}&page=1`;
}

function resetStyles() {
  const orderFields = ['sequence_number', 'bait_filling', 'date_of_installation'];
  orderFields.forEach(field => {
    var iconUpElement = document.getElementById(`${field}_up`);
    var iconDownElement = document.getElementById(`${field}_down`);
    var thElement = document.getElementById(`${field}_api`);

    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = '';
  });
}

function mlAddIcon(order_by) {
  resetStyles();

  var iconUpElement = document.getElementById(`${order_by}_up`);
  var iconDownElement = document.getElementById(`${order_by}_down`);
  var thElement = document.getElementById(`${order_by}_api`);

  if (baitOrderBy === order_by) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-trojan";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  } else if (baitOrderBy === `-${order_by}`) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-trojan";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  }
};


function updateBaitTable(url) {
  let nextUrl = null;
  let prevUrl = null;
  let currentPage = 1;
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const tableBody = document.getElementById('manual_traps_table_api').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      data.results.forEach(item => {
        const row = tableBody.insertRow();
        var cell;
        cell = row.insertCell();
        cell.innerHTML = getTrapBaitFilling(item.bait_filling, item.bait_eaten_sum);
        cell.classList.add("text-center");
        row.insertCell().innerHTML = getTrapDetailButton(item.slug, item.sequence_number, item.floor_number);
        row.insertCell().innerHTML = item.floor_number !== null ? getTrapPlanButton(slug, item) : getTrapSetPlanButton(slug, item);
        cell = row.insertCell();
        cell.innerHTML = getAction(item.slug, item.id);
        cell.classList.add("text-center");
        cell.setAttribute("style", "max-width:70px; min-width:70px;");
        cell = row.insertCell();
        cell.innerHTML = item.trap_type;
        cell.classList.add("text-center");
        cell = row.insertCell();
        cell.innerHTML = item.last_visit;
        cell.classList.add("text-center");
        cell = row.insertCell();
        cell.innerText = item.serial_number;
        cell.classList.add("text-center");
        cell = row.insertCell();
        cell.innerText = item.save_level;
        cell.classList.add("text-center");
        cell = row.insertCell();
        cell.innerText = item.date_of_installation;
        cell.classList.add("text-center");
        cell.setAttribute("style", "max-width:180px; min-width:180px;");
      });

      nextUrl = data.next;
      prevUrl = data.previous;

      function updatePaginationButtons() {
        var nextButton = document.getElementById('next_button');
        var prevButton = document.getElementById('prev_button');
      
        if (nextUrl) {
          nextButton.classList.remove('disabled');
        } else {
          nextButton.classList.add('disabled');
        }
      
        if (prevUrl) {
          prevButton.classList.remove('disabled');
        } else {
          prevButton.classList.add('disabled');
        }
      }

      updatePaginationButtons();
      document.getElementById('page_number').textContent = currentPage + '/' + Math.ceil(data.count / 5);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};



document.getElementById('next_button').addEventListener('click', function () {
  currentPage++;
  updateBaitTable(nextUrl);
});

document.getElementById('prev_button').addEventListener('click', function () {
  currentPage--;
  updateBaitTable(prevUrl);
});

document.getElementById("sequence_number_api").addEventListener('click', function () {
  baitOrderBy = (baitOrderBy === "sequence_number") ? "-sequence_number" : "sequence_number";
  currentPage = 1;

  mlAddIcon("sequence_number")

  updateBaitTable(newManualTrapsUrl(baitOrderBy, slug));
});

document.getElementById("bait_filling_api").addEventListener('click', function () {
  baitOrderBy = (baitOrderBy === "bait_filling") ? "-bait_filling" : "bait_filling";
  currentPage = 1;

  mlAddIcon("bait_filling")

  updateBaitTable(newManualTrapsUrl(baitOrderBy, slug));
});


document.getElementById("date_of_installation_api").addEventListener('click', function () {
  baitOrderBy = (baitOrderBy === "date_of_installation") ? "-date_of_installation" : "date_of_installation";
  currentPage = 1;

  mlAddIcon("date_of_installation")

  updateBaitTable(newManualTrapsUrl(baitOrderBy, slug));
});

function getTrapDetailButton(trap_slug, trap_number, floor_number) {
  const disabledAttribute = floor_number === null ? 'ml-disabled' : '';
  return `
      <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill ${disabledAttribute}"
          href="/bait_trap/info/${trap_slug}" type="button">
        <i class="ri-eye-line label-icon align-middle rounded-pill fs-16 me-2"></i>${trap_number}
      </a>
    `;
}


function getTrapPlanButton(slug, item) {
  return `
          <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill"
          href="/object/plan/trap/${slug}/${item.floor_number.slug}/${item.slug}"
          type="button">
        <i class="ri-treasure-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>${item.floor_number.title}
        </a>
      `
};


function getTrapSetPlanButton(slug, item) {
  return `
          <a class="btn d-grid btn-sm btn-soft-warning btn-label waves-effect waves-light rounded-pill"
          href="/object/plan/${slug}/${item.default_plan}"
          type="button">
        <i class="ri-road-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>Позначити на плані
        </a>
      `
};


function getTrapBaitFilling(amount, eaten_amount) {
  const colour = amount > 20 ? 'success' : (amount < 5 ? 'danger' : 'warning')
  return `
  <button
      type="button"
      class="btn btn-sm btn-ghost-${colour} btn-rounded custom-toggle active m-1 text-${colour}"
      data-bs-toggle="button"
      title="Bait in trap"
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${colour}">${amount}</span>
      <span class="icon-on fs-6 text-${colour}"><i class="ri-store-fill align-bottom"></i></span>
      <span class="icon-off fs-6 text-${colour}"><i class="ri-store-fill align-bottom"></i></span>
    </button>
    <button
      type="button"
      class="btn btn-sm btn-ghost-info btn-rounded custom-toggle active m-1 text-info"
      data-bs-toggle="button"
      title="Eaten bait"
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-info">${eaten_amount}</span>
      <span class="icon-on fs-6 text-info"><i class="ri-bubble-chart-fill align-bottom"></i></span>
      <span class="icon-off fs-6 text-info"><i class="ri-bubble-chart-fill align-bottom"></i></span>
    </button>`;
};


function getAction(trap_slug, id) {
  return `
    <button type="button" class="btn btn-sm btn-ghost-primary btn-icon">
      <a class="remove-item-btn" data-bs-toggle="modal" data-bs-target=".qr_${id}" type="button">
        <i class="ri-qr-code-fill fs-18"></i>
      </a>
    </button>
  `
};

