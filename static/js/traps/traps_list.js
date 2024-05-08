"use strict";

let new_trap = [];
function trap_row(trap_serial, trap_model){

}
function action_qr_td(trap_serial){
    return `<div class="btn-group mt-4 mt-sm-0" role="group">
                          <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
                              class="remove-item-btn" data-bs-toggle="modal" data-bs-target=".qr_${ trap_serial }" type="button"
                              >
                            <i class="ri-qr-code-fill"></i>
                          </a></button>
                        </div>
                        <div aria-hidden="true" class="modal modal-sm fade zoomIn qr_${ trap_serial }" id="qr_${ trap_serial }" tabindex="-1">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content ">
                                <img class="card-img-top img-fluid" src="/media/images/trap_qr/${ trap_serial }.png" alt="Card image cap">
                                <div class="card-body text-center justify-content-center">
                                    <h4 class="align-self-center my-2 text-center">Trap Ser.No: ${ trap_serial }</h4>
                                </div>
                            </div><!-- /.modal-content -->
                          </div><!-- /.modal-dialog -->
                        </div><!-- /.modal -->
                        `;
}


function new_row(trap_serial, trap_model){
    return `<tr id="trap_${trap_serial}"
                                    class="align-content-center">
                                  <td>
                                    <div class="d-flex align-items-center"><h6 class="mb-0">${trap_serial} <span
                                        class="badge text-bg-success">New</span>
                                    </h6></div>
                                  </td>
                                    <td>${trap_model}</td>
                                    <td id="trap_action_${trap_serial}" class="action-col">
                                        <div class="btn-group mt-4 mt-sm-0" role="group">
                                          <button type="button" class="btn btn btn-ghost-success btn-icon"
                                                  onclick="add_trap('${trap_serial}')">
                                            <i class="ri-save-3-fill"></i>
                                          </button>
                                          <button type="button" class="btn btn btn-ghost-danger btn-icon"
                                            onclick="reject_new_trap('${trap_serial}')">
                                            <i class="ri-close-fill"></i>
                                          </button>
                                        </div>
                                      </td>
                                 </tr>
                        `;
}


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

function notify(message, type){
  let msg_color;
  if (type == 'alert-danger'){
      msg_color = '#F06548';
  }else if( type == 'alert-success'){
      msg_color = '#0AB39C';
  }else if( type == 'alert-warning'){
        msg_color = '#F7B84B';
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

function check_new_trap(){
    const csrfToken = getCookie('csrftoken');
    const url = `check_new_trap`;
    fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        },
    })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(responseData => {
        let data = responseData.status;
        if (responseData.status === 'success') {
            let tbody = $('#traps_list');
            for (let i = 0; i < responseData.traps.length; i++) {
                let newTrapObject = { serial: responseData.traps[i].serial_number, model: responseData.traps[i].model };

                if (new_trap.some(existingTrap => existingTrap.serial === newTrapObject.serial && existingTrap.model === newTrapObject.model)) {
                    continue;
                }

                new_trap.push(newTrapObject);

                let trap = responseData.traps[i];
                let tr = `${new_row(trap.serial_number, trap.model)}`;
                tbody.prepend(tr);
                notify(gettext(`Detect new trap ${trap.serial_number}. Please chack`), 'alert-warning');
            }

        } else if (responseData.status === 'error') {
            notify(gettext('Error'), 'alert-danger');
        }
        });



}

function reject_new_trap(trap_serial){
    const csrfToken = getCookie('csrftoken');
    const url = `reject_new_trap`;
    let data = JSON.stringify({'trap_serial': trap_serial});
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
        let data = responseData.status;
        if (responseData.status === 'success') {
            $(`#trap_${trap_serial}`).remove();
            notify(gettext(`Trap ${trap_serial} rejected.`), 'alert-success');

        } else if (responseData.status === 'error') {
            notify(gettext('Error'), 'alert-danger');
        }
        });
}

function add_trap(trap_serial){
    const csrfToken = getCookie('csrftoken');
    const url = `add_trap`;
    let data = JSON.stringify({'trap_serial': trap_serial});
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
        let data = responseData.status;
        if (responseData.status === 'success') {
            $(`#trap_action_${trap_serial}`).html(action_qr_td(trap_serial));
            notify(gettext(`Trap added successfully, please print qr code.`), 'alert-success');

        } else if (responseData.status === 'error') {
            notify(gettext('Error'), 'alert-danger');
        }
        })

}

function all_traps_list_tr(trap){
    return `<tr id="trap_${trap.serial_number}"
                class="align-content-center">
                <td>
                  <div class="d-flex align-items-center"><h6 class="mb-0">${trap.serial_number}</h6></div>
                </td>
                <td>${trap.model ? trap.model.trap_type : null}</td>
                <th scope="col">${trap.pest_company ? trap.pest_company.name : null}</th>
                <th scope="col">${trap.object ? trap.object.name : null}</th>
                <th scope="col">${trap.sequence_number}</th>
                <td>
                    <button type="button" class="btn btn btn-ghost-danger btn-icon" onclick=""></button>
                                            
</td>
`;

}

function fetchTraps() {
    const url = `/api/v1/traps`;
    const startTime = performance.now();
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            console.log(`Time to fetch traps: ${duration} milliseconds`);
            let tbody = $('#all_traps_list');
            responseData.forEach(trap => {
                let tr = all_traps_list_tr(trap);
                tbody.append(tr);

            });
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function clear_trap(id){
    const csrfToken = getCookie('csrftoken');
    const url = `/api/v1/clear_trap`;
    let data = JSON.stringify({'pk': id});
    fetch(url, {
        method: 'PUT',
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
        let data = responseData.status;
        if (responseData.status === 'success') {
            notify(gettext(`Trap cleared successfully.`), 'alert-success');
        } else if (responseData.status === 'error') {
            console.log(responseData);
            notify(gettext('Error'), 'alert-danger');
        }
        });


}

document.addEventListener('DOMContentLoaded', () => {
    check_new_trap();
    setInterval(check_new_trap, 500);
    fetchTraps();
    $('#search_traps').on('keyup', function () {
        let value = $(this).val().toLowerCase();
        $('#all_traps_list tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

    });

});
