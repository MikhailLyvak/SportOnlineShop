


function hundleCustomButtonClickChart1() {
  const customButton = document.getElementById('SmartTimeActivityTotalChart2CustomButton');
  customButton.style.display = 'none';

  const startDateInput = document.getElementById('chart2StartDate');
  const endDateInput = document.getElementById('chart2EndDate');
  startDateInput.style.display = 'block';
  endDateInput.style.display = 'block';
}


const customButtonChart2 = document.getElementById('SmartTimeActivityTotalChart2CustomButton');
customButtonChart2.addEventListener('click', hundleCustomButtonClickChart1);

function fetchDataChart2(object_slug, period) {
  let url = `/api/analitycs/time-traps-chart/${object_slug}/${period}`;

  if (period === 'CUSTOM') {
    const startDate = document.getElementById('chart2StartDate').value;
    const endDate = document.getElementById('chart2EndDate').value;
    console.log(`Start date: ${startDate}, End date: ${endDate}`);

    url += `?start_date=${startDate}&end_date=${endDate}`;
  }

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function extractDataChart2(object_slug, period) {
  return fetchDataChart2(object_slug, period)
    .then(data => {
      const count = [];
      const timePeriod = [];

      data.forEach(entry => {
        count.push(entry.count);
        timePeriod.push(entry.time_period);
      });

      return { count, timePeriod };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function getTimeAndCount(object_slug, period) {
  return extractDataChart2(object_slug, period)
    .then(({ count, timePeriod }) => {
      return { count, timePeriod };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}


var options2 = {
  series: [],
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
  labels: [],
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '24px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#293CFF',
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '20px',
            fontFamily: 'Arial',
            fontWeight: 'normal',
            color: '#293CFF',
            offsetY: 10,
          },
          total: {
            show: true,
            showAlways: true,
            label: "Total 01.01.2021 - 31.12.2024",
            fontSize: '24px',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            color: '#000000',
            offsetY: 10,
            formatter(w) {
              return `100 \n mice`;
            }
          },
        },
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter(val, opts) {
      return val;
    }
  },
  fill: {
    type: 'gradient',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

var chart2 = new ApexCharts(document.querySelector("#SmartTimeActivityTotalChart2"), options2);
chart2.render();

function SmartTrapTimeActivityChart2(period) {
  const object_slug = choosenObjectValue;
  const yearButton = document.getElementById('SmartTimeActivityTotalChart2YearButton');
  const threeMonthButton = document.getElementById('SmartTimeActivityTotalChart2ThreeMonthButton');
  const monthButton = document.getElementById('SmartTimeActivityTotalChart2MonthButton');
  const customButton = document.getElementById('SmartTimeActivityTotalChart2CustomButton');
  const startDateInput = document.getElementById('chart2StartDate');
  const endDateInput = document.getElementById('chart2EndDate');

  switch (period) {
    case 'YEAR':
      yearButton.disabled = true;
      threeMonthButton.disabled = false;
      monthButton.disabled = false;
      customButton.style.display = 'inline-block';
      startDateInput.style.display = 'none';
      endDateInput.style.display = 'none';
      break;
    case '3MONTH':
      threeMonthButton.disabled = true;
      yearButton.disabled = false;
      monthButton.disabled = false;
      customButton.style.display = 'inline-block';
      startDateInput.style.display = 'none';
      endDateInput.style.display = 'none';
      break;
    case 'MONTH':
      monthButton.disabled = true;
      yearButton.disabled = false;
      threeMonthButton.disabled = false;
      customButton.style.display = 'inline-block';
      startDateInput.style.display = 'none';
      endDateInput.style.display = 'none';
      break;
    case 'CUSTOM':
      monthButton.disabled = false;
      yearButton.disabled = false;
      threeMonthButton.disabled = false;
      customButton.style.display = 'none';
      startDateInput.style.display = 'block';
      endDateInput.style.display = 'block';
      break;
    default:
      break;
  }

  extractDataChart2(object_slug, period)
  .then(({ count, timePeriod }) => {
    const tableBody = document.getElementById('chart2TableBody');
    tableBody.innerHTML = '';

    const data = timePeriod.map((value, index) => ({ timePeriod: value, count: count[index] }));
    data.sort((a, b) => b.count - a.count);

    data.forEach(({ timePeriod, count }) => {
      const row = document.createElement('tr');
      const periodCell = document.createElement('td');
      const valueCell = document.createElement('td');
      periodCell.textContent = timePeriod;
      periodCell.classList.add('text-center');
  
      const itemId = `item_${timePeriod}`;
      valueCell.innerHTML = `<span class="badge border border-danger text-danger fs-13" id="animated_numbers_${itemId}">0 pcs.</span>`;
      valueCell.classList.add('text-center');
  
      row.appendChild(periodCell);
      row.appendChild(valueCell);
      tableBody.appendChild(row);
  
      animateCount(itemId, count);
  });

    function changeChart2() {
      const updatedTimePeriod = [
        "00:00 - 02:00",
        "02:00 - 04:00",
        "04:00 - 06:00",
        "06:00 - 08:00",
        "08:00 - 10:00",
        "10:00 - 12:00",
        "12:00 - 14:00",
        "14:00 - 16:00",
        "16:00 - 18:00",
        "18:00 - 20:00",
        "20:00 - 22:00",
        "22:00 - 00:00"
      ];
    
      const totalSum = count.reduce((a, b) => a + b, 0);
    
      const newDataLabels = {
        enabled: true,
        formatter(val, opts) {
          const percentage = (count[opts.seriesIndex] / totalSum) * 100;
          if (percentage >= 5) {
            return [updatedTimePeriod[opts.seriesIndex], count[opts.seriesIndex].toString() + 'pcs.'];
          } else {
            return '';
          }
        }
      };

      const startDate = document.getElementById('chart2StartDate').value;
      const endDate = document.getElementById('chart2EndDate').value;

      let totalLabel = "";
      if (period === 'MONTH') {
        totalLabel = `Total ${month_before} - ${date_now}`;
      } else if (period === '3MONTH') {
        totalLabel = `Total ${three_month_before} - ${date_now}`;
      } else if (period === 'YEAR') {
        totalLabel = `Total ${year_before} - ${date_now}`;
      } else if (period === 'CUSTOM') {
        totalLabel = `Total ${startDate} - ${endDate}`;
      }
    
      const newOptions = {
        series: count,
        labels: updatedTimePeriod,
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '24px',
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  color: '#293CFF',
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: '20px',
                  fontFamily: 'Arial',
                  fontWeight: 'normal',
                  color: '#293CFF',
                  offsetY: 10,
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: totalLabel,
                  fontSize: '24px',
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
        dataLabels: newDataLabels
      };
    
      return newOptions;
    }
    chart2.updateOptions(changeChart2());

    
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


function animateCount(itemId, finalCount) {
  const span = document.getElementById(`animated_numbers_${itemId}`);
  if (!span) return;

  const duration = 1000;
  const frames = 60;
  const increment = Math.ceil(finalCount / frames);

  let currentCount = 0;
  const intervalId = setInterval(() => {
      currentCount += increment;
      if (currentCount >= finalCount) {
          clearInterval(intervalId);
          currentCount = finalCount;
      }
      span.textContent = `${currentCount} pcs.`;
  }, duration / frames);
}