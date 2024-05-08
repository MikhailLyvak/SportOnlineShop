"use strict";
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#hourly_table", {
        "ordering":  false,
        "footerCallback": false,
        "info": false,
    })
})

document.addEventListener("DOMContentLoaded", function() {
    new DataTable("#activation_table", {
        "ordering":  false,
        "footerCallback": false,
        "info": false,
    })
})

function create_html_td(approved, approved_by, approved_by_url, approved_by_slug){
    let html_td;
    if(approved === true){
        html_td = `
            <div class="row d-flex">
                <div class="col justify-content-center">
                  <span class="badge rounded-pill border border-success text-success">${gettext("Confirmed")}</span>
                </div>
                <div class="col">
                  <a href="{% url 'authentication:user_detail' ${approved_by_slug} %}"
                     class="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                     data-bs-placement="top"
                     title="${approved_by}">
                    <div class="avatar-xxs">
                      <img src="${approved_by_url}" alt=""
                           class="img-fluid rounded-circle">
                    </div>
                  </a>
                </div>
              </div>
            `;
    }else{
        html_td = `
            <div class="row d-flex">
                <div class="col justify-content-center">
                  <span class="badge rounded-pill border border-danger text-danger">${gettext("Rejected")}</span>
                </div>
                <div class="col">
                  <a href="{% url 'authentication:user_detail' ${approved_by_slug} %}"
                     class="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                     data-bs-placement="top"
                     title="${approved_by}">
                    <div class="avatar-xxs">
                      <img src="${approved_by_url}" alt=""
                           class="img-fluid rounded-circle">
                    </div>
                  </a>
                </div>
              </div>
            `;
    }
    return html_td;

}

function approve_signal(id, approve){
    const csrftoken = getCookie('csrftoken');
    const url = `/trap/signal-approve`;
    const data = {
        'id': id,
        'approve': approve
    };
    fetch(
        url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data),
        }
    )
        .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
        .then(responseData => {
            console.log(responseData);
            let data = responseData.data;
            if(responseData.status === 'success'){
                if(data){
                                console.log(data);

                    document.getElementById(`signal_${id}`).innerHTML = create_html_td(data.approve, data.approved_by, data.approved_by_url, data.approved_by_slug);

                }
            }else if(data.status === 'error'){
                notify(gettext('Error'), 'alert-danger');
            }

        })
        .catch(error => {
                    console.error('Error:', error);
                });
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

function approve_all(){
 for(let i = 0; i < activate_signals_js.length; i++){
     if(activate_signals_js[i].approved === 1){
        continue;
     }
    approve_signal(activate_signals_js[i].id, true);
    console.log(activate_signals_js[i]);
 }
}

function getFormData($form){
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function(n, i){
      indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}


function open_approve_signal_modal(signal_id, set_status) {
  const csrfToken = getCookie('csrftoken');
  const url = `/approve_trap_signal/${signal_id}/${set_status}`;

  $.ajax({
    data: {'signal_id': signal_id, 'set_status': set_status},
    url: url,
    context: document.body,
    error: function (response) {
      console.log(response);
    },
  }).done(function (response) {
    let modal = $('#ApproveSignalModal');
    let newModal = response;

    modal.empty();
    modal.append(newModal);
    modal.modal('show');
  })
};

function saveApprovedSignal(signal_id, set_status) {
  const csrfToken = getCookie('csrftoken');
  const url = `/approve_trap_signal/${signal_id}/${set_status}`;
  let modal_form = getFormData($('#form-approve-signal-comment-modal'));
  let data = JSON.stringify(modal_form);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: data,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      let data = responseData.data;
      if (responseData.status === 'ok') {
        if (data) {
          document.getElementById(`signal_${signal_id}`).innerHTML = change_td_html(set_status, data.approved_by, data.approved_by_url, data.approved_by_avatar_url);
          document.getElementById(`signal_${signal_id}_comment`).innerHTML = data.comment;
        }
        $('#ApproveSignalModal').modal('hide');
        notify(gettext(`Signal seted to ${set_status} status successfully`), 'alert-success');
      } else if (data.status === 'error') {
        notify(gettext('Error'), 'alert-danger');
      }
    })
};

function change_td_html(set_status, approved_by, approved_by_url, approved_by_avatar_url) {
  let statusBadge;
  switch (set_status) {
    case 'APPROVED_MICE':
      statusBadge = `<span class="badge rounded-pill border border-success text-success">${gettext('Confirmed mice')}</span>`;
      break;
    case 'APPROVED_NOT_MICE':
      statusBadge = `<span class="badge rounded-pill border border-warning text-warning">${gettext('Confirmed non-target')}</span>`;
      break;
    case 'REJECTED':
      statusBadge = `<span class="badge rounded-pill border border-danger text-danger">${gettext('Rejected')}</span>`;
      break;
  }

  let html_td = `
              <div class="row">
              <div class="col-9 text-start">
                ${statusBadge}
                </div>
              <div class="col-2 text-start">
                <a href="${approved_by_url}"
                  class="avatar-group-item" data-bs-toggle="tooltip" data-bs-trigger="hover"
                  target="_blank"
                  data-bs-placement="top"
                  title="${approved_by}">
                  <div class="avatar-xxs">
                    <img src="${approved_by_avatar_url}" alt=""
                        class="img-fluid rounded-circle">
                  </div>
                </a>
              </div>
            </div>
            `;

  return html_td;
};