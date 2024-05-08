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

const month_select = {
    0: gettext('January'),
    1: gettext('February'),
    2: gettext('March'),
    3: gettext('April'),
    4: gettext('May'),
    5: gettext('June'),
    6: gettext('July'),
    7: gettext('August'),
    8: gettext('September'),
    9: gettext('October'),
    10: gettext('November'),
    11: gettext('December'),
};
let monitoring_tbody = document.getElementById("monitoring_table").getElementsByTagName("tbody")[0];
let monitoring_thead = document.getElementById("monitoring_table").getElementsByTagName("thead")[0];

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  let day = '';
  if(date.getDate() < 10) {
        day = date.getDate().toString().padStart(2, '0');
    } else {
        day = date.getDate().toString();
  }
  return `${year}-${month}-${day}`;
}

function getFirstAndLastDateOfPreviousMonth() {
  const today = new Date();
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfPreviousMonth = new Date(firstDayOfThisMonth);
  lastDayOfPreviousMonth.setDate(0);

  const firstDate = formatDate(new Date(lastDayOfPreviousMonth.getFullYear(), lastDayOfPreviousMonth.getMonth(), 1));
  const lastDate = formatDate(lastDayOfPreviousMonth);

  return { firstDate, lastDate };
}

function create_monitoring_report_td(rowspan, data, ml_link = null) {
    const td = document.createElement("td");
    td.classList.add("text-center");
    if (rowspan > 0) {
        td.setAttribute("rowspan", rowspan);
    }
    if (ml_link !== null) {
        td.innerHTML = ml_link;
    } else { td.textContent = data; }
    
    return td;
}

function create_monitoring_report_plan_btn(plan_url, plan_title) {
    const a = document.createElement("a");
    a.classList.add("btn", "d-grid", "btn-sm", "btn-soft-primary", "btn-label", "waves-effect", "waves-light", "rounded-pill", "mx-2");
    a.setAttribute("href", plan_url);

    const i = document.createElement("i");
    i.classList.add("ri-treasure-map-line", "label-icon", "align-middle", "rounded-pill", "fs-16", "me-2");
    a.text = plan_title;
    a.appendChild(i);
    // a.textContent = plan_title;
    return a;
}

function parse_monitoring_report(data) {
    console.log(data);
    monitoring_tbody.innerHTML = '';
    monitoring_tbody.classList.add("align-middle");
    for (let trap in data) {
        let trapRow = document.createElement("tr");
        trapRow.classList.add("align-middle");

        let signal_count = 0;
        let place_point_td = '';

        for (let place_point in data[trap].place_points) {

            for (let signals in data[trap].place_points[place_point].activation_signals) {
                signal_count += data[trap].place_points[place_point].activation_signals[signals].length;
            }
        }

        let trapUrl = `<a class="btn d-grid btn-sm btn-soft-primary btn-label waves-effect waves-light rounded-pill" target="_blank" href="/trap/info/${data[trap].serial_number.toLowerCase()}">
                                <i class="ri-eye-line label-icon align-middle rounded-pill fs-16 me-2"></i>${data[trap].sequence_number}
                               </a>`
        let trap_td = create_monitoring_report_td(signal_count, data[trap].serial_number, trapUrl);
        trap_td.classList.add("align-middle");
        // trap_td.attr("style", `min-width: 30px;`)
        trap_td.setAttribute("style", `min-width: 50px;`)
        let trap_type_td = create_monitoring_report_td(signal_count, data[trap].model);
        let trap_serial_number_td = create_monitoring_report_td(signal_count, data[trap].serial_number);

        trap_td.setAttribute("id", `trap_${data[trap].sequence_number}`);
        trap_type_td.setAttribute("id", `trap_type_${data[trap].sequence_number}`);
        trap_serial_number_td.setAttribute("id", `trap_serial_number_${data[trap].sequence_number}`);

        trapRow.appendChild(trap_td);
        trapRow.appendChild(trap_type_td);
        trapRow.appendChild(trap_serial_number_td);
        // trapRow.get

        for (let place_point in data[trap].place_points) {
            let signal_place_count = 0;
            console.log(data[trap].place_points[place_point])
            for (let signals in data[trap].place_points[place_point].activation_signals) {
                signal_place_count += data[trap].place_points[place_point].activation_signals[signals].length;
            }

            let date_mounted = create_monitoring_report_td(signal_place_count, data[trap].place_points[place_point].date_mounted);
            let date_unmounted;
            if (data[trap].place_points[place_point].date_unmounted ===  0) {
               date_unmounted = create_monitoring_report_td(signal_place_count, '-');
            }else{
               date_unmounted = create_monitoring_report_td(signal_place_count, data[trap].place_points[place_point].date_unmounted);
            }

            let place_point_btn = create_monitoring_report_td(signal_place_count, '');
            let place_point_url = `/object/plan/trap/${data[trap].place_points[place_point].floor_plan_object_slug}/${data[trap].place_points[place_point].floor_plan_slug}/${data[trap].slug}`;

            place_point_btn.appendChild(create_monitoring_report_plan_btn(place_point_url, data[trap].place_points[place_point].floor_plan_title));

            if (place_point === '0') {
                console.log(place_point)
                trapRow.appendChild(date_mounted);
                trapRow.appendChild(date_unmounted);
                trapRow.appendChild(place_point_btn);

                let first_signals = true;
                // console.log(Object.keys(data[trap].place_points[place_point].activation_signals));
                if (Object.keys(data[trap].place_points[place_point].activation_signals).length === 0) {
                    signal_count += 1;
                    trap_td.setAttribute("rowspan", signal_count);
                    trap_type_td.setAttribute("rowspan", signal_count);
                    trap_serial_number_td.setAttribute("rowspan", signal_count);

                    trapRow.appendChild(create_monitoring_report_td(0, '----'));
                    trapRow.appendChild(create_monitoring_report_td(0, '----'));
                    trapRow.appendChild(create_monitoring_report_td(0, '----'));
                    monitoring_tbody.appendChild(trapRow);
                }
                for (let signals in data[trap].place_points[place_point].activation_signals) {
                    let signal_date = create_monitoring_report_td(data[trap].place_points[place_point].activation_signals[signals].length, signals);
                    if (first_signals) {
                        trapRow.appendChild(signal_date);
                        let first_signal = true;

                        for (let signal in data[trap].place_points[place_point].activation_signals[signals]) {
                            if (first_signal) {
                                trapRow.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                trapRow.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(trapRow);
                                first_signal = false;
                            } else {
                                let singleRow = document.createElement("tr");
                                singleRow.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                singleRow.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(singleRow);
                            }
                            first_signals = false;
                        }
                    } else {
                        let single_signals_row = document.createElement("tr");
                        single_signals_row.appendChild(signal_date);
                        let first_signal = true;
                        for (let signal in data[trap].place_points[place_point].activation_signals[signals]) {
                            if (first_signal) {
                                single_signals_row.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                single_signals_row.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(single_signals_row);
                                first_signal = false;
                            } else {
                                let singleRow = document.createElement("tr");
                                singleRow.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                singleRow.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(singleRow);
                            }
                        }
                    }
                }
            } else {
                console.log(place_point)
                let single_place_row = document.createElement("tr");
                single_place_row.appendChild(date_mounted);
                single_place_row.appendChild(date_unmounted);
                single_place_row.appendChild(place_point_btn);

                if (Object.keys(data[trap].place_points[place_point].activation_signals).length === 0) {
                    signal_count += 1;
                    trap_td.setAttribute("rowspan", signal_count);
                    trap_type_td.setAttribute("rowspan", signal_count);
                    trap_serial_number_td.setAttribute("rowspan", signal_count);

                    single_place_row.appendChild(create_monitoring_report_td(0, '----'));
                    single_place_row.appendChild(create_monitoring_report_td(0, '----'));
                    single_place_row.appendChild(create_monitoring_report_td(0, '----'));
                    monitoring_tbody.appendChild(single_place_row);
                }

                let first_signals = true;
                for (let signals in data[trap].place_points[place_point].activation_signals) {
                    let signal_date = create_monitoring_report_td(data[trap].place_points[place_point].activation_signals[signals].length, signals);
                    if (first_signals) {
                        single_place_row.appendChild(signal_date);
                        let first_signal = true;

                        for (let signal in data[trap].place_points[place_point].activation_signals[signals]) {
                            if (first_signal) {
                                single_place_row.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                single_place_row.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(single_place_row);
                                first_signal = false;
                            } else {
                                let singleRow = document.createElement("tr");
                                singleRow.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                singleRow.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(singleRow);
                            }
                            first_signals = false;
                        }
                    } else {
                        let single_signals_row = document.createElement("tr");
                        single_signals_row.appendChild(signal_date);
                        let first_signal = true;
                        for (let signal in data[trap].place_points[place_point].activation_signals[signals]) {
                            if (first_signal) {
                                single_signals_row.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                single_signals_row.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(single_signals_row);
                                first_signal = false;
                            } else {
                                let singleRow = document.createElement("tr");
                                singleRow.appendChild(create_monitoring_report_td(0, data[trap].place_points[place_point].activation_signals[signals][signal].date_time.split(' ')[1]));
                                singleRow.appendChild(create_monitoring_report_td(0, '1'));
                                monitoring_tbody.appendChild(singleRow);
                            }
                            console.log(single_signals_row)
                        }
                    }
                }
            }
        }
    }
}

function get_monitoring_data(date_from, date_to) {
    showLoader();
    console.log(date_from, date_to);
    const csrftoken = getCookie('csrftoken');
    let data = {
        date_from: date_from,
        date_to: date_to,
    };
    const url = `${company_object_slug}/get-monitoring-data`;

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
            hideLoader();
            parse_monitoring_report(responseData.data);
            return responseData;
        })
        .catch(error => {
            hideLoader();
            console.error('Error:', error);
        });
}

function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'block';
    }
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function create_monitoring_report() {
    let start_date = document.getElementById('start_date').value;
    let end_date = document.getElementById('end_date').value;
    console.log(start_date, end_date);
    if (start_date === '' || end_date === '') {
        return;
    }

    let monitoring_data = get_monitoring_data(start_date, end_date);
    console.log(monitoring_data);
}

function create_vulnerability_dt() {
    let dt = new DataTable("#vul_table", {
        "ordering": true,
        "footerCallback": false,
        "info": false,
    });
}


function create_visit_dt() {
        let dt = new DataTable("#visit_table", {
            "ordering": true,
            "footerCallback": false,
            "info": false,
            "searching": false,
            "dom": 'rtip'
        });
    }


function create_visit_report_dt() {
        let dt = new DataTable("#visit_report_docs_table", {
            "ordering": true,
            "footerCallback": false,
            "info": false,
            "searching": false,
            "dom": 'rtip'
        });
    }


function create_visit_full_dt() {
        let dt = new DataTable("#visit_full_table", {
            "ordering": true,
            "footerCallback": false,
            "info": false,
            "searching": false,
            "dom": 'rtip'
        });
    }




$(document).ready(function () {

    const currentDateTime = new Date();
    const currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate());
    const firstDayOfMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 1);
    let formattedCurrentDate = formatDate(currentDate);
    let formattedFirstDayOfMonth = formatDate(firstDayOfMonth);

    $("#last_month_btn").text(month_select[currentDateTime.getMonth()-1]);
    $("#current_month_btn").text(month_select[currentDateTime.getMonth()]);


    let pest_monitoring_table = new DataTable("#pest_monitoring_table", {
        // "ordering":  true,
        "footerCallback": false,
        "info": false,
    });
    $("#create_monitoring_btn").on("click", create_monitoring_report);
    $("#last_month_btn").on("click", function () {
        const { firstDate, lastDate } = getFirstAndLastDateOfPreviousMonth();
        get_monitoring_data(firstDate, lastDate);

    });
    $("#current_month_btn").on("click", function () {
        const { firstDate, lastDate } = getFirstAndLastDateOfPreviousMonth();
        get_monitoring_data(formattedFirstDayOfMonth, formattedCurrentDate);

    });
    get_monitoring_data(formattedFirstDayOfMonth, formattedCurrentDate);

});



document.addEventListener('DOMContentLoaded', function () {
    var vulnerabilities_category = new Choices("#vulnerabilities_category", {
        searchEnabled: !1
    });
    var vulnerabilities_criticality = new Choices("#vulnerabilities_criticality", {
        searchEnabled: !1
    });
    var vulnerabilities_service = new Choices("#vulnerabilities_service", {
        searchEnabled: !1
    });
    var vulnerabilities_pest = new Choices("#vulnerabilities_pest", {
        searchEnabled: !1
    });
    var vulnerabilities_zone = new Choices("#vulnerabilities_zone", {
        searchEnabled: !1
    });
    var vulnerabilities_inspector = new Choices("#vulnerabilities_inspector", {
        searchEnabled: !1
    });

});