const btnImagesAndNames = [
    {
      "title": "Сила та фізична активність",
      "db_name": "str",
      "image": "/static/images/muscle-prod.png"
    },
    {
      "title": "Регенерація відновлення",
      "db_name": "regen",
      "image": "/static/images/muscle-prod.png"
    },
    {
      "title": "М'язова сила",
      "db_name": "muscles",
      "image": "/static/images/muscle-prod.png"
    },
    {
      "title": "Дієта та жировий обмін",
      "db_name": "diet",
      "image": "/static/images/muscle-prod.png"
    },
    {
      "title": "Розумова енергія та концентраці",
      "db_name": "brain",
      "image": "/static/images/muscle-prod.png"
    },
    {
      "title": "Здоров'я та біологічна активність",
      "db_name": "health",
      "image": "/static/images/muscle-prod.png"
    },
]

function createAimButtons() {
  const buttonsContainer = document.getElementById("aimButtons")
  let marginLeft = "15px"
  let widthML = "160px"
  if ( window.innerWidth < 342 ) {
    marginLeft = "12px"
    widthML = "150px"
  }
  
  btnImagesAndNames.map(btn => (
    buttonsContainer.innerHTML += `
    <div class="col-6 d-flex justify-content-center">
        <a href="javascript:void(0);" onclick="goodCardsList('${goodCardsListUrl(orderBy, null, filterByProducer, filterByType, btn.db_name)}', true)">
            <div style="position: relative; height: 100px; width: ${widthML};">
              <div class="shadow-lg card-animate" id="box">
                <p
                  style="margin-left: ${marginLeft}; font-size: 13px; font-weight: bold; color: #2995b3; text-wrap: pretty; max-width: 60%;"
                  class="mt-3"
                >
                  ${btn.title}
                </p>
              </div>
              <img
                style="height: auto; width: 70px; position: absolute; bottom: 35px; right: -10px;"
                src=${btn.image}
                alt=""
              >
            </div>
          </a>
        </div>
    `
  )) 
}