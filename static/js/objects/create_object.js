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

const regionSelect = document.getElementById('region');
const areaSelect = document.getElementById('area');
const townSelect = document.getElementById('town');
const full_name = document.getElementById('full_name');
const short_name = document.getElementById('short_name');
const street = document.getElementById('street');
const building = document.getElementById('building_no');
const apartment = document.getElementById('apartment_no');
const duration_of_service = document.getElementById('duration_of_service');
const chosen_services = document.getElementById('chosen_services');


regionSelect.addEventListener('change', get_areas);
areaSelect.addEventListener('change', get_towns);

let choices_region = new Choices("#region", {
                searchEnabled: 1,
                noResultsText:  gettext("Unfortunately, there is no such area in the database")
            });

let choices_area = new Choices("#area", {
                searchEnabled: 1,
                noResultsText: gettext("Unfortunately, there is no such area in the database")
            });

let choices_town = new Choices("#town", {
                searchEnabled: 1,
                noResultsText: gettext("Unfortunately, such a city/village is not in the database")
            });

window.onload = function (event) {
    get_regions();
};

function get_regions() {
    const csrftoken = getCookie('csrftoken');
    const url = `/towns/regions`;
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
            regionSelect.innerHTML = '';
            responseData.data.forEach(region => {
                console.log(region);
                choices_region.setValue([region]);
            });
            choices_region.update();

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function get_areas() {
    choices_area.enable();
    const csrftoken = getCookie('csrftoken');
    const url = `/towns/areas`;
    let data = {
        region: regionSelect.value
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
            choices_area.clearStore();
            responseData.data.forEach(area => {
                console.log(area);
                choices_area.setValue([area]);
            });
            choices_area.update();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function get_towns() {
    if (choices_town){
        choices_town.destroy();
    }
    townSelect.innerHTML = '';
    townSelect.disabled = false;
    const csrftoken = getCookie('csrftoken');
    const url = `/towns/towns`;
    let data = {
        region: regionSelect.value,
        area: areaSelect.value
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
            let counter = 0;
            responseData.data.forEach(area => {
                counter++;
                console.log(area);
                // choices_town.setValue([area]);
                const option = document.createElement('option');
                  option.value = area[0];
                  option.textContent = `${area[1]} (${area[2]} ${gettext("District")})`;
                  townSelect.appendChild(option);
                console.log(counter);
            });
            choices_town = new Choices("#town", {
                searchEnabled: 1,
                noResultsText: gettext("Unfortunately, such a city/village is not in the database")
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function save_object(){
    const csrftoken = getCookie('csrftoken');
    const url = `/object/object-save`;
    let data = {
        full_name: full_name.value,
        short_name: short_name.value,
        city: townSelect.value,
        street: street.value,
        building: building.value,
        apartment: apartment.value,
        duration_of_service: duration_of_service.value,
        chosen_services: chosen_services.value,
        company_id: company_id,
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
            if (responseData.status === 'ok'){
                window.location.href = `/object/traps/${responseData.data.slug}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


