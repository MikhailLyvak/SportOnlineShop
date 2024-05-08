let feromonOrderBy = 'sequence_number';
let feromonCurrentUrl = newFeromonTrapsUrl(feromonOrderBy, slug)

document.addEventListener("DOMContentLoaded", function () {
  updateFeromonTable(feromonCurrentUrl);
});

function newFeromonTrapsUrl(order_by, slug) {
  return `/api/object/feromon_traps/${slug}?ordering=${order_by}&page=1`;
}

function resetStyles() {
  const orderFields = ['sequence_number', 'date_of_installation', 'last_visit'];
  orderFields.forEach(field => {
    var iconUpElement = document.getElementById(`feromon_${field}_up`);
    var iconDownElement = document.getElementById(`feromon_${field}_down`);
    var thElement = document.getElementById(`feromon_${field}_api`);

    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = '';
  });
}

function mlAddIcon(order_by) {
  resetStyles();

  var iconUpElement = document.getElementById(`feromon_${order_by}_up`);
  var iconDownElement = document.getElementById(`feromon_${order_by}_down`);
  var thElement = document.getElementById(`feromon_${order_by}_api`);

  if (feromonOrderBy === order_by) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-trojan";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  } else if (feromonOrderBy === `-${order_by}`) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-trojan";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  }
};

function updateFeromonTable(url) {
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
      const tableBody = document.getElementById('feromon_traps_table_api').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      data.results.forEach(item => {
        const row = tableBody.insertRow();
        var cell;
        cell = row.insertCell();
        cell.innerHTML = getTrapInsectsAmount(item.total_moth_amount);
        cell.classList.add("text-center");
        row.insertCell().innerHTML = getFeromonTrapDetailButton(item.slug, item.sequence_number, item.floor_number);
        row.insertCell().innerHTML = item.floor_number !== null ? getTrapPlanButton(slug, item) : getTrapSetPlanButton(slug, item);
        cell = row.insertCell();
        cell.innerHTML = getAction(item.slug, item.id);
        cell.classList.add("text-center");
        cell = row.insertCell();
        cell.innerText = item.trap_type;
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
        var nextButton = document.getElementById('feromon_next_button');
        var prevButton = document.getElementById('feromon_prev_button');
    
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
      document.getElementById('feromon_page_number').textContent = currentPage + '/' + Math.ceil(data.count / 5);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

document.getElementById('feromon_next_button').addEventListener('click', function () {
  currentPage++;
  updateFeromonTable(nextUrl);
});

document.getElementById('feromon_prev_button').addEventListener('click', function () {
  currentPage--;
  updateFeromonTable(prevUrl);
});

document.getElementById("feromon_sequence_number_api").addEventListener('click', function () {
  feromonOrderBy = (feromonOrderBy === "sequence_number") ? "-sequence_number" : "sequence_number";
  currentPage = 1;

  mlAddIcon("sequence_number")

  updateFeromonTable(newFeromonTrapsUrl(feromonOrderBy, slug));
});


document.getElementById("feromon_last_visit_api").addEventListener('click', function () {
  feromonOrderBy = (feromonOrderBy === "last_visit") ? "-last_visit" : "last_visit";
  currentPage = 1;

  mlAddIcon("last_visit")

  updateFeromonTable(newFeromonTrapsUrl(feromonOrderBy, slug));
});

document.getElementById("feromon_date_of_installation_api").addEventListener('click', function () {
  feromonOrderBy = (feromonOrderBy === "date_of_installation") ? "-date_of_installation" : "date_of_installation";
  currentPage = 1;

  mlAddIcon("date_of_installation")

  updateFeromonTable(newFeromonTrapsUrl(feromonOrderBy, slug));
});


function getFeromonTrapDetailButton(trap_slug, trap_number, floor_number) {
  const disabledAttribute = floor_number === null ? 'ml-disabled' : '';
  return `
      <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill ${disabledAttribute}"
          href="/feromon_trap/info/${trap_slug}" type="button">
        <i class="ri-eye-line label-icon align-middle rounded-pill fs-16 me-2"></i>${trap_number}
      </a>
    `
}

function getTrapInsectsAmount(amount) {
  const colour = amount > 0 ? 'success' : 'dark'
  return `
  <button
      type="button"
      class="btn btn-sm btn-ghost-${colour} btn-rounded custom-toggle active m-1 text-${colour}"
      data-bs-toggle="button"
      title="Bait in trap"
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${colour}">${amount}</span>
      <span class="icon-on fs-6 text-${colour}"><i class="ri-bug-fill align-bottom"></i></span>
      <span class="icon-off fs-6 text-${colour}"><i class="ri-bug-fill align-bottom"></i></span>
    </button>
  `
};

