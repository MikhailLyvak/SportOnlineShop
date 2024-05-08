function newClientsDataUrl(searchValue) {
  // Append search value to the API URL if provided
  return `/api/clients/?page=1${searchValue ? '&search=' + encodeURIComponent(searchValue) : ''}`;
}

let nextUrl = null;
let prevUrl = null;
let currentPage = 1;
let typingTimer;
const doneTypingInterval = 500;


document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchClientCompany").addEventListener("input", function() {
    clearTimeout(typingTimer);
    
    const searchValue = this.value.trim();
    
    typingTimer = setTimeout(function() {
      currentPage = 1;
      const url = newClientsDataUrl(searchValue);
      createAccordionsWithData(url);
    }, doneTypingInterval);
  });

  createAccordionsWithData(newClientsDataUrl());
});


function createAccordionsWithData(url) {
  const accordionContainer = document.getElementById("accordionContainer");
  accordionContainer.style.height = "712px";

  const loader = document.createElement("img");
  loader.src = "/static/images/11.gif";
  loader.alt = "Loading...";
  loader.style.position = "absolute";
  loader.style.top = "50%";
  loader.style.left = "50%";
  loader.style.transform = "translate(-50%, -50%)";
  loader.style.width = "320px"; // Adjust the width as desired
  loader.style.height = "250px";
  accordionContainer.innerHTML = "";
  accordionContainer.appendChild(loader);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      
      accordionContainer.style.height = "";
      accordionContainer.removeChild(loader);
      

      data.results.forEach(item => {
        const customAccordionDiv = document.createElement("div");
        customAccordionDiv.classList.add("mb-3", "accordion", "custom-accordionwithicon", "shadow-lg");
        customAccordionDiv.id = "accordionBordered";

        accordionContainer.appendChild(customAccordionDiv);

        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");

        const accordionHeader = document.createElement("h2");
        accordionHeader.classList.add("accordion-header", "ml_display");
        accordionHeader.id = "accordionborderedExample" + item.id;

        const teamListFilter = document.createElement("div");
        teamListFilter.classList.add("team-list", "list-view-filter");
        teamListFilter.style.width = "100%";

        const card = document.createElement("div");
        card.classList.add("card", "m-0", "team-box");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body", "px-4");

        const row = document.createElement("div");
        row.classList.add("row", "align-items-center", "team-row");

        const colProfile = document.createElement("div");
        colProfile.classList.add("col-lg-3", "col");

        const teamProfileImg = document.createElement("div");
        teamProfileImg.classList.add("team-profile-img");

        const avatar = document.createElement("div");
        avatar.classList.add("avatar-lg", "img-thumbnail", "rounded-circle");
        

        const img = document.createElement("img");
        img.src = "/static/images/clientCompany2.gif";
        img.alt = "";
        img.classList.add("img-fluid", "d-block", "rounded-circle");

        avatar.appendChild(img);

        const teamContent = document.createElement("div");
        teamContent.classList.add("team-content");

        const nameLink = document.createElement("a");
        nameLink.href = "#";
        nameLink.classList.add("text-body", "d-block", "fs-18");
        nameLink.textContent = item.name;

        const objParagraph = document.createElement("p");
        objParagraph.classList.add("text-muted", "mb-0", "fs-14");
        objParagraph.innerHTML = "<em>Об'єкт</em>";

        teamContent.appendChild(nameLink);
        teamContent.appendChild(objParagraph);

        teamProfileImg.appendChild(avatar);
        teamProfileImg.appendChild(teamContent);

        colProfile.appendChild(teamProfileImg);

        

        const colCity = document.createElement("div");
        colCity.classList.add("col-lg-1", "col");

        const cityHeading = document.createElement("h6");
        cityHeading.classList.add("mb-0", "mt-2", "fs-18", "text-center");
        cityHeading.textContent = item.city;

        const cityParagraph = document.createElement("p");
        cityParagraph.classList.add("text-muted", "text-center", "mb-1", "fs-14");
        cityParagraph.innerHTML = "<em>Місто</em>";

        colCity.appendChild(cityHeading);
        colCity.appendChild(cityParagraph);

        const colOwner = document.createElement("div");
        colOwner.classList.add("col-lg-2", "col");

        const ownerHeading = document.createElement("h6");
        ownerHeading.classList.add("mb-0", "mt-2", "fs-18", "text-center");
        ownerHeading.textContent = `${item.owner ? item.owner.last_name + " " + item.owner.first_name : "N/A"}`;

        const ownerParagraph = document.createElement("p");
        ownerParagraph.classList.add("text-muted", "mb-1", "fs-14", "text-center");
        ownerParagraph.innerHTML = "<em>Куратор</em>";

        colOwner.appendChild(ownerHeading);
        colOwner.appendChild(ownerParagraph);

        const colTrapCount = document.createElement("div");
        colTrapCount.classList.add("col-lg-2", "col");

        const trapCountHeading = document.createElement("h6");
        trapCountHeading.classList.add("mb-0", "mt-2", "fs-18", "text-center");
        trapCountHeading.textContent = item.trap_count;

        const trapCountParagraph = document.createElement("p");
        trapCountParagraph.classList.add("text-muted", "mb-1", "fs-14", "text-center");
        trapCountParagraph.innerHTML = "<em>К-ть пасток</em>";

        colTrapCount.appendChild(trapCountHeading);
        colTrapCount.appendChild(trapCountParagraph);

        const colObjectCount = document.createElement("div");
        colObjectCount.classList.add("col-lg-2", "col");

        const objectCountHeading = document.createElement("h6");
        objectCountHeading.classList.add("mb-0", "mt-2", "fs-18", "text-center");
        objectCountHeading.textContent = item.objects_list.length;

        const objectCountParagraph = document.createElement("p");
        objectCountParagraph.classList.add("text-muted", "mb-1", "fs-14", "text-center");
        objectCountParagraph.innerHTML = "<em>К-ть об'єктів</em>";

        colObjectCount.appendChild(objectCountHeading);
        colObjectCount.appendChild(objectCountParagraph);



        const colButton = document.createElement("div");
        colButton.classList.add("col-lg-1", "col");

        const button = document.createElement("button");
        button.classList.add("btn", "btn-ghost-primary", "waves-effect", "waves-light", "m-3");
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#accor_borderedExamplecollapse1_${item.id}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `accor_borderedExamplecollapse1_${item.id}`);
        button.setAttribute("onclick", "toggleIcon(this)");


        row.appendChild(colProfile);
        const colActions = document.createElement("div");
        colActions.classList.add("col-lg-1", "col", "text-center");
        colActions.innerHTML = getClientActions(item.slug, item.id);

        
        
        // Append to parent element
        

        const icon = document.createElement("i");
        icon.classList.add("ri-eye-close-fill", "fs-24");

        button.appendChild(icon);
        colButton.appendChild(button);

        row.appendChild(colProfile);
        row.appendChild(colCity);
        row.appendChild(colOwner);
        row.appendChild(colTrapCount);
        row.appendChild(colObjectCount);
        row.appendChild(colActions);
        row.appendChild(colButton);

        cardBody.appendChild(row);
        card.appendChild(cardBody);
        teamListFilter.appendChild(card);
        accordionHeader.appendChild(teamListFilter);

        const accordionBody = document.createElement("div");
        accordionBody.id = `accor_borderedExamplecollapse1_${item.id}`;
        accordionBody.classList.add("accordion-collapse", "collapse");
        accordionBody.setAttribute("aria-labelledby", `accordionborderedExample${item.id}`);
        accordionBody.setAttribute("data-bs-parent", "#accordionBordered");

        const accordionBodyInner = document.createElement("div");
        accordionBodyInner.classList.add("accordion-body", "border-top", "border-top-dashed", "border-2");
        accordionBodyInner.innerHTML = tableInsideAccordion(item.objects_list, item.slug);

        accordionBody.appendChild(accordionBodyInner);

        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionBody);

        customAccordionDiv.appendChild(accordionItem);

        const deleteModalHtml = generateClientDeleteModal(item.id);
        accordionContainer.insertAdjacentHTML('beforeend', deleteModalHtml);
        
        item.objects_list.forEach(item => {
          const deleteObjectModalHtml = generateObjectDeleteModal(item.id);
          accordionContainer.insertAdjacentHTML('beforeend', deleteObjectModalHtml);
        });
        

      });

      nextUrl = data.next;
      prevUrl = data.previous;

      document.getElementById('page_number').textContent = currentPage + '/' + Math.ceil(data.count / 5);

    }).finally(function() {
      updatePaginationButtons();
    })
};

function updatePaginationButtons() {
  var nextButton = document.getElementById('next_button');
  var prevButton = document.getElementById('prev_button');
  document.getElementById('next_button').innerHTML = 'Next<i class="mdi mdi-chevron-right"></i>';
  document.getElementById('prev_button').innerHTML = '<i class="mdi mdi-chevron-left"></i>Previous';
  nextButton.classList.remove('disabled');
  prevButton.classList.remove('disabled');
  if (!nextUrl) {
      nextButton.classList.add('disabled');
  }
  if (!prevUrl) {
      prevButton.classList.add('disabled');
  }
}

document.getElementById('next_button').addEventListener('click', function () {
  var nextButton = document.getElementById('next_button');
  var prevButton = document.getElementById('prev_button');
  currentPage++;
  nextButton.classList.add('disabled');
  this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  prevButton.classList.add('disabled');
  createAccordionsWithData(nextUrl);
});

document.getElementById('prev_button').addEventListener('click', function () {
  var nextButton = document.getElementById('next_button');
  var prevButton = document.getElementById('prev_button');
  currentPage--;
  prevButton.classList.add('disabled');
  this.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
  nextButton.classList.add('disabled')
  createAccordionsWithData(prevUrl);
});


function tableInsideAccordion(data, company_slug) {
  let tableHTML = `
  <div class="table-responsive">
    <table id="objects_list_table" class="table table-bordered dt-responsive nowrap table-striped table-hover align-middle" style="width:100%">
      <thead class="">
        <tr>
          <th scope="col"  style="width:300px;" class="text-center">Об'єкт</th>
          <th scope="col" class="text-center" style="width:380px;">Місто</th>
          <th scope="col" class="text-center">Власник</th>
          <th scope="col" class="text-center">Куратор</th>
          <th scope="col" class="text-center">Технічний спеціаліст</th>
          <th scope="col" class="text-center">К-ть пасток</th>
          <th scope="col" class="text-center">Подія</th>
        </tr>
      </thead>
      <tbody class="list form-check-all">
  `;

  if (data.length === 0) {
    tableHTML += `
      <tr>
        <td colspan="7" class="text-center">No data yet</td>
      </tr>
    `;
  } else {
    data.forEach(item => {
      tableHTML += `
        <tr>
          <td class="text-center" style="width:300px;">
            <a
                href="/object/traps/${item.slug}" type="button"
                class="m-0 p-0">
              ${item.name}
            </a>
          </td>
          <td class="text-start" style="width:380px;">${item.address}</td>
          <td class="text-center">${item.owner ? item.owner.last_name + ' ' + item.owner.first_name : 'N/A'}</td>
          <td class="text-center">${item.manager ? item.manager.last_name + ' ' + item.manager.first_name : 'N/A'}</td>
          <td class="text-start">${generateTechnicianHTML(item.technicians, item.id, company_slug)}</td>
          <td class="text-center">${item.trap_count}</td>
          <td class="text-center">${objectActions(item.id, item.slug)}</td>
        </tr>
      `;
    });
  }

  tableHTML += `
      </tbody>
    </table>
  </div>
    <a class="btn text-center btn-ghost-success m-1" data-key="t-add" href="/object/create/${company_slug}">
      <i class="ri-add-line align-bottom me-1"></i>${gettext("Add an object")}
    </a>
  `;

  return tableHTML;
}


function toggleIcon(button) {
  var icon = button.querySelector('i');
  if (icon.classList.contains('ri-eye-close-fill')) {
    icon.classList.remove('ri-eye-close-fill');
    icon.classList.add('ri-eye-fill');
  } else {
    icon.classList.remove('ri-eye-fill');
    icon.classList.add('ri-eye-close-fill');
  }
}

function generateTechnicianHTML(technicians, obj_id, company_slug) {
  let technicianHtml = `
    
    <div class="flexed">
      <div class="avatar-group">`;

  technicians.forEach(tech => {
    technicianHtml += `
      <div class="avatar-group-item ${tech.is_lead ? 'gold-border' : ''}">
        <a href="/user/${tech.technician.slug}/detail" target="_blank">
          <img src="${tech.technician.avatar}" alt="${tech.technician.last_name} ${tech.technician.first_name}"
               title="${tech.is_lead ? 'Team lead' : ''} ${tech.technician.last_name} ${tech.technician.first_name}"
               class="rounded-circle avatar-xs">
        </a>
      </div>`;
  });

  technicianHtml += `
      </div>
      <a type="button" class="btn btn-sm btn-rounded btn-soft-success custom-toggle waves-light" 
         href="/company_object/${obj_id}/${company_slug}/add_tech" 
         title=trans 'Add technician to object">
        <span class="icon-on fs-5"><i class="ri-add-circle-fill align-bottom"></i></span>
      </a>
    </div>`;

  return technicianHtml;
}

function getClientActions(clientSlug, clientId) {
  return `
    <div class="dropdown">
      <button aria-expanded="true" aria-haspopup="true"
              class="btn btn-sm text-muted p-1 py-0 text-decoration-none fs-15"
              data-bs-toggle="dropdown">
        <i class="bx bx-dots-horizontal fs-16"></i>
      </button>
      <div class="dropdown-menu dropdown-menu-start">
        <a class="dropdown-item"
          href="/client/add-manager/${clientSlug}/"><i
            class="ri-add-fill align-bottom me-2 text-muted"></i>${gettext("Add manager")}</a>
        <div class="dropdown-divider"></div>
          <a
            class="dropdown-item"
            href="/client/update/${clientSlug}"
          >
            <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>
            ${gettext("Edit")}
          </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" data-bs-target="#remove_${clientId}"
          data-bs-toggle="modal"><i
            class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>
          ${gettext("Remove")}</a>
      </div>
    </div>
  `;
}

function generateClientDeleteModal(companyId) {
  return `
  <div aria-hidden="true" class="modal fade zoomIn" id="remove_${companyId}" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" id="close-modal"
                  type="button"></button>
        </div>
        <div class="modal-body">
          <div class="mt-2 text-center">
            <lord-icon colors="primary:#f7b84b,secondary:#f06548" src="https://cdn.lordicon.com/gsqxdxog.json"
                      style="width:100px;height:100px" trigger="loop"></lord-icon>
            <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>${gettext("Are you sure?")}</h4>
              <p class="text-muted mx-4 mb-0">${gettext("Do you really want to delete this company?")}</p>
            </div>
          </div>
          <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
            <button class="btn w-sm btn-light" data-bs-dismiss="modal" type="button">${gettext("Close")}</button>
            <button class="btn w-sm btn-danger" id="remove-project" onclick="delete_company(${companyId})"
                    type="button">${gettext("Yes, delete!")}
            </button>
          </div>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>
  `
}


function generateObjectDeleteModal(objectId) {
  return `
  <div aria-hidden="true" class="modal fade zoomIn" id="remove_object_${objectId}" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" id="close-modal"
                    type="button"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 text-center">
              <lord-icon colors="primary:#f7b84b,secondary:#f06548" src="https://cdn.lordicon.com/gsqxdxog.json"
                         style="width:100px;height:100px" trigger="loop"></lord-icon>
              <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>${gettext("Are you sure?")}</h4>
                <p class="text-muted mx-4 mb-0">${gettext("Do you really want to delete this company?")}</p>
              </div>
            </div>
            <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
              <button class="btn w-sm btn-light" data-bs-dismiss="modal" type="button">${gettext("Back")}</button>
              <button class="btn w-sm btn-danger" id="remove-project" onclick="deleteObjectML(${objectId})"
                      type="button">${gettext("Yes, remove it!")}
              </button>
            </div>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div>
  `
}

function deleteCompanyML(companyId) {
  console.log(`companyId: ${companyId} was deleted! (emylation)`);
  $("#remove_"+companyId).modal('hide');
}

function deleteObjectML(objectId) {
  console.log(`objectId: ${objectId} was deleted! (emylation)`);
  $("#remove_object_"+objectId).modal('hide');
}

function objectActions(objectID, objectSlug) {
  return `
    <div class="btn-group mt-4 mt-sm-0" role="group">
        <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
            href="/object/${objectSlug}/update" type="button">
          <i class="ri-pencil-fill"></i>
        </a></button>
      <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
          href="/object/traps/${objectSlug}" type="button"
          class="m-0 p-0">
        <i class="ri-eye-fill"></i>
      </a></button>
        <button type="button" class="btn btn-sm btn-ghost-primary btn-icon"><a
            class="remove-item-btn" data-bs-toggle="modal"
            data-bs-target="#DeleteObjectModal__${objectID}" type="button"
        >
          <i class="ri-delete-bin-6-fill"></i>
        </a></button>
    </div>
  `
}