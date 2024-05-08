function animatedNumers2() {
    const obj1 = document.getElementById("cought_mice_animation");
    animateValue(obj1, 0, amount_of_caught_mice);

    const obj2 = document.getElementById("inspections_amount_animation");
    animateValue(obj2, 0, amount_of_inspections);

    const obj3 = document.getElementById("traps_installed_animation");
    animateValue(obj3, 0, amount_of_installed_traps);
};

function animateValue(obj, start, end) {
    let startTimestamp = null;
    let duration = 1200;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerText = `${currentValue} pcs.`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}