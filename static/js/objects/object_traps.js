"use strict";
// import {updateBaitTable, newManualTrapsUrl} from

// const video = document.getElementById('qr-video');
// const videoContainer = document.getElementById('video-container');
// const camHasCamera = document.getElementById('cam-has-camera');
// const camList = document.getElementById('cam-list');
// const camHasFlash = document.getElementById('cam-has-flash');
// const flashToggle = document.getElementById('flash-toggle');
// const flashState = document.getElementById('flash-state');
// const camQrResult = document.getElementById('cam-qr-result');
// const camQrResultTimestamp = document.getElementById('cam-qr-result-timestamp');
// const fileSelector = document.getElementById('file-selector');
// const fileQrResult = document.getElementById('file-qr-result');
//
// function setResult(label, result) {
//     console.log(result.data);
//     label.textContent = result.data;
//     camQrResultTimestamp.textContent = new Date().toString();
//     label.style.color = 'teal';
//     clearTimeout(label.highlightTimeout);
//     label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
// }
//
// // ####### Web Cam Scanning #######
//
// const scanner = new QrScanner(video, result => setResult(camQrResult, result), {
//     onDecodeError: error => {
//         camQrResult.textContent = error;
//         camQrResult.style.color = 'inherit';
//     },
//     highlightScanRegion: true,
//     highlightCodeOutline: true,
// });
//
// const updateFlashAvailability = () => {
//     scanner.hasFlash().then(hasFlash => {
//         camHasFlash.textContent = hasFlash;
//         flashToggle.style.display = hasFlash ? 'inline-block' : 'none';
//     });
// };
//
// scanner.start().then(() => {
//     updateFlashAvailability();
//     // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
//     // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
//     // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
//     // start the scanner earlier.
//     QrScanner.listCameras(true).then(cameras => cameras.forEach(camera => {
//         const option = document.createElement('option');
//         option.value = camera.id;
//         option.text = camera.label;
//         camList.add(option);
//     }));
// });
//
// QrScanner.hasCamera().then(hasCamera => camHasCamera.textContent = hasCamera);
//
// // for debugging
// window.scanner = scanner;
//
// document.getElementById('scan-region-highlight-style-select').addEventListener('change', (e) => {
//     videoContainer.className = e.target.value;
//     scanner._updateOverlay(); // reposition the highlight because style 2 sets position: relative
// });
//
// document.getElementById('show-scan-region').addEventListener('change', (e) => {
//     const input = e.target;
//     const label = input.parentNode;
//     label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
//     scanner.$canvas.style.display = input.checked ? 'block' : 'none';
// });
//
// document.getElementById('inversion-mode-select').addEventListener('change', event => {
//     scanner.setInversionMode(event.target.value);
// });
//
// camList.addEventListener('change', event => {
//     scanner.setCamera(event.target.value).then(updateFlashAvailability);
// });
//
// flashToggle.addEventListener('click', () => {
//     scanner.toggleFlash().then(() => flashState.textContent = scanner.isFlashOn() ? 'on' : 'off');
// });
//
// document.getElementById('start-button').addEventListener('click', () => {
//     scanner.start();
// });
//
// document.getElementById('stop-button').addEventListener('click', () => {
//     scanner.stop();
// });
//
// // ####### File Scanning #######
//
// fileSelector.addEventListener('change', event => {
//     const file = fileSelector.files[0];
//     if (!file) {
//         return;
//     }
//     QrScanner.scanImage(file, { returnDetailedScanResult: true })
//         .then(result => setResult(fileQrResult, result))
//         .catch(e => setResult(fileQrResult, { data: e || 'No QR code found.' }));
// });


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

let hub_dt;
let trap_dt;

// function PrintElem(serial_number, id)
// {
//     let modal = $(`#qr_${id}`);
//     modal.modal('toggle');
//     let elem = `<div class="modal-content">
//           <img class="card-img-top img-fluid" src="/media/images/trap_qr/${serial_number}.png" alt="Card image cap">
//           <div class="card-body text-center justify-content-center">
//             <h4 class="align-self-center my-2 text-center">Trap Ser.No: ${serial_number}</h4>
//           </div>
//         </div>`;
//     var headstr = "<html><head><title></title></head><body>";
//     var footstr = "</body>";
//     var oldstr = document.body.innerHTML;
//     document.body.innerHTML = headstr + elem + footstr;
//     window.print();
//
//     document.body.innerHTML = oldstr;
//     return false;
// }

function init_plan_btn() {
    if (default_plan_slug === '') {
        return `<a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill"
                                       href="/floor-plan/add/${slug}"
                                       type="button">
                                      <i class="ri-treasure-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>${gettext("Create the plan")}
                                    </a>`;
    } else {
        return `<a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill"
                                   href="/object/plan/${slug}/${default_plan_slug}"
                                   type="button">
                                  <i class="ri-treasure-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>${gettext("Mark on the plan")}
                                </a>`;
    }


}

function installHub() {
    const csrftoken = getCookie('csrftoken');
    var hubId = document.getElementById("hub").value;
    var sequenceNumber = document.getElementById("hub_sequence_number").value;
    var dateOfInstallation = document.getElementById("hub_date_of_installation").value;
    var installmentComment = document.getElementById("hub_description").value;

    var data = {
        hub_id: hubId,
        sequence_number: sequenceNumber,
        date_of_installation: dateOfInstallation,
        installment_comment: installmentComment
    };

    fetch(`/hub/install/${slug}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if (response['status'] == 'success') {
                let hub = response.hub;
                console.log(response['data']['hub']);
                let new_row = `<tr id="hub_${hubId}" class="clickable-row" data-href="{% url 'trap:hub_info' ${response['data']['hub']['slug']} %}">
                                    <td>${response['data']['hub']['serial_number']}</td>
                                    <td>${response['data']['hub']['model']}</td>
                                    <td>${response['data']['hub']['sequence_number']}</td>
                                    <td>${response['data']['hub']['firmware']}</td>
                                    <td>0</td>
                                    <td>${response['data']['hub']['date_of_installment']}</td>
                                    <td>
                                        <ul class="list-inline hstack gap-2 mb-0">
                                            <li class="list-inline-item"
                                                data-bs-toggle="tooltip"
                                                data-bs-trigger="hover"
                                                data-bs-placement="top"
                                                title="View">
                                                <a href="{% url 'trap:hub_info' ${response['data']['hub']['slug']} %}"
                                                   class="view-item-btn"><i
                                                        class="ri-eye-fill align-bottom text-muted"></i></a>
                                            </li>
                                            <li class="list-inline-item"
                                                data-bs-toggle="tooltip"
                                                data-bs-trigger="hover"
                                                data-bs-placement="top"
                                                title="Edit">
                                                <a class="edit-item-btn"
                                                   href="{% url 'trap:hub_update' ${response['data']['hub']['slug']} %}"><i
                                                        class="ri-pencil-fill align-bottom text-muted"></i></a>
                                            </li>
                                            <li class="list-inline-item"
                                                data-bs-toggle="tooltip"
                                                data-bs-trigger="hover"
                                                data-bs-placement="top"
                                                title="Delete">
                                                <a class="remove-item-btn"
                                                   data-bs-toggle="modal"
                                                   href="#remove_${response['data']['hub']['pk']}">
                                                    <i class="ri-delete-bin-fill align-bottom text-muted"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>`;
                // document.querySelector("#install-hub-modal").modal('hide');
                // $("#install-hub-modal").modal('hide');
                // document.querySelector("#hub_table").insertAdjacentHTML('beforeend', new_row);
                location.reload();
            }

        })
        .catch(error => {
            console.log(error);
        });
}


function installTrap() {
  const csrftoken = getCookie('csrftoken');
  var trapId = document.getElementById("trap").value;
  var sequenceNumber = document.getElementById("sequence_number").value;
  var hubId = document.getElementById("trap_hub").value;
  var dateOfInstallation = document.getElementById("date_of_installation").value;
  var installmentPicture = document.getElementById("installment_picture").files[0];
  var installmentComment = document.getElementById("description").value;
  var recommendedBait = document.getElementById("trap_recommended_bait").value;

  var data = {
    trap_id: trapId,
    sequence_number: sequenceNumber,
    hub_id: hubId,
    date_of_installation: dateOfInstallation,
    installment_picture: installmentPicture,
    installment_comment: installmentComment,
    recommended_bait: recommendedBait
  };

  fetch(`/trap/install/${slug}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(response => {
        if(response['status'] == 'success') {
            let trap = response.trap;
            if (trap.type === 'BS') {
                updateBaitTable(newManualTrapsUrl('sequence_number', slug))
            } else if (trap.type === 'CIT') {
                updateCrawlingTable(newCrawlingInsectsTrapsUrl('sequence_number', slug))
            } else if (trap.type === 'FIT') {
                updateFeromonTable(newFeromonTrapsUrl('sequence_number', slug))
            } else {
                addMCTTrap(trap);
            }
            $("#install-trap-modal").modal('hide');
            $('#trap').val('');
            $('#sequence_number').val('');
            $('#trap_hub').val('');
            $('#date_of_installation').val('');
            $('#installment_picture').val('');
            $('#description').val('');
            $('#trap_recommended_bait').val('');
        }

      // location.reload();

    })
    .catch(error => {
      console.log(error);
    });
}

function addMCTTrap(trap) {
    let new_row = `
        <tr class="align-content-center" id="tr_trap_${trap.serial_number}">
        <td value="2" class="justify-content-center text-center">            
            <button title="${gettext("There is no connection with the trap")}" type="button"
                    class="btn btn-sm btn-ghost-dark btn-rounded custom-toggle active"
                    data-bs-toggle="button">
                <span class="icon-on fs-6"><i class="ri-wifi-off-fill align-bottom"></i></span>
                <span class="icon-off fs-6"><i class="ri-wifi-off-fill align-bottom"></i></span>
            </button>                        
            <button title="${gettext("Battery is normal")}" type="button"
                    class="btn btn-sm btn-ghost-success btn-rounded custom-toggle active"
                    data-bs-toggle="button">
            <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">-</span>
                <span class="icon-off fs-6 text-success"><i
                    class="ri-battery-fill align-bottom "></i></span>
                <span class="icon-on fs-6 text-success"><i
                    class="ri-battery-fill align-bottom "></i></span>
            </button>                        
            <button type="button" class="btn btn-sm btn-ghost-success btn-rounded custom-toggle active"
                    data-bs-toggle="button">
            <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">-</span>
                <span class="icon-on fs-6 text-success"><i class="ri-mickey-fill align-bottom"></i></span>
                <span class="icon-off fs-6 text-success"><i
                    class="ri-mickey-fill align-bottom"></i></span>
            </button>
        </td>
        
            <td class="text-center"
                id="trap_${trap.id}">${trap.sequence_number}</td>
        <td class="text-center" id="td_trap_mapbtn_{{ trap.serial_number }}">
            ${init_plan_btn()}
        </td>
            <td class="text-center" style="max-width: 5%; min-width: 5%;">
            ----                            
            </td>
        <td class="text-center">${trap.type}</td>
        <td class="text-center">${trap.serial_number}</td>
        <td class="text-center">${trap.model}</td>
        <td class="text-center">${trap.hub}</td>
        <td class="text-center">----</td>
        <td class="text-center">----</td>
        <td class="text-center">----</td>
        <td class="text-center">----</td>

        </tr>


        `;
    trap_dt.destroy();
    document.querySelector("#trap_table_tbody").insertAdjacentHTML('beforeend', new_row);
    trap_dt = new DataTable("#traps_table", {
        columnDefs: [
                        {
                            targets: [4, 5, 6, 7, 11],
                            visible: false,
                            searchable: false
                        },
                    ],
        "ordering": true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("Trap per page")}`,
            "zeroRecords": `${gettext("The table is empty")}`,
            "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
            "infoEmpty": `${gettext("No records available")}`,
            "infoFiltered": gettext("(filtered from _MAX_ total records)"),
            "search": `${gettext("Search")}:`,
            "paginate": {
                "previous": `${gettext("Back")}`,
                "next": `${gettext("Forward")}`,
            }
        }
    });
}


function make_del_trap_modal(serial_number) {
    let del_trap_modal = `<div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-body text-center p-5">
                                            <lord-icon
                                                src="https://cdn.lordicon.com/tdrtiskw.json"
                                                trigger="loop"
                                                colors="primary:#f7b84b,secondary:#405189"
                                                style="width:130px;height:130px">
                                            </lord-icon>
                                            <div class="mt-4 pt-4">
                                                <h4>${gettext("Removing the trap")}</h4>
                                                <p class="text-muted">${gettext("You have several options for removing the trap")}:</p>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_from_plan_${serial_number}">
                                                    <label class="form-check-label" for="del_from_plan_${serial_number}">
                                                        ${gettext("Remove the trap from the plan (the trap will remain on the object)")}
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_from_object_${serial_number}">
                                                    <label class="form-check-label" for="del_from_object_${serial_number}">
                                                        ${gettext("Remove the trap from the object (it will be removed from the master and the object)")}
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_${serial_number}">
                                                    <label class="form-check-label" for="del_${serial_number}">
                                                        ${gettext("Remove the trap (it will be completely removed from the system)")}
                                                    </label>
                                                </div>
                                                <!-- Toogle to second dialog -->
                                                <button id="continue_btn" disabled class="btn btn-warning" data-bs-toggle="button" onclick='show_trap_del_modal("${serial_number}")'>
                                                    ${gettext("Continue")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
    return del_trap_modal;
}

function make_del_hub_modal(hub) {
    let del_hub_modal = `<div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-body text-center p-5">
                                            <lord-icon
                                                src="https://cdn.lordicon.com/tdrtiskw.json"
                                                trigger="loop"
                                                colors="primary:#f7b84b,secondary:#405189"
                                                style="width:130px;height:130px">
                                            </lord-icon>
                                            <div class="mt-4 pt-4">
                                                <h4>${gettext("Removing the hub")}</h4>
                                                <p class="text-muted">${gettext("You have several options for removing the hub")}:</p>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_from_plan_${hub.serial_number}">
                                                    <label class="form-check-label" for="del_from_plan_${hub.serial_number}">
                                                        ${gettext("Remove the hub from the plan (the hub will remain on the object)")}
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_from_object_${hub.serial_number}">
                                                    <label class="form-check-label" for="del_from_object_${hub.serial_number}">
                                                        ${gettext("Remove the hub from the object (it will be deleted from the master and the object)")}
                                                    </label>
                                                </div>
                                                <div class="form-check form-check-outline form-check-danger mb-3">
                                                    <input class="form-check-input" type="checkbox" id="del_${hub.serial_number}">
                                                    <label class="form-check-label" for="del_${hub.serial_number}">
                                                        ${gettext("Remove the hub (it will be completely removed from the system)")}
                                                    </label>
                                                </div>
                                                <!-- Toogle to second dialog -->
                                                <button id="continue_btn" disabled class="btn btn-warning" data-bs-toggle="button" onclick="floor_init.show_hub_del_modal(${hub.number})">
                                                    ${gettext("Continue")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                `;
    return del_hub_modal;
}

function make_del_hub_success_modal(hub, msg) {
    let del_trap_success_modal = `<div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-body text-center p-5">
                                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style="width:100px;height:100px"></lord-icon>
                                                    <div class="mt-4 pt-3">
                                                        <h4 class="mb-3">${msg}</h4>
                                                        <p class="text-muted mb-4"></p>
                                                        <div class="hstack gap-2 justify-content-center">
                                                            <button id="del_trap_btn" type="button" class="btn btn-danger" onclick="floor_init.hub_del(${hub.number})">${gettext("Remove")}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                       `;
    return del_trap_success_modal;
}

function show_hub_prepare_del_modal(serial_number) {
    let new_modal = $(make_del_hub_modal(serial_number))
    $(`#delete_hub_modal`).empty();
    $(`#delete_hub_modal`).append(new_modal);
    $(`#delete_hub_modal`).modal('show');
    $(`#del_from_plan_${serial_number}`).on("click", activate_continue_btn.bind(null, serial_number));
    $(`#del_from_object_${serial_number}`).on("click", deactivate_floor_chackbox.bind(null, serial_number));
    $(`#del_${serial_number}`).on("click", deactivate_floor_object_chackbox.bind(null, serial_number));
    $(`#del_trap_btn_${serial_number}`).on("click", deactivate_floor_object_chackbox.bind(null, serial_number));
}

function show_hub_del_modal(marker_id) {
    this.hubsLayer.getLayers().forEach(marker => {
        if (marker.options.id === marker_id.toString()) {
            marker.dragging.disable();

            let hub = marker.options.object_data;
            let plan_chackbox = $(`#del_from_plan_${hub.serial_number}`);
            let object_chackbox = $(`#del_from_object_${hub.serial_number}`);
            let del_chackbox = $(`#del_${hub.serial_number}`);
            let msg = null;
            if (del_chackbox.is(':checked')) {
                msg = gettext(`Remove hub completely from the system?`);
            } else if (object_chackbox.is(':checked')) {
                msg = gettext(`Remove hub from object and plan?`);
            } else if (plan_chackbox.is(':checked')) {
                msg = gettext(`Remove the hub from the plan but leave it on the object?`);
            }

            let new_modal = $(make_del_hub_success_modal(hub, msg));
            $(`#secondmodal`).empty();
            $(`#delete_trap_modal`).modal('hide');
            $(`#secondmodal`).append(new_modal);
            $(`#secondmodal`).modal('show');

        }
    });
}

function make_del_trap_success_modal(serial_number, msg) {
    let del_trap_success_modal = `<div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <div class="modal-body text-center p-5">
                                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" colors="primary:#f7b84b,secondary:#f06548" style="width:100px;height:100px"></lord-icon>
                                                    <div class="mt-4 pt-3">
                                                        <h4 class="mb-3">${msg}</h4>
                                                        <p class="text-muted mb-4"></p>
                                                        <div class="hstack gap-2 justify-content-center">
                                                            <button id="del_trap_btn" type="button" class="btn btn-danger" onclick='trap_del("${serial_number}")'>${gettext("Remove")}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                       `;
    return del_trap_success_modal;
}

function activate_continue_btn(serial_number) {
    let del_from_plan = $(`#del_from_plan_${serial_number}`);
    if (del_from_plan.is(":checked")) {
        $(`#continue_btn`).prop("disabled", false);
    } else {
        $(`#continue_btn`).prop("disabled", true);
    }
}

function deactivate_floor_chackbox(serial_number) {
    let del_checkbox = $(`#del_from_object_${serial_number}`);
    if (del_checkbox.is(":checked")) {
        $(`#del_from_plan_${serial_number}`).prop("checked", true).prop("disabled", true);
        $(`#continue_btn`).prop("disabled", false);
    } else {
        $(`#del_from_plan_${serial_number}`).prop("checked", false).prop("disabled", false);
        $(`#continue_btn`).prop("disabled", true);
    }
}

function deactivate_floor_object_chackbox(serial_number) {
    let del_checkbox = $(`#del_${serial_number}`);
    if (del_checkbox.is(":checked")) {
        $(`#del_from_plan_${serial_number}`).prop("checked", true).prop("disabled", true);
        $(`#del_from_object_${serial_number}`).prop("checked", true).prop("disabled", true);
        $(`#continue_btn`).prop("disabled", false);

    } else {
        $(`#del_from_plan_${serial_number}`).prop("checked", false).prop("disabled", false);
        $(`#del_from_object_${serial_number}`).prop("checked", false).prop("disabled", false);
        $(`#continue_btn`).prop("disabled", true);

    }
}

function show_trap_prepare_del_modal(serial_number) {
    let new_modal = $(make_del_trap_modal(serial_number));
    $(`#delete_trap_modal`).empty();
    $(`#delete_trap_modal`).append(new_modal);
    $(`#delete_trap_modal`).modal('show');
    $(`#del_from_plan_${serial_number}`).on("click", activate_continue_btn.bind(null, serial_number));
    $(`#del_from_object_${serial_number}`).on("click", deactivate_floor_chackbox.bind(null, serial_number));
    $(`#del_${serial_number}`).on("click", deactivate_floor_object_chackbox.bind(null, serial_number));
    $(`#del_trap_btn_${serial_number}`).on("click", deactivate_floor_object_chackbox.bind(null, serial_number));
}

function show_trap_del_modal(serial_number) {
    let plan_chackbox = $(`#del_from_plan_${serial_number}`);
    let object_chackbox = $(`#del_from_object_${serial_number}`);
    let del_chackbox = $(`#del_${serial_number}`);
    let msg = null;
    if (del_chackbox.is(':checked')) {
        msg = gettext(`Remove the trap completely from the system?`);
    } else if (object_chackbox.is(':checked')) {
        msg = gettext(`Remove trap from object and plan?`);
    } else if (plan_chackbox.is(':checked')) {
        msg = gettext(`Remove the trap from the plan but leave it on the object?`);
    }

    let new_modal = $(make_del_trap_success_modal(serial_number, msg));
    $(`#secondmodal`).empty();
    $(`#delete_trap_modal`).modal('hide');
    $(`#secondmodal`).append(new_modal);
    $(`#secondmodal`).modal('show');
}

function trap_del(serial_number) {

    let plan_chackbox = $(`#del_from_plan_${serial_number}`);
    let object_chackbox = $(`#del_from_object_${serial_number}`);
    let del_chackbox = $(`#del_${serial_number}`);
    let delete_from = null;
    if (del_chackbox.is(':checked')) {
        delete_from = 'all';
    } else if (object_chackbox.is(':checked')) {
        delete_from = 'object';
    } else if (plan_chackbox.is(':checked')) {
        delete_from = 'plan';
    } else {
        delete_from = null;
    }
    if (delete_from != null) {
        removeTrap(serial_number, delete_from);
    }
    $(`#secondmodal`).modal('hide');

}

function removeTrap(serial_number, delete_from) {
    const csrftoken = getCookie('csrftoken');
    let data = {
        trap_serial_number: serial_number,
        delete_from: delete_from,
    };
    const url = `/object/traps/${slug}/delete-trap`;
    console.log(data);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if (responseData.status === 'ok') {
                if (data.delete_from === 'all' || data.delete_from === 'object') {
                    console.log(`delete:`);
                    console.log(`#tr_trap_${serial_number}`);
                    $(`#tr_trap_${serial_number}`).remove();
                } else {
                    $(`#td_trap_mapbtn_${serial_number}`).append(
                        `<a class="btn d-grid btn-sm btn-warning btn-label waves-effect waves-light rounded-pill"
                             href="{% url 'objects:object_plan' ${slug} ${default_plan_slug} %}"
                             type="button">
                            <i class="ri-treasure-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>${gettext("Mark on the plan")}
                          </a>`
                    );
                }
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


// function make_update_trap_modal(trap) {
//     let del_trap_modal = `<div class="modal-dialog modal-dialog-centered">
//                                     <div class="modal-content">
//                                         <div class="modal-body text-center p-5">
//                                             <lord-icon
//                                                 src="https://cdn.lordicon.com/tdrtiskw.json"
//                                                 trigger="loop"
//                                                 colors="primary:#f7b84b,secondary:#405189"
//                                                 style="width:130px;height:130px">
//                                             </lord-icon>
//                                             <div class="mt-4 pt-4">
//                                                 <h4>${gettext("Removing the trap")}</h4>
//                                                 <p class="text-muted">${gettext("You have several options for removing the trap")}:</p>
//                                                 <div class="form-check form-check-outline form-check-danger mb-3">
//                                                     <input class="form-check-input" type="checkbox" id="del_from_plan_${trap.serial_number}">
//                                                     <label class="form-check-label" for="del_from_plan_${trap.serial_number}">
//                                                         ${gettext("Remove the trap from the plan (the trap will remain on the object)")}
//                                                     </label>
//                                                 </div>
//                                                 <div class="form-check form-check-outline form-check-danger mb-3">
//                                                     <input class="form-check-input" type="checkbox" id="del_from_object_${trap.serial_number}">
//                                                     <label class="form-check-label" for="del_from_object_${trap.serial_number}">
//                                                         ${gettext("Remove the trap from the object (it will be removed from the master and the object)")}
//                                                     </label>
//                                                 </div>
//                                                 <div class="form-check form-check-outline form-check-danger mb-3">
//                                                     <input class="form-check-input" type="checkbox" id="del_${trap.serial_number}">
//                                                     <label class="form-check-label" for="del_${trap.serial_number}">
//                                                         ${gettext("Remove the trap (it will be completely removed from the system)")}
//                                                     </label>
//                                                 </div>
//                                                 <!-- Toogle to second dialog -->
//                                                 <button id="continue_btn" disabled class="btn btn-warning" data-bs-toggle="button" onclick="floor_init.show_trap_del_modal(${trap.number})">
//                                                     ${gettext("Continue")}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 `;
//     return del_trap_modal;
// }

function get_trap_update_form(trap_id) {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/get-trap-update-form`;
    $.ajax({
        data: {'trap_id': trap_id},
        url: url,
        context: document.body,
        error: function (response, error) {
            //    notify('error', gettext('Error'), gettext('Something went wrong!'));
        }
    }).done(function (response) {
        let modal = $(`#update-trap-modal`);
        let new_modal = response;
        modal.empty();
        modal.append(new_modal);
        modal.modal('show');

    });

}

function get_hub_update_form(hub_id) {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/get-hub-update-form`;
    $.ajax({
        data: {'hub_id': hub_id},
        url: url,
        context: document.body,
        error: function (response, error) {
            //    notify('error', gettext('Error'), gettext('Something went wrong!'));
        }
    }).done(function (response) {
        let modal = $(`#update-hub-modal`);
        let new_modal = response;
        modal.empty();
        modal.append(new_modal);
        modal.modal('show');

    });

}

function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}


function updateTrap(trap_id) {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/get-trap-update-form`;

    let modal_form = getFormData($(`#form-update-trap`));
    if (modal_form.installment_picture === undefined) {
        modal_form.installment_picture = "";
    }
    modal_form.trap_id = trap_id;
    let data = JSON.stringify(modal_form);

    console.log(data);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
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
            console.log(responseData);
            if (responseData.status === 'ok') {
                $(`#update-trap-modal`).modal('hide');
                // location.reload();
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

let online_btn = `<button title=${gettext("Hub online")} type="button"
                                class="btn btn-sm btn-ghost-success btn-rounded custom-toggle active"
                                data-bs-toggle="button">
                          <span class="icon-on fs-6"><i class="ri-wifi-fill align-bottom"></i></span>
                          <span class="icon-off fs-6"><i class="ri-wifi-fill align-bottom"></i></span>
                        </button>`;

let offline_btn = `<button title=${gettext("There is no connection with the trap")} type="button"
                                    class="btn btn-sm btn-ghost-dark btn-rounded custom-toggle active"
                                    data-bs-toggle="button">
                              <span class="icon-on fs-6"><i class="ri-wifi-off-fill align-bottom"></i></span>
                              <span class="icon-off fs-6"><i class="ri-wifi-off-fill align-bottom"></i></span>
                            </button>`;

function get_hubs_status() {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/get-hubs-status`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if (responseData.status === 'ok') {
                let hubs = responseData.data;
                hubs.forEach(hub => {
                    let hub_id = hub.id;
                    let hub_status = hub.status;
                    let hub_last_signal = hub.date;
                    if (hub_status) {
                        $(`#hub_status_${hub_id}`).html(online_btn);
                    } else {
                        $(`#hub_status_${hub_id}`).html(offline_btn);
                    }
                    if (hub_last_signal) {
                        $(`#hub_signal_${hub_id}`).html(`${hub_last_signal}`);
                    } else {
                        $(`#hub_signal_${hub_id}`).html(`----`);
                    }


                });
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


let pending_traps = [];
let pending_interval = null;

function post_trap_add_to_object(trap_serial, hub_serial) {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/add-trap-to-object`;
    let sequence_number = $(`#sequence_number_${trap_serial}`).val();
    let comment = $(`#comment_${trap_serial}`).val();

    let data = {
        trap_serial: trap_serial,
        hub_serial: hub_serial,
        sequence_number: sequence_number,
        comment: comment,

    };
    console.log(data);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if (responseData.status === 'ok') {
                $(`#pending_btn_${trap_serial}`).empty();
                $(`#pending_trap_${trap_serial}`).css('background-color', '#eeffec');
                notify(gettext(`The trap ${trap_serial} has been added to the object!`), 'alert-success');
                pending_traps = pending_traps.filter(function (letter) {
                    return letter !== trap_serial;
                });
                console.log('post_trap_add_to_object', pending_traps);

            }
            set_pending_interval();

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function post_reject_trap(trap_serial, hub_serial) {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/reject-trap`;
    let data = {
        trap_serial: trap_serial,
        hub_serial: hub_serial,
    };
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData);
            if (responseData.status === 'ok') {
                $(`#pending_btn_${trap_serial}`).empty();
                $(`#pending_trap_${trap_serial}`).css('background-color', '#ffecec');
                notify(gettext(`The trap ${trap_serial} has been rejected!`), 'alert-warning');
                pending_traps = pending_traps.filter(item => item !== trap_serial);
            }
            set_pending_interval();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

}

function pending_trap_tr(trap) {
    return `
            <tr id="pending_trap_${trap.trap_serial_number}">
              <td id="td_datetime_add_${trap.trap_serial_number}" class="text-center">${trap.datetime_add}</td>
              <td id="td_serial_${trap.trap_serial_number}" class="text-center">${trap.trap_serial_number}</td>
              <td id="td_sequence_number_${trap.trap_serial_number}" style="max-width: 5%; min-width: 5%;" class="text-center"><input type="number" name="sequence_number" id="sequence_number_${trap.trap_serial_number}" class="form-control form-control-sm" value="${trap.sequence_number}"></td>
              <td id="td_comment_${trap.trap_serial_number}" class="text-center"><input type="text" name="comment" id="comment_${trap.trap_serial_number}" class="form-control form-control-sm" value=""></td>
              <td id="td_hub_serial_number_${trap.trap_serial_number}" class="text-center">${trap.hub_serial_number}</td>              
              <td id="td_action_${trap.trap_serial_number}" class="text-center">
                <div id="pending_btn_${trap.trap_serial_number}" class="btn-group mt-4 mt-sm-0" role="group">
                  <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
                      onclick='post_trap_add_to_object("${trap.trap_serial_number}", "${trap.hub_serial_number}")' type="button">
                    <i class="ri-checkbox-circle-fill fs-20 text-success"></i>
                  </a></button>                        
                  <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
                      class="remove-item-btn" data-bs-toggle="modal" type="button"
                      onclick='post_reject_trap("${trap.trap_serial_number}", "${trap.hub_serial_number}")'>
                    <i class="ri-close-circle-fill fs-20 text-danger"></i>
                  </a></button>
                </div>
              </td>
            </tr>

    `;
}

function get_pending_traps() {
    const csrftoken = getCookie('csrftoken');
    const url = `/object/traps/${slug}/get-pending-traps`;
    let tbody = $(`#pending_traps_trap_tbody`);
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(responseData => {
            console.log(responseData.data);
            if (responseData.status === 'ok') {
                let traps = responseData.data;
                traps.forEach(trap => {
                    if ($(`#pending_trap_${trap.trap_serial_number}`).length === 0) {
                        tbody.append(pending_trap_tr(trap));
                    }
                    if (pending_traps.indexOf(trap.trap_serial_number) === -1) {
                        console.log('push', pending_traps);
                        pending_traps.push(trap.trap_serial_number);
                    }
                    set_pending_interval();
                    hide_unhide_pending_col();

                });
            }

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

}

function set_pending_interval() {
    if (pending_traps.length > 0) {
        clearInterval(pending_interval);
        pending_interval = setInterval(get_pending_traps, 1000);
    } else {
        clearInterval(pending_interval);
        pending_interval = setInterval(get_pending_traps, 3000);
    }
}

function hide_unhide_pending_col() {
    console.log("hide_unhide_pending_col", pending_traps.length);
    if (pending_traps.length > 0) {
        console.log('show');
        $(`#pending_trap_col`).attr('hidden', false);
    } else {
        console.log('hide');
        $(`#pending_trap_col`).attr('hidden', true);

    }

}

$(document).ready(function () {
    get_hubs_status();
    setInterval(get_hubs_status, 5000);
    console.log('pending_traps', pending_traps.length);
    get_pending_traps();
    console.log('pending_traps', pending_traps.length);
    set_pending_interval();
    hide_unhide_pending_col();

    var choices_trap = new Choices("#trap", {
        searchEnabled: !1
    });
    var choices_trap_hub = new Choices("#trap_hub", {
        searchEnabled: !1
    });
    var choices_hub = new Choices("#hub", {
        searchEnabled: !1
    });
    $('#btn-save-hub').on('click', function () {
        installHub();
    });
    $('#btn-save-trap').on('click', function () {
        installTrap();
    });
    trap_dt = new DataTable("#traps_table", {
        columnDefs: [
            {
                targets: [4, 5, 6, 7, 11],
                visible: false,
                searchable: false
            },
        ],
        "ordering": true,
        "sorting": [10, 'desc'],
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("trap per page")}`,
            "zeroRecords": `${gettext("The table is empty")}`,
            "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
            "infoEmpty": `${gettext("No records available")}`,
            "infoFiltered": gettext("(filtered from _MAX_ total records)"),
            "search": `${gettext("Search")}:`,
            "paginate": {
                "previous": `${gettext("Back")}`,
                "next": `${gettext("Forward")}`,
            }
        },

    });
});
$(document).ready(function () {
    hub_dt = new DataTable("#hubs_table", {
        "ordering": true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("hub per page")}`,
            "zeroRecords": `${gettext("The table is empty")}`,
            "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
            "infoEmpty": `${gettext("No records available")}`,
            "infoFiltered": gettext("(filtered from _MAX_ total records)"),
            "search": `${gettext("Search")}:`,
            "paginate": {
                "previous": `${gettext("Back")}`,
                "next": `${gettext("Forward")}`,
            }
        }
    });
});

