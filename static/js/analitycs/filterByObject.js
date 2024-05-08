function printChosenObject() {
  const objectListSelect = document.getElementById('object_list');
  const selectedObject = objectListSelect.value;
  const image = document.getElementById('landingImage');
  const smartTrapsAnalyticsDiv = document.getElementById('smartTrapsAnalyticsDiv');

  if (selectedObject) {
    console.log(`Chosen Object: ${selectedObject}`);
    choosenObjectValue = selectedObject;
    image.style.display = 'none';
    smartTrapsAnalyticsDiv.style.display = 'block';
    SmartTrapTotalChart1('YEAR');
    SmartTrapTimeActivityChart2('YEAR');
    smartTrapAllTrapsChart3('YEAR');
  } else {
    console.log('No object selected.');
    image.style.display = 'block';
    smartTrapsAnalyticsDiv.style.display = 'none';
  }
}

function fetchDataAndPopulateDropdown() {
  // Fetch data from the API endpoint
  fetch(`/api/analitycs/analitics-filter/${service_provider}/`).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Clone the response before reading the JSON data
    const clonedResponse = response.clone();
    return clonedResponse.json();
  }).then(data => {
    const serviceProviderSelect = document.getElementById('service_provider');

    // Populate the service provider dropdown
    data.forEach(provider => {
      const option = document.createElement('option');
      option.value = provider.slug;
      option.textContent = provider.name;
      serviceProviderSelect.appendChild(option);
    });

    $('#object_list').hide();
    $('#object_list_arrow').hide();
    serviceProviderSelect.addEventListener('change', function () {
      const objectListSelect = document.getElementById('object_list');
      objectListSelect.innerHTML = '<option value="">Select Object</option>';

      const selectServiceProviderOption = this.querySelector('option[value=""]');
      if (selectServiceProviderOption) {
        selectServiceProviderOption.remove();
      }
      const serviceProviderSlug = this.value;

      // If a service provider is selected
      if (serviceProviderSlug) {
        // Find the provider data corresponding to the selected slug
        const providerData = data.find(provider => provider.slug === serviceProviderSlug);

        // If provider data is found
        if (providerData) {
          // Add options to the object list select based on provider data
          providerData.object_list.forEach(object => {
            const option = document.createElement('option');
            option.value = object[0];
            option.textContent = object[1];
            objectListSelect.appendChild(option);
          });

          // Enable the object list select
          $('#object_list').show();
          $('#object_list_arrow').show();
          objectListSelect.addEventListener('change', printChosenObject);
        }
      } else {
        // If no service provider is selected, disable the object list select
        $('#object_list').hide();
        $('#object_list_arrow').hide();
      }
    });
  }).catch(error => {
    console.error('Error fetching data:', error);
  });
}



// Call the function on page load
fetchDataAndPopulateDropdown();

