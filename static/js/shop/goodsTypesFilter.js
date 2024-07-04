function rangePicker(id) {
    return `
        <div class="card">
            <div id="${id}" class="noUi-target noUi-ltr noUi-horizontal noUi-txt-dir-ltr mx-3 my-3" style="height: 12px !important;"></div>
            <div class="d-inline-flex gap-2 mt-2">
                <input type="number" class="form-control mx-3" min="-20" max="40" step="1" id="${id}-start" placeholder="Start Value" disabled>
                <input type="number" class="form-control mx-3" min="-20" max="40" step="1" id="${id}-end" placeholder="End Value" disabled>
            </div>
        </div>
    `;
}


function initializeSlider(id) {
    const slider = document.getElementById(id);
    const numberInputStart = document.getElementById(`${id}-start`);
    const numberInputEnd = document.getElementById(`${id}-end`);

    if (!slider) {
        console.error(`Slider element with id "${id}" not found.`);
        return;
    }

    if (!numberInputStart || !numberInputEnd) {
        console.error('Input elements not found.');
        return;
    }

    noUiSlider.create(slider, {
        start: [minSearchPrice, maxSearchPrice],
        connect: true,
        range: {
            'min': 0,
            'max': 5000
        },
        format: {
            to: function (value) {
                return Math.round(value);
            },
            from: function (value) {
                return Number(value);
            }
        }
    });

    slider.noUiSlider.on('update', function (values, handle) {
        numberInputStart.value = values[0];
        numberInputEnd.value = values[1];
        minSearchPrice = values[0];
        maxSearchPrice = values[1];
    });

    numberInputStart.addEventListener('change', function () {
        slider.noUiSlider.set([this.value, null]);
    });

    numberInputEnd.addEventListener('change', function () {
        slider.noUiSlider.set([null, this.value]);
    });

    slider.noUiSlider.on('change', function () {
        const url = goodCardsListUrl(orderBy, searchValue, filterByProducer, filterByType, null, minSearchPrice, maxSearchPrice);
        goodCardsList(url, true);
    });
}

// Call the initialize function for each slider


document.addEventListener("DOMContentLoaded", function () {
    fetchDataAndRender();
});

function fetchDataAndRender() {
    fetch('https://www.sportrelaxnutritions.com/api/types/')
        .then(response => response.json())
        .then(data => {
            if (!data || typeof data !== 'object') {
                console.error('Invalid data format received:', data);
                return;
            }

            const container = document.getElementById('finalFiltersContainerMobile');
            const container2 = document.getElementById('finalFiltersContainerMobile2');

            if (!container || !container2) {
                console.error('Container elements not found.');
                return;
            }

            container.innerHTML += rangePicker('slider1');
            container2.innerHTML += rangePicker('slider2');

                
            if (data.producers) {
                
                container.innerHTML += createProducersAccordionItemHtml(data.producers);
                container2.innerHTML += createProducersAccordionItemHtml(data.producers);
            }

            if (data.good_type_clusters) {
                container.innerHTML += createGoodTypeClustersAccordionItemHtml(data.good_type_clusters);
                container2.innerHTML += createGoodTypeClustersAccordionItemHtml(data.good_type_clusters);
            }

            // Delay the initialization to ensure the element is in the DOM
            setTimeout(() => {
                initializeSlider('slider1');
                initializeSlider('slider2');
            }, 100);
             // Adjust the timeout as needed
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

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