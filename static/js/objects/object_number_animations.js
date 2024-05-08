function animatedNumers1() {   
        heighest_3_list.forEach((amount) => {
            const obj = document.getElementById(`animated_numbers_${amount.time}`);
            animateValue(obj, 0, amount.value);
        });
        const amounts = count_of_mice_per_time_values;
const dates = count_of_mice_per_time_keys;

const combinedLabels = amounts.map((amount, index) => `${amount} - ${dates[index]}`);

const totalSum = amounts.reduce((sum, value) => sum + value, 0);

var options2 = {
  series: amounts,
  chart: {
    type: 'donut',
  },
  colors: [
    '#3366FF',
    '#299EFF',
    '#29E8FF',
    '#29FFEF',
    '#FF8429',
    '#FFA429',
    '#FFCE29',
    '#FFE529',
    '#FFF529',
    '#F9FF29',
    '#4929FF',
    '#293CFF',
  ],
  labels: dates,
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '16px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#293CFF',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '12px',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#293CFF',
            offsetY: 10,
          },
          total: {
            show: true,
            showAlways: true,
            label: "Total 01.01.2021 - 31.12.2024",
            fontSize: '16px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#000000',
            offsetY: 10,
            formatter(w) {
              return `${totalSum} \n mice`;
            }
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter(val, opts) {
      const name = dates[opts.seriesIndex];
      const value = amounts[opts.seriesIndex];

      const percentage = (value / totalSum) * 100;

      if (percentage >= 5) {
        return [name, value.toString() + ' pcs.'];
      } else {
        return '';
      }
    }
  },
  fill: {
    type: 'gradient',
  },
  responsive: [
    {
      breakpoint: 636,
      options: {
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: false,
              }
            }
          }
        }
      },
    },
  ],
};

var chart2 = new ApexCharts(document.querySelector("#activity_of_pests"), options2);
chart2.render();
};


function animateValue(obj, start, end) {
    let startTimestamp = null;
    let duration = 1000;

    if (end !== 0 && end < 75) {
        duration = end * 50;
    } else if (end !== 0 && end > 100) {
        duration = end * 25;
    }

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


