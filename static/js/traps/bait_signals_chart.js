function getBaitChartUrl(slug, period, data_type) {
  return `/api/bait-chart-data/${slug}/${period}/${data_type}/`;
}

function changeDataType() {
  const button = document.getElementById('changeDataTypeButton');
  const monthButton = document.getElementById('monthButton');
  const threeMonthButton = document.getElementById('threeMonthButton');
  const yearButton = document.getElementById('yearButton');

  const currentText = button.textContent.trim();
  if (currentText === 'GRAMS') {
    button.textContent = 'PERCENTS';
    BaitChart(slug, "MONTH", "PERCENTS")
    monthButton.setAttribute('onclick', "BaitChart('ml_10', 'MONTH', 'PERCENTS')");
    threeMonthButton.setAttribute('onclick', "BaitChart('ml_10', '3MONTH', 'PERCENTS')");
    yearButton.setAttribute('onclick', "BaitChart('ml_10', 'YEAR', 'PERCENTS')");
    button.classList.remove('btn-ghost-info');
    button.classList.add('btn-ghost-primary');
  } else if (currentText === 'PERCENTS') {
    button.textContent = 'GRAMS';
    BaitChart(slug, "MONTH", "STANDARD")
    monthButton.setAttribute('onclick', "BaitChart('ml_10', 'MONTH', 'STANDARD')");
    threeMonthButton.setAttribute('onclick', "BaitChart('ml_10', '3MONTH', 'STANDARD')");
    yearButton.setAttribute('onclick', "BaitChart('ml_10', 'YEAR', 'STANDARD')");
    button.classList.remove('btn-ghost-primary');
    button.classList.add('btn-ghost-info');
  }
}

function fetchData(slug, period, data_type) {
  const url = getBaitChartUrl(slug, period, data_type);

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

function extractData(trap_slug, period, data_type) {
  return fetchData(trap_slug, period, data_type)
    .then(data => {
      const baitInTrap = [];
      const visitTime = [];

      data.forEach(entry => {
        baitInTrap.push(entry.bait_in_trap);
        visitTime.push(entry.visit_time);
      });

      return { baitInTrap, visitTime };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function getBaitAndVisitTime(trap_slug, period, data_type) {
  return extractData(trap_slug, period, data_type)
    .then(({ baitInTrap, visitTime }) => {
      return { baitInTrap, visitTime };
    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}


var options = {
  chart: {
    height: 310,
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


var smartTrapTotalChart1 = new ApexCharts(document.querySelector("#bait_chart"), options);
smartTrapTotalChart1.render();


function BaitChart(trap_slug, period, data_type) {
  const yearButton = document.getElementById('yearButton');
  const threeMonthButton = document.getElementById('threeMonthButton');
  const monthButton = document.getElementById('monthButton');

  switch (period) {
    case 'YEAR':
      yearButton.disabled = true;
      threeMonthButton.disabled = false;
      monthButton.disabled = false;
      break;
    case '3MONTH':
      threeMonthButton.disabled = true;
      yearButton.disabled = false;
      monthButton.disabled = false;
      break;
    case 'MONTH':
      monthButton.disabled = true;
      yearButton.disabled = false;
      threeMonthButton.disabled = false;
      break;
    default:
      break;
  }

  extractData(trap_slug, period, data_type)
    .then(({ baitInTrap, visitTime }) => {
      smartTrapTotalChart1.updateOptions({
        xaxis: {
          categories: visitTime
        },
        series: [{
          data: baitInTrap
        }],
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

window.onload = function () {
  BaitChart(slug, "MONTH", "STANDARD");
};
