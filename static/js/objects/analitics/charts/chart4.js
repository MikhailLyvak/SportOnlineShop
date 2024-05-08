const graphData4 = chart_data;

let startDate = def_start_date;
let endDate = date_now;


// Фільтрує і повертає словник вибраному періоду часу на фронті
FilterPestsAmount = (graphData4, start, end) => {
    const result = {};

    Object?.keys(graphData4).forEach((trapData) => {
        for (const [date, amount] of Object.entries(graphData4[trapData])) {
            if (date >= start && date <= end) {
                if (result[trapData]) {
                    result[trapData][date] = amount;
                } else {
                    result[trapData] = { [date]: amount };
                }
            }
        }
    });

    return result;
}



// Функція яка з словника |FilterPestsAmount| витягує ключі (назви пасток) і повертає list
GetChart4Keys = () => {
    const { value: start } = document.getElementById("startdate");
    const { value: end } = document.getElementById("enddate");
    let filterdDate = FilterPestsAmount(graphData4, start, end);

    const result = [];
    for (const [trap, dates] of Object.entries(filterdDate)) {
        result.push(trap);
    }
    return result;
}


// Функція яка з словника |FilterPestsAmount| витягує {дату: значення},
// сумує всі значення по пастці і повертає list(к-ть спійманих мишуй пасткою)
GetChart4Values = () => {
    const { value: start } = document.getElementById("startdate");
    const { value: end } = document.getElementById("enddate");
    let filterdDate = FilterPestsAmount(graphData4, start, end);

    const result = [];
    for (const [trap, dates] of Object.entries(filterdDate)) {
        let sumValue = 0;
        for (const [date, value] of Object.entries(dates)) {
            sumValue += value;
        }
        result.push(sumValue);
    }
    return result;
}


const config = {
    series: [{
        name: gettext('Count of mice'),
        data: GetChart4Values(),
    }],
    annotations: {
        points: [{
            x: 'Bananas',
            seriesIndex: 0,
            label: {
                borderColor: 'rgba(96, 2, 136, 1)',
                offsetY: 0,
                style: {
                    color: '#fff',
                    background: 'rgba(96, 2, 136, 1)',
                },
                text: 'Bananas are good',
            }
        }]
    },
    chart: {
        type: 'bar',
        height: 310,
    },
    plotOptions: {
        bar: {
            borderRadius: 5,
            columnWidth: '70%',
            barHeight: '80%',
            borderColor: 'rgba(96, 2, 136, 1)',
        }
    },
    dataLabels: {
        enabled: true
    },
    grid: {
        row: {
            colors: ['#fff', '#f2f2f2']
        }
    },
    xaxis: {
        labels: {
            rotate: -45
        },
        categories: GetChart4Keys(),
        tickPlacement: 'on'
    },
    yaxis: {
        title: {
            text: gettext('Miсe amount'),
        },
    },
    fill: {
        type: 'solid',
        colors: 'rgba(98, 0, 139, 0.623)',
        strokeColor: 'rgba(96, 2, 136, 1)',
    },
};


// Викликає графік
var barchart = new ApexCharts(document.querySelector("#myChart1"), config);
barchart.render();


// Функція яка оновлює графік (по кнопках з датою)
function chartDataFilter() {
    barchart.updateOptions({
        xaxis: {
            categories: GetChart4Keys()
        },
        series: [{
            data: GetChart4Values()
        }],
    });
};
