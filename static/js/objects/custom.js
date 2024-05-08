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
            $("#remove_object_"+object_id).modal('hide');
            $("#object_"+object_id).remove();
        },
        dataType: 'json',
    });
}

function delete_hub(hub_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'hub_id': hub_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: '/hub/delete',
        data: data,
        success: function (data) {
            $("#remove_"+hub_id).modal('hide');
            $("#hub_"+hub_id).remove();
        },
        dataType: 'json',
    });
}


function delete_trap_from_object(trap_id) {
    const csrftoken = getCookie('csrftoken');
    var data = {
        'trap_id': trap_id,
    };
    $.ajax({
        type: 'POST',
        headers: {'X-CSRFToken': csrftoken},
        url: '/trap/trap_clear_object',
        data: data,
        success: function (data) {
            $("#remove_"+trap_id).modal('hide');
            $("#trap_"+trap_id).remove();
        },
        dataType: 'json',
    });
}

document.addEventListener('DOMContentLoaded', function() {



}, false);