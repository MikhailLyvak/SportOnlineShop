let choosenObjectValue = null;


function hundleCustomButtonClickChart1() {
  // Hide the "CUSTOM" button
  const customButton = document.getElementById('SmartTrapTotalChart1CustomButton');
  customButton.style.display = 'none';

  // Show the input fields for start and end dates
  const startDateInput = document.getElementById('startdate');
  const endDateInput = document.getElementById('enddate');
  startDateInput.style.display = 'block';
  endDateInput.style.display = 'block';
}

// Add event listener to the "CUSTOM" button
const customButton = document.getElementById('SmartTrapTotalChart1CustomButton');
customButton.addEventListener('click', hundleCustomButtonClickChart1);


function fetchData(object_slug, period) {
  let url = `/api/analitycs/total-traps-chart/${object_slug}/${period}`;

  // Check if the period is 'CUSTOM'
  if (period === 'CUSTOM') {
    // Get the start and end date values from the input fields
    const startDate = document.getElementById('startdate').value;
    const endDate = document.getElementById('enddate').value;
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

function extractData(object_slug, period) {
  return fetchData(object_slug, period)
    .then(data => {
      const miceCought = [];
      const date = [];

      data.forEach(entry => {
        miceCought.push(entry.count);
        date.push(entry.date);
      });

      return { miceCought, date };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function getBaitAndVisitTime(object_slug, period) {
  return extractData(object_slug, period)
    .then(({ miceCought, date }) => {
      return { miceCought, date };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}


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
  markers: {
    size: 3,
    shape: "circle",
    radius: 2,
  },
  stroke: {
    width: [3, 3],
    curve: ['smooth', 'straight', 'stepline'],
  },
  dataLabels: {
    enabled: true,
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
  colors: ['#6A37D4'],
  series: [{
    name: gettext('Pests amount'),
    data: []
  }],
  labels: [],
  xaxis: {
    type: 'date',
  }
};


var smartTrapTotalChart1 = new ApexCharts(document.querySelector("#smartTrapTotalChart1"), options);
smartTrapTotalChart1.render();


function SmartTrapTotalChart1(period) {
  const object_slug = choosenObjectValue;
  const yearButton = document.getElementById('SmartTrapTotalChart1YearButton');
  const threeMonthButton = document.getElementById('SmartTrapTotalChart1ThreeMonthButton');
  const monthButton = document.getElementById('SmartTrapTotalChart1MonthButton');
  const customButton = document.getElementById('SmartTrapTotalChart1CustomButton');
  const startDateInput = document.getElementById('startdate');
  const endDateInput = document.getElementById('enddate');

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

  extractData(object_slug, period)
    .then(({ miceCought, date }) => {
      smartTrapTotalChart1.updateOptions({
        xaxis: {
          categories: date
        },
        series: [{
          data: miceCought
        }],
      });
      

      animateValue("max_cought", Math.max(...miceCought))
      animateValue("avg_cought", mlAvg(miceCought))
      animateValue("min_cought", Math.min(...miceCought))
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function animateValue(obj, finalCount) {
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
