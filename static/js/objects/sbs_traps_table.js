const order_fields = {
    sequence_number: 'sbs_sequence_number',
    bait_filling: 'sbs_bait_filling',
};

let sbs_trap_dt;

function formatDateTime(datetimeString) {
    const dateTime = new Date(datetimeString);

    const hours = dateTime.getHours();
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getSeconds()).slice(-2);

    const day = ('0' + dateTime.getDate()).slice(-2);
    const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
    const year = dateTime.getFullYear();

    const formattedDateTime = `${hours}:${minutes}:${seconds} ${day}-${month}-${year}`;
    return formattedDateTime;
}

function sbsTrapsUrl(order_by, slug) {
    return `/api/object/traps/sbs/${slug}?ordering=${order_by}&page=1`;
}


function build_table_tr(trap) {
    return `
    <tr>
      <td class="text-center">${getSbsTrapBaitFilling(trap.last_connection, trap.battery_percentage)}</td>
      <td class="text-center">${getTrapDetailButton(trap.slug, trap.sequence_number)}</td>
      <td class="text-center">${trap.floor_number !== null ? getTrapPlanButton(slug, trap) : getTrapSetPlanButton(slug, trap)}</td>
      <td class="text-center">${getAction(trap.slug, trap.id)}</td>
      <td class="text-center">${trap.model.trap_type.toUpperCase()}</td>
      <td class="text-center">${trap.serial_number}</td>
      <td class="text-center">${trap.model.sensor}.${trap.model.type}.${trap.model.controller}.${trap.model.communication_controller}.${trap.model.power_type}</td>
      <td class="text-center">${trap.hub ? trap.hub.sequence_number : '-'}</td>
      <td class="text-center">${trap.last_connection ? formatDateTime(trap.last_connection.crm_date_time) : "----"}</td>
      <td class="text-center">${trap.last_connection ? trap.last_connection.rssi : "----"}</td>
      <td class="text-center">${trap.date_of_installation}</td>
    </tr>
  `;
}

function resetStyles() {
    orderFields.forEach(field => {
        var iconUpElement = document.getElementById(`${field}_up`);
        var iconDownElement = document.getElementById(`${field}_down`);
        var thElement = document.getElementById(`${field}_api`);

        iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
        iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
        thElement.style.backgroundColor = '';
    });
}

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let orderBy = order_fields.sequence_number;
    let currentUrl = sbsTrapsUrl(orderBy, slug);
    let nextUrl = null;
    let prevUrl = null;
    const orderFields = ['sbs_sequence_number', 'sbs_bait_filling',];


    function mlAddIcon(order_by) {
        resetStyles();

        var iconUpElement = document.getElementById(`${order_by}_up`);
        var iconDownElement = document.getElementById(`${order_by}_down`);
        var thElement = document.getElementById(`${order_by}_api`);

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

    function updateBaitTable(url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // const tableBody = document.getElementById('sbs_table_api').getElementsByTagName('tbody')[0];
                let sbs_tbody = document.getElementById('sbs_tbody');
                // tableBody.innerHTML = '';
                console.log(data);
                // Loop through the data and create rows
                data.results.forEach(item => {
                    sbs_tbody.innerHTML += build_table_tr(item);

                });
                sbs_trap_dt ? sbs_trap_dt.destroy() : null;
                sbs_trap_dt = new DataTable("#sbs_table_api", {
                    "ordering": true,
                    "footerCallback": false,
                    "info": false,
                    "language": {
                        "lengthMenu": `_MENU_ ${gettext("Bait station per page")}`,
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

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });


    };


    updateBaitTable(currentUrl);


});


function getTrapDetailButton(trap_slug, trap_number) {
    return `
      <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill"
          href="/smart-bait-trap/info/${trap_slug}" type="button">
        <i class="ri-eye-line label-icon align-middle rounded-pill fs-16 me-2"></i>${trap_number}
      </a>
    `
}


function getTrapPlanButton(slug, item) {
    return `
          <a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill"
          href="/object/plan/trap/${slug}/${item.floor_number.slug}/${item.slug}"
          type="button">
        <i class="ri-treasure-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>${item.floor_number.title}
        </a>
      `
};


function getTrapSetPlanButton(slug, item) {
    return `
          <a class="btn d-grid btn-sm btn-soft-warning btn-label waves-effect waves-light rounded-pill"
          href="/object/plan/${slug}/${item.default_plan}"
          type="button">
        <i class="ri-road-map-line label-icon align-middle rounded-pill fs-16 me-2"></i>Позначити на плані
        </a>
      `
};


function getSbsTrapBaitFilling(last_connection, battery) {
    let amount = last_connection ? last_connection.bait_filling : 0;
    let last_connection_date = last_connection ? last_connection.crm_date_time : 0;
    const colour = amount > 20 ? 'success' : (amount < 5 ? 'danger' : 'warning');

    const blink_battery = battery < 30;
    const battery_title = blink_battery ? gettext("Battery is low") : gettext("Battery is normal");
    const battery_color = blink_battery ? 'danger' : (battery < 50 ? 'warning' : 'success');
    const battery_style = battery < 50 ? 'low-line' : 'fill';


    const online = last_connection ? (new Date() - new Date(last_connection_date)) / (1000 * 60) < 65 : false;
    const status_title = online ? gettext("Bait station online") : gettext("Bait station offline");
    const status_color = online ? 'success' : 'dark';
    const status_style = online ? '' : '-off';

    console.log(online / (1000 * 60));

    return `
  <button title="${status_title}" type="button"
          class="btn btn-sm btn-ghost-${status_color} btn-rounded custom-toggle active"
          data-bs-toggle="button">
    <span class="icon-on fs-6"><i class="ri-wifi${status_style}-fill align-bottom"></i></span>
    <span class="icon-off fs-6"><i class="ri-wifi${status_style}-fill align-bottom"></i></span>
  </button> 
  <button title="${battery_title}" type="button"
            class="btn btn-sm btn-ghost-${battery_color} btn-rounded custom-toggle active"
            data-bs-toggle="button">
    <span
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${battery_color}">${battery}</span>
      <span class="icon-off fs-6 text-${battery_color} ${blink_battery ? "blink_battery" : ""}"><i
          class="ri-battery-${battery_style} align-bottom "></i></span>
      <span class="icon-on fs-6 text-${battery_color}"><i
          class="ri-battery-${battery_style} align-bottom "></i></span>
    </button>
  <button
      type="button"
      class="btn btn-sm btn-ghost-${colour} btn-rounded custom-toggle active m-1 text-${colour}"
      data-bs-toggle="button"
      title="Bait in trap"
    >
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-${colour}">${amount}</span>
      <span class="icon-on fs-6 text-${colour}"><i class="ri-store-fill align-bottom"></i></span>
      <span class="icon-off fs-6 text-${colour}"><i class="ri-store-fill align-bottom"></i></span>
    </button>
    `;
};


function getAction(trap_slug, id) {
    return `
    <button type="button" class="btn btn-sm btn-ghost-primary btn-icon">
      <a class="remove-item-btn" data-bs-toggle="modal" data-bs-target=".qr_${id}" type="button">
        <i class="ri-qr-code-fill fs-18"></i>
      </a>
    </button>
  `
};
