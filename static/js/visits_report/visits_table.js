function newUrl(order_by) {
  return `/api/visits_report_full_list/?ordering=${order_by}&page=1`;
}


document.addEventListener("DOMContentLoaded", function () {
  let currentPage = 1;
  let orderBy = '-visit_date';
  let currentUrl = newUrl(orderBy)
  let nextUrl = null;
  let prevUrl = null;
  const orderFields = ['status_annotation', 'object', 'visit_date', 'period'];

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
    var thElement = document.getElementById(order_by);

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
        const tableBody = document.getElementById('visit_full_table_api').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        // Loop through the data and create rows
        data.results.forEach(item => {
          // Create a new row
          const row = tableBody.insertRow();

          // Populate cells in the row
          row.insertCell().innerHTML = getStatusIcon(item.status);
          row.insertCell().innerText = item.object;
          row.insertCell().innerText = item.visit_date;
          row.insertCell().innerHTML = getCommentButton(item.comment_modal, item.id);
          row.insertCell().innerText = item.visit_type_func;
          row.insertCell().innerHTML = item.created_by_icon;
          row.insertCell().innerText = item.period;
          row.insertCell().innerHTML = getActions(item.actions);
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

  document.getElementById('next_button').addEventListener('click', function () {
    var nextButton = document.getElementById('next_button');
    var prevButton = document.getElementById('prev_button');
    currentPage++;
    nextButton.classList.add('disabled');
    this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
    prevButton.classList.add('disabled');
    updateTable(nextUrl);
  });

  document.getElementById('prev_button').addEventListener('click', function () {
      var nextButton = document.getElementById('next_button');
      var prevButton = document.getElementById('prev_button');
      currentPage--;
      prevButton.classList.add('disabled');
      this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
      nextButton.classList.add('disabled')
      updateTable(prevUrl);
  });

  document.getElementById("status_annotation").addEventListener('click', function () {
    orderBy = (orderBy === "status_annotation") ? "-status_annotation" : "status_annotation";
    currentPage = 1;

    mlAddIcon("status_annotation")

    updateTable(newUrl(orderBy));
  });

  document.getElementById("object").addEventListener('click', function () {
    orderBy = (orderBy === "object") ? "-object" : "object";
    currentPage = 1;

    mlAddIcon("object")

    updateTable(newUrl(orderBy));
  });

  document.getElementById("visit_date").addEventListener('click', function () {
    orderBy = (orderBy === "visit_date") ? "-visit_date" : "visit_date";
    currentPage = 1;

    mlAddIcon("visit_date")

    updateTable(newUrl(orderBy));
  });

  document.getElementById("period").addEventListener('click', function () {
    orderBy = (orderBy === "period") ? "-period" : "period";
    currentPage = 1;

    mlAddIcon("period")

    updateTable(newUrl(orderBy));
  });


  // Function to get status icon based on status, completion, and date
  function getStatusIcon(status) {
    if (status === 1) {
      return '<span class="fs-3 text-center"><i title="The visit was not completed at the specified time!" class="text-danger ri-checkbox-blank-circle-fill"></i></span>';
    } else if (status === 2) {
      return '<span class="fs-3 text-center"><i title="The visit was successfully completed!" class="text-success ri-checkbox-blank-circle-fill"></i></span>';
    } else {
      return '<div title="A visit is planned for the future!" class="spinner-grow text-light text-center" role="status"><span class="sr-only">Loading...</span></div>';
    }
  }

  // Function to get comment button based on visit comment and ID
  function getCommentButton(visitComment, itemId) {
    if (visitComment[0] === true) {
      return `
              <a
                title="Read the comment"
                type="button"
                class="delete-link btn btn-info"
                onclick="get_visit_comment_modal(${itemId})"
                id="get_visit_comment_${itemId}"
              >
                 <i class="ri-file-paper-line"></i>
              </a>`;
    } else {
      return `
              <a title="Add a comment" type="button" class="btn btn-success"
                onclick="update_visit_comment_modal(${itemId})" id="update_visit_comment_${itemId}">
                 <i class="ri-file-add-fill"></i>
              </a>`;
    }
  }

  // Function to generate HTML for actions based on the actions array
  function getActions(actions) {
    const actionHTML = `
            <div class="row ml-2 mr-2 text-center align-content-center">
              <div class="col-3 text-center align-content-center">
                  <div class="icon-container p-2">
                      <a title="${actions[0].title}" type="button" 
                          ${actions[0].modal ? `data-bs-toggle="modal" data-bs-target="${actions[0].modal}"` : `href="${actions[0].href}"`} 
                          class="${actions[0].class}">
                          ${actions[0].icon}
                      </a>
                  </div>
              </div>
              <div class="col-3 text-center align-content-center">
                  <div class="icon-container p-2">
                      <a title="${actions[1].title}" type="button" 
                          ${actions[1].modal ? `data-bs-toggle="modal" data-bs-target="${actions[1].modal}"` : `href="${actions[1].href}"`} 
                          class="${actions[1].class}">
                          ${actions[1].icon}
                      </a>
                  </div>
              </div>
              <div class="col-3 text-center align-content-center">
                  <div class="icon-container p-2">
                      <a title="${actions[2].title}" type="button" 
                          onclick=open_delete_modal(${actions[2].id})
                          class="${actions[2].class}">
                          ${actions[2].icon}
                      </a>
                  </div>
              </div>
              <div class="col-3 text-center align-content-center">
                  <div class="icon-container p-2">
                      <a title="${actions[3].title}" type="button" 
                          ${actions[3].modal ? `data-bs-toggle="modal" data-bs-target="${actions[3].modal}"` : `href="${actions[3].href}"`} 
                          class="${actions[3].class}">
                          ${actions[3].icon}
                      </a>
                  </div>
              </div>
            </div>`;

    return actionHTML;
  }
});

function open_delete_modal(visit_id) {
  const csrfToken = getCookie('csrftoken');
  const url = `/visits_report_full_list/${visit_id}/delete_visit_modal/`;

  $.ajax({
    data: {'visit_id': visit_id},
    url: url,
    context: document.body,
    error: function (response) {
      console.log(response);
    },
  }).done(function (response) {
    let modal = $('#confirmDeleteModal');
    let new_modal = response;

    modal.empty();
    modal.append(new_modal);
    modal.modal('show');
  });
};


// Відкриває модалку з коментарем до відвідування.
function get_visit_comment_modal(visit_id) {
  const csrfToken = getCookie('csrftoken');
  const url = `/visits_report_full_list/${visit_id}/check_visit_comment/`;

  $.ajax({
    data: {'visit_id': visit_id},
    url: url,
    context: document.body,
    error: function (response) {
      console.log(response);
    },
  }).done(function (response) {
    let modal = $('#readCommentModal');
    let new_modal = response;

    modal.empty();
    modal.append(new_modal);
    modal.modal('show');
  });
};

function update_visit_comment_modal(visit_id) {
  const csrfToken = getCookie('csrftoken');
  const url = `/visits_report_full_list/${visit_id}/update_visit_comment/`;

  $.ajax({
    data: {'visit_id': visit_id},
    url: url,
    context: document.body,
    error: function (response) {
      console.log(response);
    },
  }).done(function (response) {
    let modal = $('#updateCommentModal');
    let new_modal = response;

    modal.empty();
    modal.append(new_modal);
    modal.modal('show');
  });
}

function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

function notify(message, type){
  let msg_color;
  if (type == 'alert-danger'){
      msg_color = '#F06548';
  }else{
      msg_color = '#0AB39C';
  }
  Toastify({
      text: message,
      duration: 8000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: msg_color,
      stopOnFocus: true,
  }).showToast();
}


function updateComment(visit_id) {
  const csrfToken = getCookie('csrftoken');
  let modal_form = getFormData($('#form-comment-modal'));
  let data = JSON.stringify(modal_form);
  const url = `/visits_report_full_list/${visit_id}/update_visit_comment/`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: data,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
      if (responseData.status === 'ok') {
        $('#updateCommentModal').modal('hide');
        reRenderButtons(visit_id);
        notify(gettext('Comment added successfully'), 'alert-success');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

function reRenderButtons(visit_id) {
  const commentButton = $(`#update_visit_comment_${visit_id}`);
  commentButton.removeClass('btn-success').addClass('btn-info');
  commentButton.attr('onclick', `get_visit_comment_modal(${visit_id})`);
  commentButton.find('i').removeClass('ri-file-add-fill').addClass('ri-file-paper-line');
}
