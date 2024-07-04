function createProducersAccordionItemHtml(producers) {
  let html = `
    <div class="card mb-0">
        <div class="card-header text-muted fs-14">
            ВИРОБНИКИ
            <span class="badge bg-info rounded-pill align-middle ms-1 filter-badge">${producers.length}</span>
        </div>
        <div class="card-body">
  `;

  producers.forEach(producer => {
      html += `
        
          <div class="form-check m-2">
          <input class="form-check-input" type="checkbox" value="${producer.name}" id="producerCheckbox${producer.id}" onchange="toggleProducerFilter('${producer.name}', this)">
              <label class="form-check-label" for="producerRadio${producer.id}">${producer.name}</label>
          </div>
        
      `;
  });

  html += `</div>
    </div>
  `

  return html;
}

// function createAimFiltersAccordionItemHtml(aimFilters) {
//   let html = `
//       <div class="accordion-item">
//           <h2 class="accordion-header" id="flush-headingAimFilters">
//               <button class="accordion-button bg-transparent shadow-none collapsed" type="button"
//                   data-bs-toggle="collapse" data-bs-target="#flush-collapseAimFilters"
//                   aria-expanded="true" aria-controls="flush-collapseAimFilters">
//                   <span class="text-muted text-uppercase fs-12 fw-medium">Цілі тренування</span> 
//                   <span class="badge bg-info rounded-pill align-middle ms-1 filter-badge">${aimFilters.length}</span>
//               </button>
//           </h2>
//           <div id="flush-collapseAimFilters" class="accordion-collapse collapse"
//               aria-labelledby="flush-headingAimFilters">
//               <div class="accordion-body text-body pt-1">
//                   <div class="d-flex flex-column gap-2 filter-check">
//   `;

//   aimFilters.forEach(aimFilter => {
//       html += `
//           <div class="form-check">
//               <input class="form-check-input" type="checkbox" value="${aimFilter.title}" id="aimFilterRadio${aimFilter.id}">
//               <label class="form-check-label" for="aimFilterRadio${aimFilter.id}">${aimFilter.title}</label>
//           </div>
//       `;
//   });

//   html += `
//                   </div>
//               </div>
//           </div>
//       </div>
//   `;

//   return html;
// }

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
                      <span class="badge bg-info rounded-pill align-middle ms-1 filter-badge">${cluster.good_types.length}</span>
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
                  <input class="form-check-input" type="checkbox" value="${goodType.name}" id="goodTypeRadio${goodType.id}" onchange="toggleTypeFilter('${goodType.name}', this)">
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
  fetch('https://www.sportrelaxnutritions.com/api/types/')
      .then(response => response.json())
      .then(data => {
          if (!data || typeof data !== 'object') {
              console.error('Invalid data format received:', data);
              return;
          }

          let container;
          
            container2 = document.getElementById('finalFiltersContainerMobile2');
            container = document.getElementById('finalFiltersContainerMobile');
          

          if (!container) {
              console.error('Container with id "finalFiltersContainer" not found.');
              return;
          }

          if (data.producers) {
              container.innerHTML += createProducersAccordionItemHtml(data.producers);
              container2.innerHTML += createProducersAccordionItemHtml(data.producers);
          }

        //   if (data.aim_filters) {
        //       container.innerHTML += createAimFiltersAccordionItemHtml(data.aim_filters);
        //   }

          if (data.good_type_clusters) {
              container.innerHTML += createGoodTypeClustersAccordionItemHtml(data.good_type_clusters);
              container2.innerHTML += createGoodTypeClustersAccordionItemHtml(data.good_type_clusters);
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
      });
}

document.addEventListener("DOMContentLoaded", function () {
fetchDataAndRender();
});