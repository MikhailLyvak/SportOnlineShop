"use strict"
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


function delete_company(company_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'company_id': company_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: 'delete-company',
        data: data,
        success: function (data) {
            console.log("#remove_"+company_id);
            $("#remove_"+company_id).modal('hide');
            $("#accordionborderedExample"+company_id).remove();
        },
        dataType: 'json',
    });
}

function delete_employee(employee_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'employee_id': employee_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: 'delete_employee',
        data: data,
        success: function (data) {
            console.log("#remove_"+employee_id);
            $("#remove_"+employee_id).modal('hide');
            $("#employee_"+employee_id).remove();
        },
        dataType: 'json',
    });
}

function delete_object(object_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'object_id': object_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: 'delete_object',
        data: data,
        success: function (data) {
            console.log(data)
            $("#remove_object_"+object_id).modal('hide');
            $("#object_"+object_id).remove();
        },
        dataType: 'json',
    });
}

function delete_service_company(company_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'company_id': company_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: 'delete_company',
        data: data,
        success: function (data) {
            console.log("#remove_"+company_id);
            $("#remove_"+company_id).modal('hide');
            $("#company_"+company_id+"_card").remove();
        },
        dataType: 'json',
    });
}


$(document).ready(function() {

  let dt = new DataTable("#pest_reg_table", {
        "ordering":  true,
        "footerCallback": false,
        "info": false,
    });
});

$(document).ready(function() {
  new DataTable("#customerTable", {
        "ordering":  true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("Objects per page")}`,
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
$(document).ready(function() {
  new DataTable("#customerTable1", {
        "ordering":  true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("Objects per page")}`,
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
$(document).ready(function() {
  new DataTable("#customerTable2", {
        "ordering":  true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("Objects per page")}`,
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