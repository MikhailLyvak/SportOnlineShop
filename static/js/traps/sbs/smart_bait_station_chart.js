function format_data(data) {
    let formatted_data = [];
    data.forEach((item, index) => {
        const dateObject = new Date(item.crm_date_time);
        const timestamp = dateObject.getTime();
        formatted_data.push([timestamp, item.bait_filling, ]);
    });
    console.log(formatted_data);
    return formatted_data;
}

function chart_init(chart_data) {

        var options = {
          series: [{
          data: format_data(chart_data)
        }],
          chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true
          }
        },
        // annotations: {
        //   yaxis: [{
        //     y: 30,
        //     borderColor: '#999',
        //     label: {
        //       show: true,
        //       text: 'Support',
        //       style: {
        //         color: "#fff",
        //         background: '#00E396'
        //       }
        //     }
        //   }],
        //   xaxis: [{
        //     x: new Date('10 Nov 2024').getTime(),
        //     borderColor: '#999',
        //     yAxisIndex: 0,
        //     label: {
        //       show: true,
        //       text: 'Rally',
        //       style: {
        //         color: "#fff",
        //         background: '#775DD0'
        //       }
        //     }
        //   }]
        // },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          min: new Date('10 Mar 2024').getTime(),
          tickAmount: 6,
        },
        tooltip: {
          custom: function({series, seriesIndex, dataPointIndex, w}) {
            return '<div class="arrow_box">' +
              '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
              '</div>'
          },
          x: {
            format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        };
        let chart_div = document.getElementById("chart-timeline");
        chart_div.innerHTML = '';
        var chart = new ApexCharts(chart_div, options);
        chart.render();


        var resetCssClasses = function(activeEl) {
        var els = document.querySelectorAll('button')
        Array.prototype.forEach.call(els, function(el) {
          el.classList.remove('active')
        })

        activeEl.target.classList.add('active')
      }

      document
        .querySelector('#one_month')
        .addEventListener('click', function(e) {
          resetCssClasses(e)

          chart.zoomX(
            new Date('28 Jan 2013').getTime(),
            new Date('27 Feb 2013').getTime()
          )
        })

      document
        .querySelector('#six_months')
        .addEventListener('click', function(e) {
          resetCssClasses(e)

          chart.zoomX(
            new Date('27 Sep 2012').getTime(),
            new Date('27 Feb 2013').getTime()
          )
        })

      document
        .querySelector('#one_year')
        .addEventListener('click', function(e) {
          resetCssClasses(e)
          chart.zoomX(
            new Date('27 Feb 2012').getTime(),
            new Date('27 Feb 2013').getTime()
          )
        })

      document.querySelector('#ytd').addEventListener('click', function(e) {
        resetCssClasses(e)

        chart.zoomX(
          new Date('01 Jan 2013').getTime(),
          new Date('27 Feb 2013').getTime()
        )
      })

      document.querySelector('#all').addEventListener('click', function(e) {
        resetCssClasses(e)

        chart.zoomX(
          new Date('23 Jan 2012').getTime(),
          new Date('27 Feb 2013').getTime()
        )
      })


}


// function get_data() {
//     fetch(`/api/v1/smart-bait-station/${slug}/period-signals-chart`)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             // chart.updateSeries([{
//             //     data: data
//             // }])
//         });
// }
//
// get_data();
