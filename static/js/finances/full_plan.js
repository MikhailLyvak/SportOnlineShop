const fullTrapPrice = 39;
const fullMonthlyPrice = 1;

let fullTrapAmount = document.getElementById("full-trap-amount").value;
let fullMonthLenght = document.getElementById("full-month-lenght").value;
let fullAmount = document.getElementById("full-amount").value;
console.log(fullAmount);
const fullTrapModel = "trap";
const fullTariffType = "full";

function fcalculatePro() {
    preResult = Math.ceil(fullTrapAmount * fullTrapPrice + (fullMonthLenght * fullMonthlyPrice) * fullTrapAmount, 2)
    fullAmount = preResult.toFixed(2);
    document.getElementById("full-amount").value = fullAmount;

    // Make an AJAX request to get the URL
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/finances/get-invoice-url/?proAmount=${fullAmount}&trapModel=${fullTrapModel}&trapAmount=${fullTrapAmount}&monthAmount=${fullMonthLenght}&tariffType=${fullTariffType}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const url = xhr.responseText;
            document.getElementById("f-go-link").href = url;
        }
    };

    xhr.send();
}

function fminusTrap() {
    if (fullTrapAmount > 1) {
        fullTrapAmount--;
        document.getElementById("full-trap-amount").value = fullTrapAmount;
    }
    fcalculatePro();
}

function fplusTrap() {
    fullTrapAmount++;
    document.getElementById("full-trap-amount").value = fullTrapAmount;
    fcalculatePro();
}

function fminusMonth() {
    if (fullMonthLenght > 1) {
        fullMonthLenght--;
        document.getElementById("full-month-lenght").value = fullMonthLenght;
    }
    fcalculatePro();
}

function fplusMonth() {
    fullMonthLenght++;
    document.getElementById("full-month-lenght").value = fullMonthLenght;
    fcalculatePro();
}


