const proTrapPrice = 18;
const proMonthlyPrice = 2;

let proTrapAmount = document.getElementById("pro-trap-amount").value;
let proMonthLenght = document.getElementById("pro-month-lenght").value;
let proAmount = document.getElementById("pro-amount").value;
const proTrapModel = "trap";
const tariffType = "pro";

function calculatePro() {
    preResult = Math.ceil(proTrapAmount * proTrapPrice + (proMonthLenght * proMonthlyPrice) * proTrapAmount, 2)
    proAmount = preResult.toFixed(2);
    document.getElementById("pro-amount").value = proAmount;

    // Make an AJAX request to get the URL
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/finances/get-invoice-url/?proAmount=${proAmount}&trapModel=${proTrapModel}&trapAmount=${proTrapAmount}&monthAmount=${proMonthLenght}&tariffType=${tariffType}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const url = xhr.responseText;
            document.getElementById("go-link").href = url;
        }
    };

    xhr.send();
}

function minusTrap() {
    if (proTrapAmount > 1) {
        proTrapAmount--;
        document.getElementById("pro-trap-amount").value = proTrapAmount;
    }
    calculatePro();
}

function plusTrap() {
    proTrapAmount++;
    document.getElementById("pro-trap-amount").value = proTrapAmount;
    calculatePro();
}

function minusMonth() {
    if (proMonthLenght > 1) {
        proMonthLenght--;
        document.getElementById("pro-month-lenght").value = proMonthLenght;
    }
    calculatePro();
}

function plusMonth() {
    proMonthLenght++;
    document.getElementById("pro-month-lenght").value = proMonthLenght;
    calculatePro();
}


