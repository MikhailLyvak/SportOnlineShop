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

function notify(message, type) {
    let msg_color;
    if (type == 'alert-danger') {
        msg_color = '#F06548';
    } else {
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

function change_language(lang_code) {
    const csrftoken = getCookie('csrftoken');

    const url = `/i18n/setlang/`;
    fetch(
        url,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-CSRFToken": csrftoken
            },
            body: `language=${lang_code}`
        }
    ).then(response => {
            if (response.status === 200) {
                window.location.reload();
            } else {
                console.error("Error when changing the language.");
            }
        });
}
$(window).on('load',function(){
    $(".clickable-row").click(function() {
        window.location = $(this).data("href");
    });

    for (const mess in messages) {
        if(messages[mess][1] == 'error'){
            messages[mess][1] = 'danger';
        }
        notify(messages[mess][0], messages[mess][1]);
    }

});