function vulnarAnimation() {
    const obj1 = document.getElementById("animated_vul_numbers_1");
    animateValue(obj1, 0, vulnar_created_sum);

    const obj2 = document.getElementById("animated_vul_numbers_2");
    animateValue(obj2, 0, vulnar_closed_sum);

    var chart = new ApexCharts(document.querySelector("#vulnar_chart"), options);
    chart.render();
}


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

// Відповідно до вибору в фільтрі формує інформацію для графіка,
//     у форматі: [{name: value}, {name: value}, ...]
function filterDataChart3_2() {
    const choice = document.getElementById("get_vul_category");

    let result = [];

    if (choice.value === gettext("Sanitary condition")) {
        const created_vul = {}
        created_vul.name = gettext("Created sanutary condition vulnerabilities");
        created_vul.data = chart3_2_sanitar;

        const closed_vul = {}
        closed_vul.name = gettext("Closed sanutary condition vulnerabilities");
        closed_vul.data = chart3_2_sanitar_closed;

        result.push(created_vul);
        result.push(closed_vul);
    } else if (choice.value === gettext("Technical condition")) {
        const created_vul = {}
        created_vul.name = gettext("Created technical condition vulnerabilities");
        created_vul.data = chart3_2_tech;

        const closed_vul = {}
        closed_vul.name = gettext("Closed technical condition vulnerabilities");
        closed_vul.data = chart3_2_tech_closed;

        result.push(created_vul);
        result.push(closed_vul);
    } else if (choice.value === gettext("Staff practice")) {
        const created_vul = {}
        created_vul.name = gettext("Created staff practice vulnerabilities");
        created_vul.data = chart3_2_practice;

        const closed_vul = {}
        closed_vul.name = gettext("Closed staff practice vulnerabilities");
        closed_vul.data = chart3_2_practice_closed;

        result.push(created_vul);
        result.push(closed_vul);
    } else if (choice.value === gettext("Created vulnerabilities")) {
        const created_sanitar = {};
        created_sanitar.name = gettext("Sanitary condition vulnerabilities");
        created_sanitar.data = chart3_2_sanitar;

        const created_technical = {};
        created_technical.name = gettext("Technical condition vulnerabilities");
        created_technical.data = chart3_2_tech;

        const created_prectice = {};
        created_prectice.name = gettext("Staff practice vulnerabilities");
        created_prectice.data = chart3_2_practice;

        result.push(created_sanitar);
        result.push(created_technical);
        result.push(created_prectice);
    }

    console.log(`Series chart data ${JSON.stringify(result, null, 2)}`);
    return result;
};

// Бере мін. і макс. значення з функції фільтрування, щоб
// передати в графік макс. висоту + 0.2 так же і мін.!
function get_min_or_max_value(min_or_max) {
    const data = filterDataChart3_2();

    let full_list = [];

    for (let val = 0; val < data.length; val++) {
        full_list.push(...data[val].data);
    }

    if (min_or_max === "min") {
        return Math.min(...full_list);
    } else if (min_or_max === "max") {
        return Math.max(...full_list) + 0.2;
    }
};


// Нижній графік у форматі створена -> усунена вразливість по місяцях
var options2 = {
    series: filterDataChart3_2(),
    chart: {
        height: 350,
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#c21b6e', '#7c8deb', '#10217c'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: gettext('Statistics of registered and fixed vulnerabilities by category'),
        align: 'left'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    markers: {
        size: 1
    },
    xaxis: {
        categories: chart3_2_monthes,
        title: {
            text: gettext('Months')
        }
    },
    yaxis: {
        title: {
            text: gettext('Vulnerabilities count')
        },
        min: get_min_or_max_value("min"),
        max: get_min_or_max_value("max")
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
    }
};


var chart2 = new ApexCharts(document.querySelector("#vulnar_chart_2"), options2);
chart2.render();


// Функція онволення данних графіка при виборі фільтра
function chartCategoryFilter() {
    chart2.updateOptions({
        xaxis: {
            categories: chart3_2_monthes
        },
        series: filterDataChart3_2(),
        yaxis: {
            title: {
                text: gettext('Vulnerabilities count')
            },
            min: get_min_or_max_value("min"),
            max: get_min_or_max_value("max")
        },
    });
};


// Верхній графік з фільтром по типах вразливостей у форматі
// створені -> усунуті вразливості певного типу за місяць
// (є фільтр на всі типи сворених вразливостей по місяцях)
var options = {
    series: [
        {
            name: gettext("Registered vulnerabilities"),
            data: vulnar_created_list_chart
        },
        {
            name: gettext("Fixed vulnerabilities"),
            data: vulnar_closed_list_chart
        }
    ],
    chart: {
        height: 350,
        type: 'line',
        dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
        },
        toolbar: {
            show: false
        }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
        enabled: true,
    },
    stroke: {
        curve: 'smooth'
    },
    title: {
        text: gettext('Statistics of registered and fixed vulnerabilities'),
        align: 'left'
    },
    grid: {
        borderColor: '#e7e7e7',
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    markers: {
        size: 1
    },
    xaxis: {
        categories: vulnar_dates_list_chart,
        title: {
            text: gettext('Months')
        }
    },
    yaxis: {
        title: {
            text: gettext('Vulnerabilities count')
        },
        min: min_len,
        max: max_len
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
    }
};
