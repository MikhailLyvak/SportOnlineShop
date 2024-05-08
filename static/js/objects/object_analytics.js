let chart_data_keys = [];
let chart_data_values = [];
let trap_names = [];

const x_line = year_chart_keyss
const y_line = year_chart_valuess
console.log(x_line)
console.log(y_line)

function animateNumbers(values) {
  const obj1 = document.getElementById("max_cought");
  values.length === 0 ? animateValue(obj1, 0, 0) : animateValue(obj1, 0, Math.max(...values));

  const obj2 = document.getElementById("avg_cought");
  values.length === 0 ? animateValue(obj2, 0, 0) : animateValue(obj2, 0, calculateAverage(values));

  const obj3 = document.getElementById("min_cought");
  values.length === 0 ? animateValue(obj3, 0, 0) : animateValue(obj3, 0, Math.min(...values));
}

function calculateAverage(list) {
  if (list.length === 0) {
    return 0;
  }

  const sum = list.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = sum / list.length;
  return average;
}


function getChartRange(data,) {
  const { value: start } = document.getElementById("startDate_2");
  const { value: end } = document.getElementById("endDate_2");

  const days = []
  const values = []

  Object.keys(data).forEach((day) => {
    if (day >= start && day <= end) {
      days.push(day);
      values.push(year_chart_data[day]);
    }
  });

  animateNumbers(values);

  return { days, values };
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
    data: getChartRange(year_chart_data).values
  }],
  labels: getChartRange(year_chart_data).days,
  xaxis: {
    type: 'date',
  }
};


var chart1 = new ApexCharts(document.querySelector("#year_chart"), options);
chart1.render();



function yearDataChart() {
  const { days, values } = getChartRange(year_chart_data);
  console.log(getChartRange(year_chart_data));

  chart1.updateOptions({
    xaxis: {
      categories: days
    },
    series: [{
      data: values
    }],
  });
  animateNumbers(values);
};


window.onload = function() {
  animatedNumers3();
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