window.onload = function() {
    visitAnimation();
};

function visitAnimation() {
    const obj1 = document.getElementById("visit_animate_1");
        animateValue(obj1, 0, month_visits);

    const obj2 = document.getElementById("visit_animate_2");
        animateValue(obj2, 0, month_done_visits);
}


function animateValue(obj, start, end) {
    let startTimestamp = null;
    let duration = 1200;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerText = `${currentValue}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}