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


function create_ooorsho(object_id, object_slug, inspector_name) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'object_id': object_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: object_slug+'/create_ooorsho',
        data: data,
        inspector_name: inspector_name,
        success: function (data) {
            console.log(data)
            if(data.status ==='ok'){
                if(data.data){
                    $("#list_ooorsho").append(`<tr class="clickable-row" data-href="/ooorsho/${data.data.ooorsho_id}">\n` +
                        `<td><a href='/ooorsho/${data.data.ooorsho_id}'>${data.data.ooorsho_version}</a></td>\n` +
                        "<td>"+data['data']['ooorsho_date']+"</td>\n" +
                        "<td>"+inspector_name+"</td>\n" +
                        `<td class='text-warning text-uppercase'>${gettext("Not approved")}</td>\n` +
                        "</tr>");
                }
            }else if(data.status === 'error'){
                notify(gettext('Preliminary version of the OORAOHO, not yet approved'), 'alert-danger');
            }
        },
        dataType: 'json',
    });
}

function create_technical_task(object_id, object_slug) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'object_id': object_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: object_slug+'/create_technical_task',
        data: data,
        success: function (data) {
            console.log(data)
            if(data['status']==='ok'){
                let host_url = new URL($(location).prop('href'));
                console.log(host_url.protocol + "//" + host_url.host + "/technical-tasks/update/" + data['data'].slug);
                $(location).prop('href', host_url.protocol + "//" + host_url.host + "/technical-tasks/update/" + data['data']['technical_task_slug']);
            }
        },
        dataType: 'json',
    });
}

// $(document).ready(function() {
//   trap_dt = new DataTable("#ooorsho_table", {
//         "ordering":  false,
//         "footerCallback": false,
//         "info": false,
//         "paging": true,
//         "searching": false,
// })});