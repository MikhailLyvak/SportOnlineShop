function newUrl(order_by, slug) {
    return `/api/crawling_insects_trap_signals_api/${slug}/?ordering=${order_by}&page=1`;
  }
  
  
  document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let orderBy = '-visit_time';
    let currentUrl = newUrl(orderBy, slug)
    let nextUrl = null;
    let prevUrl = null;
    const orderFields = ['visit_time', 'added_by', 'insect_type', 'insects_amount'];
  
    function resetStyles() {
      orderFields.forEach(field => {
        var iconUpElement = document.getElementById(`${field}_up`);
        var iconDownElement = document.getElementById(`${field}_down`);
        var thElement = document.getElementById(field);
  
        iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
        iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
        thElement.style.backgroundColor = '';
      });
    }
  
  
    function mlAddIcon(order_by) {
      resetStyles();
  
      var iconUpElement = document.getElementById(`${order_by}_up`);
      var iconDownElement = document.getElementById(`${order_by}_down`);
      var thElement = document.getElementById(`${order_by}`);
  
      if (orderBy === order_by) {
        iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-trojan";
        iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
        thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
      } else if (orderBy === `-${order_by}`) {
        iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
        iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-trojan";
        thElement.style.backgroundColor = 'rgba(141, 84, 196, 0.2)';
      }
    };
  
    function updateTable(url) {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          const tableBody = document.getElementById('crawling_signals_table_api').getElementsByTagName('tbody')[0];
          tableBody.innerHTML = '';
  
          // Loop through the data and create rows
          data.results.forEach(item => {
            // Create a new row
            const row = tableBody.insertRow();
            var cell;
            cell = row.insertCell();
            cell.innerText = item.visit_time;
            cell.classList.add("text-center");
            cell = row.insertCell();
            cell.innerText = item.insects_amount;
            cell.classList.add("text-center");
            cell = row.insertCell();
            cell.innerText = item.insect_type;
            cell.classList.add("text-center");
            cell = row.insertCell();
            cell.innerHTML = getUserData(item.added_by);
            cell.classList.add("text-center");
            cell = row.insertCell();
            if (item.comment) {
              cell.innerText = item.comment;
            } else {
              cell.innerHTML = `<h6 class="text-danger">No comment added</h6>`
            }
            
            const viewPhotosButton = document.createElement('button');
            viewPhotosButton.innerHTML = '<i class="ri-image-fill text-info fs-18"></i>';
            viewPhotosButton.classList.add('btn', 'btn-soft-info', 'waves-effect', 'waves-light');
            viewPhotosButton.type = 'button';
            viewPhotosButton.dataset.toggle = 'modal';
            viewPhotosButton.dataset.target = '#photoCarouselModal';
            cell = row.insertCell();
            cell.classList.add("text-center");
            cell.setAttribute("style", "max-width:50px; min-width:50px;");
            cell.appendChild(viewPhotosButton);
  
            if (item.photos.length > 0) {
              viewPhotosButton.addEventListener('click', function() {
                openPhotoCarousel(item.photos);
              });
            } else {
              viewPhotosButton.disabled = true;
            }
            
          });
  
          nextUrl = data.next;
          prevUrl = data.previous;
  
          
          document.getElementById('page_number').textContent = currentPage + '/' + Math.ceil(data.count / 5);
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(function() {
          updatePaginationButtons();
      });
    };
  
    function updatePaginationButtons() {
      var nextButton = document.getElementById('next_button');
      var prevButton = document.getElementById('prev_button');
      document.getElementById('next_button').innerHTML = 'Next<i class="mdi mdi-chevron-right"></i>';
      document.getElementById('prev_button').innerHTML = '<i class="mdi mdi-chevron-left"></i>Previous';
      nextButton.classList.remove('disabled');
      prevButton.classList.remove('disabled');
      if (!nextUrl) {
          nextButton.classList.add('disabled');
      }
      if (!prevUrl) {
          prevButton.classList.add('disabled');
      }
    }
  
    updateTable(currentUrl);
    animatedNumers();
  
    document.getElementById('next_button').addEventListener('click', function () {
      currentPage++;
      var prevButton = document.getElementById('prev_button');
      this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
      this.disabled = true;
      prevButton.classList.add('disabled');
      updateTable(nextUrl);
  });
  
  document.getElementById('prev_button').addEventListener('click', function () {
      currentPage--;
      var nextButton = document.getElementById('next_button');
      this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
      this.disabled = true;
      nextButton.classList.add('disabled')
      updateTable(prevUrl);
  });
  
    document.getElementById("visit_time").addEventListener('click', function () {
      orderBy = (orderBy === "visit_time") ? "-visit_time" : "visit_time";
      currentPage = 1;
  
      mlAddIcon("visit_time")
  
      updateTable(newUrl(orderBy, slug));
    });
  
    document.getElementById("insect_type").addEventListener('click', function () {
      orderBy = (orderBy === "insect_type") ? "-insect_type" : "insect_type";
      currentPage = 1;
  
      mlAddIcon("insect_type")
  
      updateTable(newUrl(orderBy, slug));
    });
  
    document.getElementById("insects_amount").addEventListener('click', function () {
      orderBy = (orderBy === "insects_amount") ? "-insects_amount" : "insects_amount";
      currentPage = 1;
  
      mlAddIcon("insects_amount")
  
      updateTable(newUrl(orderBy, slug));
    });
  
    document.getElementById("added_by").addEventListener('click', function () {
      orderBy = (orderBy === "added_by") ? "-added_by" : "added_by";
      currentPage = 1;
  
      mlAddIcon("added_by")
  
      updateTable(newUrl(orderBy, slug));
    });
  });
  
  function openPhotoCarousel(photos) {
    const carouselIndicators = document.getElementById('carouselIndicators');
    const carouselInner = document.getElementById('carouselInner');
    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';
  
    photos.forEach((photo, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (index === 0) {
        carouselItem.classList.add('active');
      }
      const img = document.createElement('img');
      img.src = photo;
      img.classList.add('d-block', 'img-fluid', 'mx-auto');
      carouselItem.appendChild(img);
      carouselInner.appendChild(carouselItem);
  
      const indicator = document.createElement('button');
      indicator.type = 'button';
      indicator.dataset.bsTarget = '#carouselExampleFade';
      indicator.dataset.bsSlideTo = index;
      if (index === 0) {
        indicator.classList.add('active');
      }
      carouselIndicators.appendChild(indicator);
    });
  
    const photoCarouselModal = new bootstrap.Modal(document.getElementById('photoCarouselModal'));
    photoCarouselModal.show();
  }
  
  function animatedNumers() {
    const obj1 = document.getElementById("insects_amount_sum_animation");
    animateValue(obj1, 0, insects_amount_sum);

    const obj2 = document.getElementById("visits_count_animation");
    animateValue(obj2, 0, visits_count);
  
  };
  
  
  function animateValue(obj, start, end) {
    let startTimestamp = null;
    let duration = 1000;
  
    if (end !== 0 && end < 75) {
        duration = end * 50;
    } else if (end !== 0 && end > 100) {
        duration = end * 25;
    }
  
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerText = `${currentValue}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
  
    window.requestAnimationFrame(step);
  }
  
  function getUserData(user) {
    return `
      <div class="row ml-2">
      <div class="col-9 text-center">
        <span class="ml-3">${user.last_name} ${user.first_name}</span>
      </div>
      <div class="col-2 text-end">
        <a href="/user/${user.slug}/detail"
          target="_blank"
          class="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
          data-bs-placement="top"
          title="${user.last_name} ${user.first_name}">
          <div class="avatar-xxs">
            <img src="${user.avatar}" alt=""
                class="img-fluid rounded-circle">
          </div>
        </a>
      </div>
    </div>
    `
  }
