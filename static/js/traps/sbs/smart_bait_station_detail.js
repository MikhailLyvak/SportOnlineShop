const slug = window.location.pathname.split('/').pop();

function fill_sbs_info(data) {
    let work_time = document.getElementById('work_time');
    work_time.classList.remove('placeholder');
    work_time.innerText = data.work_time;
    let board_serial_number = document.getElementById('board_serial_number');
    board_serial_number.classList.remove('placeholder');
    board_serial_number.innerText = data.serial_number;
    let bc_serial_number = document.getElementById('bc_serial_number');
    bc_serial_number.classList.remove('placeholder');
    bc_serial_number.innerText = `(${data.serial_number})`;

    let board_trap_type = document.getElementById('board_trap_type');
    board_trap_type.classList.remove('placeholder');
    board_trap_type.innerText = data.model.trap_type;
    let board_sequence_number = document.getElementById('board_sequence_number');
    board_sequence_number.classList.remove('placeholder');
    board_sequence_number.innerText = data.sequence_number;
    let board_date_of_installation = document.getElementById('board_date_of_installation');
    board_date_of_installation.classList.remove('placeholder');
    board_date_of_installation.innerText = data.date_of_installation;
    let main_sequence_number = document.getElementById('main_sequence_number');
    main_sequence_number.classList.remove('placeholder');
    main_sequence_number.innerText = `№ ${data.sequence_number}`;
    let bc_sequence_number = document.getElementById('bc_sequence_number');
    bc_sequence_number.classList.remove('placeholder');
    bc_sequence_number.innerText = `№ ${data.sequence_number}`;
    let bait_filling_board = document.getElementById('bait_filling_board');
    bait_filling_board.classList.remove('placeholder');
    bait_filling_board.innerText = data.bait_filling;
}


function get_sbs_info(slug) {
    fetch(`/api/v1/smart-bait-station/${slug}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            fill_sbs_info(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    get_sbs_info(slug);
});
