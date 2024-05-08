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

function delete_user(user_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'user_id': user_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: 'delete',
        data: data,
        success: function (data) {
            $("#remove_"+user_id).modal('hide');
            $("#user_"+user_id).remove();
        },
        dataType: 'json',
    });
}

$(document).ready(function() {
  new DataTable("#users_table", {
        "ordering":  true,
        "footerCallback": false,
        "info": false,
        "language": {
            "lengthMenu": `_MENU_ ${gettext("Users per page")}`,
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
