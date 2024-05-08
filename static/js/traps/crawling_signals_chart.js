function fetchData(slug, period) {
    const url = `/api/crawling-chart-data/${slug}/${period}`;
  
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
  
  function extractData(trap_slug, period) {
    return fetchData(trap_slug, period)
        .then(data => {
          const insects_amount = [];
          const visitTime = [];
          
          data.forEach(entry => {
              insects_amount.push(entry.insects_amount);
              visitTime.push(entry.visit_time);
          });
  
          return { insects_amount, visitTime };
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
  }
  
  function getBaitAndVisitTime(trap_slug, period) {
    return extractData(trap_slug, period)
      .then(({ insects_amount, visitTime }) => {
        return { insects_amount, visitTime };
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
    
    
    var chart_crawling_ml = new ApexCharts(document.querySelector("#crawling_chart"), options);
    chart_crawling_ml.render();
  
  
    function BaitChart(trap_slug, period) {
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
      
      extractData(trap_slug, period)
        .then(({ insects_amount, visitTime }) => {
            console.log(visitTime);
            console.log(insects_amount);
            chart_crawling_ml.updateOptions({
            xaxis: {
              categories: visitTime
            },
            series: [{
              data: insects_amount
            }],
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    window.onload = function() {
      BaitChart(slug, "MONTH");
    };