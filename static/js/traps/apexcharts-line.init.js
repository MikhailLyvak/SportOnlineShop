function get_max_value() {
    const amount_values = trap_signal.map(item => item[1]);

    return Math.max(...amount_values) + 1;
};

function get_series_list() {
    const result = [];

    trap_signal.map(item => {
        result.push({
            name: item[0],
            data: item[1]
        });
    });

    return JSON.stringify(result, null, 2);
}

function get_standard_chart_data(year) {
    fetch(`/api/v1/trap-activation-signals-standard-chart/${slug}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            build_standart_chart(data.data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function build_standart_chart(data) {
    document.getElementById('chart').innerHTML = `
    <div id="chart_toolbar" class="toolbar">
                  
    </div>

    <div id="chart-heatmap" style="min-height: 365px;">
    </div>
    `;
    var options = {
        chart: {
            height: 350,
            type: "area",
            zoom: {
                enabled: 1
            },
            toolbar: {
                show: 1
            }
        },

        stroke: {
            width: [3, 3],
            curve: 'smooth',
            // curve: ['smooth', 'straight', 'stepline'],
        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            formatter: function (val, opt) {
                if (val === 0) {
                    return "";
                }
                return val;
            },
            background: {
                enabled: true,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 4,
                opacity: 0.8,
                dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 2,
                    blur: 2,
                    color: '#000',
                    opacity: 0.45

                }
            }
        },
        markers: {
            size: 3,
            shape: "circle",
            radius: 2,
        },
        colors: ['#6A37D4'],
        series: [{
            name: gettext('Mices'),
            data: trap_signal
        }],
        xaxis: {
            type: 'datetime',
            // tickAmount: 24,
            title: {
                text: gettext('Siganl date')
            },
            labels: {
                formatter: function (val) {
                    return moment(val).format("D.M.YYYY");
                }
            },
            tooltip: {
                enabled: true,
                formatter: function (val) {
                    return moment(val).format("D MM YYYY");
                }
            }
        },
        yaxis: {
            title: {
                text: gettext('Mice cougth')
            },
            min: 0,
            max: get_max_value(),
            tickAmount: get_max_value(),
            labels: {
                formatter: function (val) {
                    return parseInt(val);
                }
            }
        },
    };


    if (chart) {
        chart.destroy();
    }
    chart = document.querySelector("#chart-heatmap");
    chart.innerHTML = '';
    chart = new ApexCharts(chart, options);
    chart.render();
}


function format_data(data) {
    console.log(data);
    let formatted_data = [];
    data.forEach((item, index) => {
        const dateObject = new Date(item[0]);
        const timestamp = dateObject.getTime();
        formatted_data.push([timestamp, item[1],]);
    });
    console.log(formatted_data);

    return formatted_data;
}

console.log(format_data(trap_signal_timeline));
console.log(new Date(install_date).getTime());

function build_timeline_chart() {
    document.getElementById('chart').innerHTML = `
    <div id="chart_toolbar" class="toolbar">
                  
    </div>

    <div id="chart-heatmap" style="min-height: 365px;">
    </div>
    <div id="chart-area"></div>

    `;
    var options = {
        series: [{
            data: format_data(trap_signal_timeline)
        }],
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: true
            },
            zoom: {
                autoScaleYaxis: true
            },

        },
        dataLabels: {
            enabled: true,
            offsetX: 0,
            formatter: function (val, opt) {
                if (val === 0) {
                    return "";
                }
                return val;
            },
            background: {
                enabled: true,
                borderColor: '#fff',
                borderWidth: 1,
                borderRadius: 4,
                opacity: 0.8,
                dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 2,
                    blur: 2,
                    color: '#000',
                    opacity: 0.45

                }
            }
        },
        markers: {
            size: 3,
            shape: "circle",
            radius: 2,
        },
        colors: ['#6A37D4'],
        stroke: {
            width: 3
        },
        fill: {
            opacity: 1,
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false
            }
        }
    };

    if (chart) {
        chart.destroy();
    }
    chart = document.querySelector("#chart-heatmap");
    chart.innerHTML = '';
    chart = new ApexCharts(chart, options);
    chart.render();


    var optionsLine = {
        series: [{
            data: format_data(trap_signal_timeline)
        }],
        chart: {
            id: 'chart1',
            height: 120,
            type: 'area',
            brush: {
                target: 'area-datetime',
                enabled: true
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('10 Mar 2024').getTime(),
                    max: new Date('18 Mar 2024').getTime()
                }
            },
        },

        colors: ['#6A37D4'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            }
        },
        xaxis: {
            type: 'datetime',
            min: new Date(install_date).getTime(),
            max: new Date().getTime(),
            tickAmount: 6,
            tooltip: {
                enabled: false
            }
        },
        yaxis: {
            title: {
                text: gettext('Mice cougth')
            },
            min: 0,
            max: get_max_value(),
            // tickAmount: get_max_value(),
            labels: {
                formatter: function (val) {
                    return parseInt(val);
                }
            },
            tickAmount: 2
        },

    };

    if (chartLine) {
        chartLine.destroy();
    }
    chartLine = document.querySelector("#chart-area");
    chartLine.innerHTML = '';
    chartLine = new ApexCharts(chartLine, optionsLine);
    chartLine.render();



    // var options = {
    //
    //     series: [{
    //         name: gettext('Mice cougth'),
    //         data: format_data(trap_signal_timeline)
    //     }],
    //     chart: {
    //         id: 'area-datetime',
    //         type: 'area',
    //         height: 350,
    //         zoom: {
    //             autoScaleYaxis: true
    //         },
    //
    //     },
    //
    //
    //     dataLabels: {
    //         enabled: true,
    //         offsetX: 0,
    //         formatter: function (val, opt) {
    //             if (val === 0) {
    //                 return "";
    //             }
    //             return val;
    //         },
    //         background: {
    //             enabled: true,
    //             borderColor: '#fff',
    //             borderWidth: 1,
    //             borderRadius: 4,
    //             opacity: 0.8,
    //             dropShadow: {
    //                 enabled: true,
    //                 top: 2,
    //                 left: 2,
    //                 blur: 2,
    //                 color: '#000',
    //                 opacity: 0.45
    //
    //             }
    //         }
    //     },
    //     markers: {
    //         size: 3,
    //         shape: "circle",
    //         radius: 2,
    //     },
    //     colors: ['#6A37D4'],
    //     xaxis: {
    //         type: 'datetime',
    //         min: new Date(install_date).getTime(),
    //         max: new Date().getTime(),
    //         tickAmount: 6,
    //     },
    //     yaxis: {
    //         title: {
    //             text: gettext('Mice cougth')
    //         },
    //         min: -1,
    //         max: get_max_value(),
    //         // tickAmount: get_max_value(),
    //         labels: {
    //             formatter: function (val) {
    //                 return parseInt(val);
    //             }
    //         }
    //     },
    //
    //
    //     tooltip: {
    //         custom: function ({series, seriesIndex, dataPointIndex, w}) {
    //             return '<div class="arrow_box">' +
    //                 '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
    //                 '</div>'
    //         },
    //         x: {
    //             format: 'dd MMM yyyy'
    //         }
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shadeIntensity: 1,
    //             opacityFrom: 0.7,
    //             opacityTo: 0.9,
    //             stops: [0, 100]
    //         }
    //     },
    // };
    // // let chart_div = document.getElementById("chart-timeline");
    // // chart_div.innerHTML = '';
    // if (chart) {
    //     chart.destroy();
    // }
    // chart = document.querySelector("#chart-heatmap");
    // chart.innerHTML = '';
    // chart = new ApexCharts(chart, options);
    // chart.render();
}

// var resetCssClasses = function (activeEl) {
//     var els = document.querySelectorAll('button')
//     Array.prototype.forEach.call(els, function (el) {
//         el.classList.remove('active')
//     })
//
//     activeEl.target.classList.add('active')
// }
//
// document
//     .querySelector('#one_month')
//     .addEventListener('click', function (e) {
//         resetCssClasses(e)
//
//         chart.zoomX(
//             new Date('28 Jan 2013').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document
//     .querySelector('#six_months')
//     .addEventListener('click', function (e) {
//         resetCssClasses(e)
//
//         chart.zoomX(
//             new Date('27 Sep 2012').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document
//     .querySelector('#one_year')
//     .addEventListener('click', function (e) {
//         resetCssClasses(e)
//         chart.zoomX(
//             new Date('27 Feb 2012').getTime(),
//             new Date('27 Feb 2013').getTime()
//         )
//     })
//
// document.querySelector('#ytd').addEventListener('click', function (e) {
//     resetCssClasses(e)
//
//     chart.zoomX(
//         new Date('01 Jan 2013').getTime(),
//         new Date('27 Feb 2013').getTime()
//     )
// })
//
// document.querySelector('#all').addEventListener('click', function (e) {
//     resetCssClasses(e)
//
//     chart.zoomX(
//         new Date('23 Jan 2012').getTime(),
//         new Date('27 Feb 2013').getTime()
//     )
// })


const slug = window.location.pathname.split('/').pop();
let choices_year;
let choices_month;
let chart;
let chartLine;

function add_nav_year_btn(year) {

    let next_btn_status = year === new Date().getFullYear() ? 'disabled' : '';
    let prev_btn_status = year === 2022 ? 'disabled' : '';

    html_nav = `
        <ul class="pagination justify-content-start pagination-sm">
          <li class="page-item"><a id="heatmap_prev_button" class="page-link ${prev_btn_status}" style="cursor:pointer;"><i class="mdi mdi-chevron-left"></i></a></li>
          <li class="page-item paginate_button active"><a class="page-link"><span id="heatmap_year">${year}</span></a></li>
          <li class="page-item"><a id="heatmap_next_button" class="page-link ${next_btn_status}" style="cursor:pointer;"><i class="mdi mdi-chevron-right"></i></a></li>
        </ul>
    `;

    let chart_toolbar = document.getElementById('chart_toolbar');
    chart_toolbar.innerHTML = '';
    chart_toolbar.innerHTML = html_nav;

    document
        .querySelector('#heatmap_prev_button')
        .addEventListener('click', function (e) {
            let current_year = parseInt(document.getElementById('heatmap_year').innerText);
            current_year -= 1;
            document.getElementById('heatmap_year').innerText = current_year;
            get_chart_data(current_year);

        });

    document
        .querySelector('#heatmap_next_button')
        .addEventListener('click', function (e) {
            let current_year = parseInt(document.getElementById('heatmap_year').innerText);
            current_year += 1;
            document.getElementById('heatmap_year').innerText = current_year;
            get_chart_data(current_year);
        });
}

function add_nav_month_btn(year, month) {

    let next_btn_status = month === 12 ? 'disabled' : '';
    let prev_btn_status = month === 1 ? 'disabled' : '';

    html_nav = `
        <ul class="pagination justify-content-start pagination-sm">
          <li class="page-item"><a id="heatmap_month_prev_button" class="page-link ${prev_btn_status}" style="cursor:pointer;"><i class="mdi mdi-chevron-left"></i></a></li>
          <li class="page-item paginate_button active"><a class="page-link"><span id="heatmap_year_month">${year} ${month_name[month]}</span></a></li>
          <li class="page-item"><a id="heatmap_month_next_button" class="page-link ${next_btn_status}" style="cursor:pointer;"><i class="mdi mdi-chevron-right"></i></a></li>
          <li id="back_to_year_btn" class="page-item mx-1">
            <button class="btn btn-outline-trojan btn-sm border-1" style="border-color: #5426b2;">Back to year</button>
          </li>
        </ul>
    `;

    let chart_toolbar = document.getElementById('chart_toolbar');
    chart_toolbar.innerHTML = '';
    chart_toolbar.innerHTML = html_nav;

    document.getElementById(`heatmap_month_next_button`).addEventListener('click', function (e) {
        document.getElementById('heatmap_year_month').innerText = `${year} ${month_name[month + 1]}`;
        get_month_chart_data(choices_year, month + 1);
    });
    document.getElementById(`heatmap_month_prev_button`).addEventListener('click', function (e) {
        document.getElementById('heatmap_year_month').innerText = `${year} ${month_name[month - 1]}`;
        get_month_chart_data(choices_year, month - 1);
    });
    document.getElementById(`back_to_year_btn`).addEventListener('click', function (e) {
        get_chart_data(choices_year);
    });
}


let month_name = {
    1: gettext('Jan'),
    2: gettext('Feb'),
    3: gettext('Mar'),
    4: gettext('Apr'),
    5: gettext('May'),
    6: gettext('Jun'),
    7: gettext('Jul'),
    8: gettext('Aug'),
    9: gettext('Sep'),
    10: gettext('Oct'),
    11: gettext('Nov'),
    12: gettext('Dec'),
};

function get_chart_data(year) {
    fetch(`/api/v1/trap-activation-signals-chart/${slug}/${year}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            build_chart(data.data, data.year);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function get_month_chart_data(year, month) {
    fetch(`/api/v1/trap-activation-signals-month-chart/${slug}/${year}/${month}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            build_month_chart(data.data, data.year, data.month);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function generate_data_month(data) {
    let series = [];

    for (const day in data) {
        let series_name = day;
        let series_data = [];
        for (const hour in data[day]) {
            console.log(data[day][hour]);
            if (data[day][hour].length > 1) {
                series_data.push({
                    x: `${hour}`,
                    y: data[day][hour][0],
                    times: data[day][hour].slice(1)
                });
            }else{
                series_data.push({
                    x: `${hour}`,
                    y: data[day][hour][0],
                    times: []
                });
            }

        }
        series.push({
            name: `${series_name}`,
            data: series_data
        });
    }
    console.log(series);
    return series;
}

function generate_data_year(days) {
    let data = [];
    for (const day in days) {
        if (days[day].length > 1) {
            data.push({
                x: day,
                y: days[day][0],
                times: days[day].slice(1)
            });
        } else {
            data.push({
                x: day,
                y: days[day][0],
                times: [],
            });
        }

    }
    return data;
}

function generate_times_year(days) {
    let times = {};
    for (const day in days) {
        if (days[day].length > 1) {
            times[day] = days[day].slice(1);
        } else {
            times[day] = [];
        }
    }
    console.log(times);
    return times;

}

function build_month_chart(data, year, month) {
    document.getElementById('chart').innerHTML = `
    <div id="chart_toolbar" class="toolbar">
                  
    </div>

    <div id="chart-heatmap" style="min-height: 365px;">
    </div>
    `;
    var options = {
        series: generate_data_month(data),
        chart: {
            height: 600,
            type: 'heatmap',
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.4,
                enableShades: false,
                radius: 0,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [{
                        from: -30,
                        to: -1,
                        name: 'In features',
                        color: 'rgb(84,38,178)'

                    },
                        {
                            from: 0,
                            to: 0,
                            name: '0',
                            color: '#0AB39C'
                        },
                        {
                            from: 1,
                            to: 2,
                            name: '1-2',
                            color: '#F7B84B'
                        },
                        {
                            from: 3,
                            to: 55,
                            name: '>2',
                            color: '#F06548'
                        }
                    ]
                }
            }
        },
        xaxis: {
            title: {
                text: gettext('Hours of the day'),
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                }
            },

        },
        yaxis: {
            title: {
                text: gettext('Days of the month'),
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                }
            },

        },
        tooltip: {
            custom: function ({series, seriesIndex, dataPointIndex, w}) {
                console.log(w.config['series'][seriesIndex]['data'][dataPointIndex]['times']);
                if (series[seriesIndex][dataPointIndex] === -1) {
                    return ``;
                } else if (series[seriesIndex][dataPointIndex] === 0) {
                    return `<div class="popover" role="tooltip">
                        <div class="popover-header m-0 py-1 bg-light">
                            <span class="fw-bold">${w.config['series'][seriesIndex]['data'][dataPointIndex]['x']} ${w.config['series'][seriesIndex]['name']} ${choices_year}: ${w.config['series'][seriesIndex]['data'][dataPointIndex]['y']}</span>
                        </div>    
                        <div class="popover-arrow"></div>
                   
                    </div>`;
                } else {
                    let span = `<span class="fw-bold">In times:</span><br>`;
                    let times = w.config['series'][seriesIndex]['data'][dataPointIndex]['times'];
                    for (let i = 0; i < times.length; i++) {
                        span += `<span class="fw-bold">${i + 1}:</span> <span>${w.config['series'][seriesIndex]['data'][dataPointIndex]['times'][i]}</span><br>`;
                    }
                    return `<div class="popover" role="tooltip">
                      <div class="popover-header m-0 py-1 bg-light">
                        <span class="fw-bold">${w.config['series'][seriesIndex]['data'][dataPointIndex]['x']} ${w.config['series'][seriesIndex]['name']} ${choices_year}: ${w.config['series'][seriesIndex]['data'][dataPointIndex]['y']}</span>
                      </div>
                      
                      <div class="popover-body">
                        ${span}  
                      </div>
                      <div class="popover-arrow"></div>

                    </div>`;
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                if (val === -1) {
                    return "";
                }
                return val;
            },
        },
        stroke: {
            width: 0.2
        },
        // title: {
        //     text: 'HeatMap Chart with Color Range'
        // },
    };

    if (chart) {
        chart.destroy();
    }

    add_nav_month_btn(year, month);

    chart = document.querySelector("#chart-heatmap");
    chart.innerHTML = '';
    chart = new ApexCharts(chart, options);
    chart.render();


}

function build_chart(data, year) {
    document.getElementById('chart').innerHTML = `
    <div id="chart_toolbar" class="toolbar">
                  
    </div>

    <div id="chart-heatmap" style="min-height: 365px;">
    </div>
    `;
    var options = {
        series: [
            {
                name: `Jan`,
                data: generate_data_year(data[1]),
                times: generate_times_year(data[1])
            },
            {
                name: 'Feb',
                data: generate_data_year(data[2]),
                times: generate_times_year(data[2])
            },
            {
                name: 'Mar',
                data: generate_data_year(data[3]),
                times: generate_times_year(data[3])
            },
            {
                name: 'Apr',
                data: generate_data_year(data[4]),
                times: generate_times_year(data[4])
            },
            {
                name: 'May',
                data: generate_data_year(data[5]),
                times: generate_times_year(data[5])
            },
            {
                name: 'Jun',
                data: generate_data_year(data[6]),
                times: generate_times_year(data[6])
            },
            {
                name: 'Jul',
                data: generate_data_year(data[7]),
                times: generate_times_year(data[7])
            },
            {
                name: 'Aug',
                data: generate_data_year(data[8]),
                times: generate_times_year(data[8])
            },
            {
                name: 'Sep',
                data: generate_data_year(data[9]),
                times: generate_times_year(data[9])
            },
            {
                name: 'Oct',
                data: generate_data_year(data[10]),
                times: generate_times_year(data[10])
            },
            {
                name: 'Nov',
                data: generate_data_year(data[11]),
                times: generate_times_year(data[11])
            },
            {
                name: 'Dec',
                data: generate_data_year(data[12]),
                times: generate_times_year(data[12])
            },
        ],
        chart: {
            height: 350,
            type: 'heatmap',
            events: {
                dataPointSelection: function (event, chartContext, config) {
                    get_month_chart_data(year, config.seriesIndex + 1);

                },

            },
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.4,
                enableShades: false,
                radius: 0,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [{
                        from: -30,
                        to: -1,
                        name: 'In features',
                        color: 'rgb(84,38,178)'

                    },
                        {
                            from: 0,
                            to: 0,
                            name: '0',
                            color: '#0AB39C'
                        },
                        {
                            from: 1,
                            to: 2,
                            name: '1-2',
                            color: '#F7B84B'
                        },
                        {
                            from: 3,
                            to: 55,
                            name: '>2',
                            color: '#F06548'
                        }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                if (val === -1) {
                    return "";
                }
                return val;
            },
        },
        xaxis: {
            title: {
                text: gettext('Days of the month'),
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                }
            },

        },
        yaxis: {
            title: {
                text: gettext('Months of the year'),
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                }
            },

        },
        tooltip: {
            custom: function ({series, seriesIndex, dataPointIndex, w}) {
                console.log(w.config['series'][seriesIndex]['data'][dataPointIndex]['times']);
                if (series[seriesIndex][dataPointIndex] === -1) {
                    return ``;
                } else if (series[seriesIndex][dataPointIndex] === 0) {
                    return `<div class="popover" role="tooltip">
                        <div class="popover-header m-0 py-1 bg-light">
                            <span class="fw-bold">${w.config['series'][seriesIndex]['data'][dataPointIndex]['x']} ${w.config['series'][seriesIndex]['name']} ${choices_year}: ${w.config['series'][seriesIndex]['data'][dataPointIndex]['y']}</span>
                        </div>    
                        <div class="popover-arrow"></div>
                   
                    </div>`;
                } else {
                    let span = `<span class="fw-bold">In times:</span><br>`;
                    let times = w.config['series'][seriesIndex]['data'][dataPointIndex]['times'];
                    for (let i = 0; i < times.length; i++) {
                        span += `<span class="fw-bold">${i + 1}:</span> <span>${w.config['series'][seriesIndex]['data'][dataPointIndex]['times'][i]}</span><br>`;
                    }
                    return `<div class="popover" role="tooltip">
                      <div class="popover-header m-0 py-1 bg-light">
                        <span class="fw-bold">${w.config['series'][seriesIndex]['data'][dataPointIndex]['x']} ${w.config['series'][seriesIndex]['name']} ${choices_year}: ${w.config['series'][seriesIndex]['data'][dataPointIndex]['y']}</span>
                      </div>
                      
                      <div class="popover-body">
                        ${span}  
                      </div>
                      <div class="popover-arrow"></div>

                    </div>`;
                }
            }
        },


        stroke: {
            width: 0.2
        },
        // title: {
        //     text: 'HeatMap Chart with Color Range'
        // },
    };

    choices_year = year;
    if (chart) {
        chart.destroy();
    }
    add_nav_year_btn(year);

    chart = document.querySelector("#chart-heatmap");
    chart.innerHTML = '';
    chart = new ApexCharts(chart, options);
    chart.render();


}

var resetCssClasses = function (activeEl) {
    var els = document.querySelectorAll('button');
    Array.prototype.forEach.call(els, function (el) {
        el.classList.remove('active');
    });

    activeEl.target.classList.add('active');
};


document.addEventListener("DOMContentLoaded", function () {
    let current_year = new Date().getFullYear();
    document.getElementById('heatmap_chart_btn').addEventListener('click', function (e) {
        get_chart_data(current_year);
    });
    document.getElementById('standard_chart_btn').addEventListener('click', function (e) {
        build_standart_chart();
    });
    document.getElementById('timeline_chart_btn').addEventListener('click', function (e) {
        build_timeline_chart();
    });
    build_standart_chart();
    // get_month_chart_data(current_year-1, 11);

});

