let sbs_dt;

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

function build_tr(item){
    let html_tr = `<tr>
        <td class="text-center m-1">
            ${formatDateTime(item.date_time)}
        </td>
        <td class="text-center m-1">
            ${formatDateTime(item.crm_date_time)}
        </td>
        <td class="text-center m-1">
            ${item.msg_token}
        </td>
        <td class="text-center m-1">
            ${item.bait_filling}
        </td>
        <td class="text-center m-1">
            ${item.rssi}
        </td>
        <td class="text-center m-1">
            ${item.snr}
        </td>
        <td class="text-center m-1">
            ${item.battery_percentage}
        </td>
    </tr>`;
    return html_tr;
}

function get_period_monitoring_data(){
    fetch(`/api/v1/smart-bait-station/${slug}/period-signals`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            fill_period_monitoring_table(data);
            if(sbs_dt){
                sbs_dt.destroy();
            }
            sbs_dt = new DataTable("#bait_period_table", {
                "ordering": false,
                "sorting": false,
                "footerCallback": false,
                "info": false,
                "language": {
                    "lengthMenu": `_MENU_ ${gettext("Signals per page")}`,
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

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function fill_period_monitoring_table(data){
    let table_spiner = document.getElementById('table_spiner');
    table_spiner.remove();
    let tbody = document.getElementById('bait_period_tbody');
    tbody.innerHTML = '';
    data.forEach((item, index) => {
        tbody.innerHTML += build_tr(item);

    });
    chart_init(data);
}

document.addEventListener("DOMContentLoaded", function () {
    get_period_monitoring_data();
    // sbs_dt = new DataTable("#bait_period_table", {
    //     "ordering": true,
    //     "sorting": [1, 'desc'],
    //     "footerCallback": false,
    //     "info": false,
    //     "language": {
    //         "lengthMenu": `_MENU_ ${gettext("Signals per page")}`,
    //         "zeroRecords": `${gettext("The table is empty")}`,
    //         "info": `${gettext("Page")} _PAGE_ from _PAGES_`,
    //         "infoEmpty": `${gettext("No records available")}`,
    //         "infoFiltered": gettext("(filtered from _MAX_ total records)"),
    //         "search": `${gettext("Search")}:`,
    //         "paginate": {
    //             "previous": `${gettext("Back")}`,
    //             "next": `${gettext("Forward")}`,
    //         }
    //     },
    //
    // });
});