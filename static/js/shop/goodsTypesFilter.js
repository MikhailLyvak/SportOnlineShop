function createProducersAccordionItemHtml(producers) {
  let html = `
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingProducers">
              <button class="accordion-button bg-transparent shadow-none collapsed" type="button"
                  data-bs-toggle="collapse" data-bs-target="#flush-collapseProducers"
                  aria-expanded="true" aria-controls="flush-collapseProducers">
                  <span class="text-muted text-uppercase fs-12 fw-medium">Producers</span> 
                  <span class="badge bg-success rounded-pill align-middle ms-1 filter-badge">${producers.length}</span>
              </button>
          </h2>
          <div id="flush-collapseProducers" class="accordion-collapse collapse"
              aria-labelledby="flush-headingProducers">
              <div class="accordion-body text-body pt-1">
                  <div class="d-flex flex-column gap-2 filter-check">
  `;

  producers.forEach(producer => {
      html += `
          <div class="form-check">
              <input class="form-check-input" type="checkbox" value="${producer.name}" id="producerRadio${producer.id}">
              <label class="form-check-label" for="producerRadio${producer.id}">${producer.name}</label>
          </div>
      `;
  });

  html += `
                  </div>
              </div>
          </div>
      </div>
  `;

  return html;
}

function createAimFiltersAccordionItemHtml(aimFilters) {
  let html = `
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingAimFilters">
              <button class="accordion-button bg-transparent shadow-none collapsed" type="button"
                  data-bs-toggle="collapse" data-bs-target="#flush-collapseAimFilters"
                  aria-expanded="true" aria-controls="flush-collapseAimFilters">
                  <span class="text-muted text-uppercase fs-12 fw-medium">Aim Filters</span> 
                  <span class="badge bg-success rounded-pill align-middle ms-1 filter-badge">${aimFilters.length}</span>
              </button>
          </h2>
          <div id="flush-collapseAimFilters" class="accordion-collapse collapse"
              aria-labelledby="flush-headingAimFilters">
              <div class="accordion-body text-body pt-1">
                  <div class="d-flex flex-column gap-2 filter-check">
  `;

  aimFilters.forEach(aimFilter => {
      html += `
          <div class="form-check">
              <input class="form-check-input" type="checkbox" value="${aimFilter.title}" id="aimFilterRadio${aimFilter.id}">
              <label class="form-check-label" for="aimFilterRadio${aimFilter.id}">${aimFilter.title}</label>
          </div>
      `;
  });

  html += `
                  </div>
              </div>
          </div>
      </div>
  `;

  return html;
}

function createGoodTypeClustersAccordionItemHtml(goodTypeClusters) {
  let html = '';
  goodTypeClusters.forEach(cluster => {
      html += `
          <div class="accordion-item">
              <h2 class="accordion-header" id="flush-headingCluster${cluster.id}">
                  <button class="accordion-button bg-transparent shadow-none collapsed" type="button"
                      data-bs-toggle="collapse" data-bs-target="#flush-collapseCluster${cluster.id}"
                      aria-expanded="true" aria-controls="flush-collapseCluster${cluster.id}">
                      <span class="text-muted text-uppercase fs-12 fw-medium">${cluster.name}</span> 
                      <span class="badge bg-success rounded-pill align-middle ms-1 filter-badge">${cluster.good_types.length}</span>
                  </button>
              </h2>
              <div id="flush-collapseCluster${cluster.id}" class="accordion-collapse collapse"
                  aria-labelledby="flush-headingCluster${cluster.id}">
                  <div class="accordion-body text-body pt-1">
                      <div class="d-flex flex-column gap-2 filter-check">
      `;

      cluster.good_types.forEach(goodType => {
          html += `
              <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${goodType.name}" id="goodTypeRadio${goodType.id}">
                  <label class="form-check-label" for="goodTypeRadio${goodType.id}">${goodType.name}</label>
              </div>
          `;
      });

      html += `
                      </div>
                  </div>
              </div>
          </div>
      `;
  });

  return html;
}

function fetchDataAndRender() {
  fetch('http://185.233.116.13:8000/api/types/')
      .then(response => response.json())
      .then(data => {
          if (!data || typeof data !== 'object') {
              console.error('Invalid data format received:', data);
              return;
          }
          
          const container = document.getElementById('finalFiltersContainer');
          if (!container) {
              console.error('Container with id "finalFiltersContainer" not found.');
              return;
          }

          if (data.producers) {
              container.innerHTML += createProducersAccordionItemHtml(data.producers);
          }

          if (data.aim_filters) {
              container.innerHTML += createAimFiltersAccordionItemHtml(data.aim_filters);
          }

          if (data.good_type_clusters) {
              container.innerHTML += createGoodTypeClustersAccordionItemHtml(data.good_type_clusters);
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}

document.addEventListener("DOMContentLoaded", function () {
fetchDataAndRender();
});