function hundleCustomButtonClickChart3() {
  // Hide the "CUSTOM" button
  const customButton = document.getElementById('smartTrapAllTrapsChart3CustomButton');
  customButton.style.display = 'none';

  // Show the input fields for start and end dates
  const startDateInput = document.getElementById('chart3StartDate');
  const endDateInput = document.getElementById('chart3EndDate');
  startDateInput.style.display = 'block';
  endDateInput.style.display = 'block';
}

// Add event listener to the "CUSTOM" button
const customButtonChart3 = document.getElementById('smartTrapAllTrapsChart3CustomButton');
customButtonChart3.addEventListener('click', hundleCustomButtonClickChart3);


function fetchDataChart3(object_slug, period) {
  let url = `/api/analitycs/all-traps-chart/${object_slug}/${period}`;

  // Check if the period is 'CUSTOM'
  if (period === 'CUSTOM') {
    // Get the start and end date values from the input fields
    const startDate = document.getElementById('chart3StartDate').value;
    const endDate = document.getElementById('chart3EndDate').value;
    console.log(`Start date: ${startDate}, End date: ${endDate}`);

    // Append the start and end date parameters to the URL
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

function extractDataChart3(object_slug, period) {
  return fetchDataChart3(object_slug, period)
    .then(data => {
      const amount = [];
      const serial_number = [];

      data.forEach(entry => {
        amount.push(entry.amount);
        serial_number.push(entry.serial_number);
      });

      return { amount, serial_number };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function gatTrapAndValue(object_slug, period) {
  return extractDataChart3(object_slug, period)
    .then(({ amount, serial_number }) => {
      return { amount, serial_number };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}


var options = {
  series: [{
    name: gettext('Count of mice'),
    data: [],
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
    height: 350,
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
    categories: [],
    tickPlacement: 'on'
  },
  yaxis: {
    title: {
      text: gettext('Miсe amount'),
    },
  },
  fill: {
    type: 'solid',
    colors: 'rgba(148, 0, 211, 0.4)',
    strokeColor: 'rgba(96, 2, 136, 1)',
  },
};


var smartChart3 = new ApexCharts(document.querySelector("#smartTrapAllTrapsChart3"), options);
smartChart3.render();


function smartTrapAllTrapsChart3(period) {
  const object_slug = choosenObjectValue;
  const yearButton = document.getElementById('smartTrapAllTrapsChart3YearButton');
  const threeMonthButton = document.getElementById('smartTrapAllTrapsChart3ThreeMonthButton');
  const monthButton = document.getElementById('smartTrapAllTrapsChart3MonthButton');
  const customButton = document.getElementById('smartTrapAllTrapsChart3CustomButton');
  const startDateInput = document.getElementById('chart3StartDate');
  const endDateInput = document.getElementById('chart3EndDate');

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

  extractDataChart3(object_slug, period)
    .then(({ amount, serial_number }) => {
        smartChart3.updateOptions({
        xaxis: {
          categories: serial_number
        },
        series: [{
          data: amount
        }],
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function animateValueChart3(obj, finalCount) {
  const objToAnimate = document.getElementById(obj);

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
      objToAnimate.textContent = `${currentCount} pcs.`;
  }, duration / frames);
}

function mlAvg(values){
  const sum = values.reduce((total, current) => total + current, 0);
  return Math.round(avg = sum / values.length, 0);
}
