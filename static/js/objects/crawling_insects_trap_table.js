let crawlingOrderBy = 'sequence_number';
let crawlingCurrentUrl = newCrawlingInsectsTrapsUrl(crawlingOrderBy, slug)

document.addEventListener("DOMContentLoaded", function () {
  updateCrawlingTable(crawlingCurrentUrl);
});

function newCrawlingInsectsTrapsUrl(order_by, slug) {
  return `/api/object/crawling_insects_traps/${slug}?ordering=${order_by}&page=1`;
}

function resetStyles() {
  const orderFields = ['sequence_number', 'total_insects_amount', 'date_of_installation', 'last_visit'];
  orderFields.forEach(field => {
    var iconUpElement = document.getElementById(`crawling_${field}_up`);
    var iconDownElement = document.getElementById(`crawling_${field}_down`);
    var thElement = document.getElementById(`crawling_${field}_api`);

    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = '';
  });
}

function mlAddIcon(order_by) {
  resetStyles();

  var iconUpElement = document.getElementById(`crawling_${order_by}_up`);
  var iconDownElement = document.getElementById(`crawling_${order_by}_down`);
  var thElement = document.getElementById(`crawling_${order_by}_api`);

  if (crawlingOrderBy === order_by) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-trojan";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  } else if (crawlingOrderBy === `-${order_by}`) {
    iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
    iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-trojan";
    thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
  }
};

function updateCrawlingTable(url) {
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
      const tableBody = document.getElementById('crawling_insects_traps_table_api').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = '';

      data.results.forEach(item => {
        const row = tableBody.insertRow();
        var cell;
        cell = row.insertCell();
        cell.innerHTML = getCrawlTrapInsectsAmount(item.total_insects_amount);
        cell.classList.add("text-center");
        row.insertCell().innerHTML = getCrawlingTrapDetailButton(item.slug, item.sequence_number, item.floor_number);
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
        var nextButton = document.getElementById('crawling_next_button');
        var prevButton = document.getElementById('crawling_prev_button');
    
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
      document.getElementById('crawling_page_number').textContent = currentPage + '/' + Math.ceil(data.count / 5);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};

document.getElementById('crawling_next_button').addEventListener('click', function () {
  currentPage++;
  updateCrawlingTable(nextUrl);
});

document.getElementById('crawling_prev_button').addEventListener('click', function () {
  currentPage--;
  updateCrawlingTable(prevUrl);
});

document.getElementById("crawling_sequence_number_api").addEventListener('click', function () {
  crawlingOrderBy = (crawlingOrderBy === "sequence_number") ? "-sequence_number" : "sequence_number";
  currentPage = 1;

  mlAddIcon("sequence_number")

  updateCrawlingTable(newCrawlingInsectsTrapsUrl(crawlingOrderBy, slug));
});

document.getElementById("crawling_total_insects_amount_api").addEventListener('click', function () {
  crawlingOrderBy = (crawlingOrderBy === "total_insects_amount") ? "-total_insects_amount" : "total_insects_amount";
  currentPage = 1;

  mlAddIcon("total_insects_amount")

  updateCrawlingTable(newCrawlingInsectsTrapsUrl(crawlingOrderBy, slug));
});

document.getElementById("crawling_last_visit_api").addEventListener('click', function () {
  crawlingOrderBy = (crawlingOrderBy === "last_visit") ? "-last_visit" : "last_visit";
  currentPage = 1;

  mlAddIcon("last_visit")

  updateCrawlingTable(newCrawlingInsectsTrapsUrl(crawlingOrderBy, slug));
});

document.getElementById("crawling_date_of_installation_api").addEventListener('click', function () {
  crawlingOrderBy = (crawlingOrderBy === "date_of_installation") ? "-date_of_installation" : "date_of_installation";
  currentPage = 1;

  mlAddIcon("date_of_installation")

  updateCrawlingTable(newCrawlingInsectsTrapsUrl(crawlingOrderBy, slug));
});

function getCrawlingTrapDetailButton(trap_slug, trap_number, floor_number) {
  const disabledAttribute = floor_number === null ? 'ml-disabled' : '';
  return `
      <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill ${disabledAttribute}"
          href="/crawling_insects_trap/info/${trap_slug}" type="button">
        <i class="ri-eye-line label-icon align-middle rounded-pill fs-16 me-2"></i>${trap_number}
      </a>
    `
}

function getCrawlTrapInsectsAmount(amount) {
  const colour = amount > 0 ? 'success' : 'dark'
  return `
  <button
      type="button"
      class="btn btn-sm btn-ghost-${colour} btn-rounded custom-toggle active m-1 text-${colour}"
      data-bs-toggle="button"
      title="Bait in trap"
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${colour}">${amount}</span>
      <span class="icon-on fs-6 text-${colour}"><i class="ri-bug-2-fill align-bottom"></i></span>
      <span class="icon-off fs-6 text-${colour}"><i class="ri-bug-2-fill align-bottom"></i></span>
    </button>
  `
};

