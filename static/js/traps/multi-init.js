let multi_var = null;

function multi_init(select_tag){
    var select = document.getElementById(select_tag);
    console.log(select);
    multi_var = $(`#${select_tag}`).multi(select, {
        enable_search: false
    });
    var pc_select_choices = new Choices("#pc_select", {
                searchEnabled: 1
            });
    }
document.addEventListener("DOMContentLoaded", function() {
    console.log('onload');
    multi_init('multiselect_trap');
    multi_init('multiselect_hub');
    $('#move_trap_btn').on('click', function(){
        console.log('click');
        let selected = $('#multiselect_trap').val();
        console.log(selected);
        let pc = $('#pc_select').val();
        console.log(pc);
        if(selected.length === 0){
            notify(gettext('Please select at least one trap'), 'alert-danger');
            return;
        }
        if(pc.length === 0){
            notify(gettext('Please select a service provider company'), 'alert-danger');
            return;
        }
        const csrftoken = getCookie('csrftoken');
        const url = `/trap/move-trap`;
        const data = {
            'selected': selected,
            'pc': pc
        };
        fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(data),
            }
        )
            .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
            .then(responseData => {
                console.log(responseData);
                let data = responseData.data;
                if(responseData.status === 'success'){
                    for(let i = 0; i < selected.length; i++){
                        console.log(`trap_${selected[i]}`);
                        $(`#trap_${selected[i]}`).remove();
                        $(`#option_trap_${selected[i]}`).remove();
                    }
                    $('#add_mct_to_pest_company').modal('hide');
                    $(".multi-wrapper").remove();
                    $('#multiselect_trap').removeAttr("data-multijs");
                    $('#multiselect_trap').multi();
                    multi_init('multiselect_trap');
                    notify(gettext('Traps moved successfully'), 'alert-success');

                }else if(data.status === 'error'){
                    notify(gettext('Error'), 'alert-danger');
                }

            })
            .catch(error => {
                        console.error('Error:', error);
                    });
    });
    $('#move_hub_btn').on('click', function(){
        console.log('click');
        let selected = $('#multiselect_hub').val();
        console.log(selected);
        let pc = $('#pc_select_hub').val();
        console.log(pc);
        if(selected.length === 0){
            notify(gettext('Please select at least one hub'), 'alert-danger');
            return;
        }
        if(pc.length === 0){
            notify(gettext('Please select a service provider company'), 'alert-danger');
            return;
        }
        const csrftoken = getCookie('csrftoken');
        const url = `/hub/move-hub`;
        const data = {
            'selected': selected,
            'pc': pc
        };
        fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify(data),
            }
        )
            .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
            .then(responseData => {
                console.log(responseData);
                let data = responseData.data;
                if(responseData.status === 'success'){
                    for(let i = 0; i < selected.length; i++){
                        console.log(`hub_${selected[i]}`);
                        $(`#hub_${selected[i]}`).remove();
                        $(`#option_hub_${selected[i]}`).remove();
                    }
                    $('#add_hub_to_pest_company').modal('hide');
                    $(".multi-wrapper").remove();
                    $('#multiselect_hub').removeAttr("data-multijs");
                    $('#multiselect_hub').multi();
                    multi_init('multiselect_hub');
                    notify(gettext('Hubs moved successfully'), 'alert-success');

                }else if(data.status === 'error'){
                    notify(gettext('Error'), 'alert-danger');
                }

            })
            .catch(error => {
                        console.error('Error:', error);
                    });
    });
});