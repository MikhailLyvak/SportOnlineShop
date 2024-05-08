function newUrl(order_by) {
    return `/api/trap_hourly_signals/${trapSerialNumber}/?ordering=${order_by}&page=1`;
}


document.addEventListener("DOMContentLoaded", function () {
    let currentPage = 1;
    let orderBy = '-date_time';
    let currentUrl = newUrl(orderBy)
    let nextUrl = null;
    let prevUrl = null;
    const orderFields = ['date_time', 'rssi', 'snr', 'battery_percentage', 'caught_pests'];

    function formatDate(dateString) {
        let date = new Date(dateString);
        let formattedDate = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
        let formattedTime = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
        return { date: formattedDate, time: formattedTime };
    }

    function resetStyles() {
        orderFields.forEach(field => {
            var iconUpElement = document.getElementById(`${field}_up`);
            var iconDownElement = document.getElementById(`${field}_down`);
            var thElement = document.getElementById(field);
    
            iconUpElement.className = "ri-arrow-up-s-fill fs-11 text-muted";
            iconDownElement.className = "ri-arrow-down-s-fill fs-11 text-muted";
            thElement.style.backgroundColor = '';
        });
    }

    function mlAddIcon(order_by) {
        resetStyles();

        var iconUpElement = document.getElementById(`${order_by}_up`);
        var iconDownElement = document.getElementById(`${order_by}_down`);
        var thElement = document.getElementById(order_by);

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

    function updateTable(url) {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function (data) {
            var tableBody = document.getElementById('hourly_table_body');
            tableBody.innerHTML = '';
    
            for (var i = 0; i < data.results.length; i++) {
                var formattedDateTime = formatDate(data.results[i].date_time);
                var row = '<tr>' +
                    '<td>' + formattedDateTime.date + '</td>' +
                    '<td>' + formattedDateTime.time + '</td>' +
                    '<td>' + data.results[i].msg_token + '</td>' +
                    '<td>' + data.results[i].rssi + '</td>' +
                    '<td>' + data.results[i].snr + '</td>' +
                    '<td>' + data.results[i].battery_percentage + '</td>' +
                    '<td>' + data.results[i].caught_pests + '</td>' +
                    '</tr>';
                tableBody.insertAdjacentHTML('beforeend', row);
            }
            nextUrl = data.next;
            prevUrl = data.previous;
    
            
            document.getElementById('page_number').textContent = currentPage + '/' + Math.ceil(data.count / data.results.length);
    
        })
        .catch(function (error) {
            console.log('Error fetching data:', error);
        })
        .finally(function() {
            updatePaginationButtons();
        });
    }

    function updatePaginationButtons() {
        var nextButton = document.getElementById('next_button');
        var prevButton = document.getElementById('prev_button');
        document.getElementById('next_button').innerHTML = 'Next<i class="mdi mdi-chevron-right"></i>';
        document.getElementById('prev_button').innerHTML = '<i class="mdi mdi-chevron-left"></i>Previous';
        nextButton.classList.remove('disabled');
        prevButton.classList.remove('disabled');
        if (!nextUrl) {
            nextButton.classList.add('disabled');
        }
        if (!prevUrl) {
            prevButton.classList.add('disabled');
        }
      }


    updateTable(currentUrl);

    document.getElementById('next_button').addEventListener('click', function () {
        var nextButton = document.getElementById('next_button');
        var prevButton = document.getElementById('prev_button');
        currentPage++;
        nextButton.classList.add('disabled');
        this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
        prevButton.classList.add('disabled');
        updateTable(nextUrl);
    });

    document.getElementById('prev_button').addEventListener('click', function () {
        var nextButton = document.getElementById('next_button');
        var prevButton = document.getElementById('prev_button');
        currentPage--;
        prevButton.classList.add('disabled');
        this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
        nextButton.classList.add('disabled')
        updateTable(prevUrl);
    });

    
    document.getElementById("date_time").addEventListener('click', function () {
        orderBy = (orderBy === "date_time") ? "-date_time" : "date_time";
        currentPage = 1;

        mlAddIcon("date_time")

        updateTable(newUrl(orderBy));
    });

    document.getElementById("rssi").addEventListener('click', function () {
        orderBy = (orderBy === "rssi") ? "-rssi" : "rssi";
        currentPage = 1;

        mlAddIcon("rssi")
        
        updateTable(newUrl(orderBy));
    });

    document.getElementById("snr").addEventListener('click', function () {
        orderBy = (orderBy === "snr") ? "-snr" : "snr";
        currentPage = 1;

        mlAddIcon("snr")

        updateTable(newUrl(orderBy));
    });

    document.getElementById("battery_percentage").addEventListener('click', function () {
        orderBy = (orderBy === "battery_percentage") ? "-battery_percentage" : "battery_percentage";
        currentPage = 1;

        mlAddIcon("battery_percentage")

        updateTable(newUrl(orderBy));
    });

    document.getElementById("caught_pests").addEventListener('click', function () {
        orderBy = (orderBy === "caught_pests") ? "-caught_pests" : "caught_pests";
        currentPage = 1;

        mlAddIcon("caught_pests")

        updateTable(newUrl(orderBy));
    });

    
    
});
