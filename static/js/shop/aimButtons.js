const btnImagesAndNames = [
    {
      "title": "Сила та фізична активність",
      "db_name": "str",
      "image": "/static/images/aimButtons/str.png"
    },
    {
      "title": "Регенерація відновлення",
      "db_name": "regen",
      "image": "/static/images/aimButtons/regen.png"
    },
    {
      "title": "М'язова маса",
      "db_name": "muscles",
      "image": "/static/images/aimButtons/muscle.png"
    },
    {
      "title": "Дієта та жировий обмін",
      "db_name": "diet",
      "image": "/static/images/aimButtons/diet.png"
    },
    {
      "title": "Розумова енергія та концентрація",
      "db_name": "brain",
      "image": "/static/images/aimButtons/brain.png"
    },
    {
      "title": "Здоров'я та біологічна активність",
      "db_name": "health",
      "image": "/static/images/aimButtons/health.png"
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
  if ( window.innerWidth < 1440 ) {
    marginLeft = "12px"
    widthML = "150px"
  }
  
  btnImagesAndNames.map(btn => (
    buttonsContainer.innerHTML += `
    <div class="col-6 d-flex justify-content-center mt-2">
        <a href="javascript:void(0);" onclick="goodCardsList('${goodCardsListUrl(orderBy, null, filterByProducer, filterByType, btn.db_name)}', true)">
            <div style="position: relative; height: 100px; width: ${widthML};">
              <div class="shadow-lg card-animate" id="box">
                <p
                  style="margin-left: ${marginLeft}; font-size: 15px; color: #2995b3; text-wrap: pretty; max-width: 60%;"
                  class="mt-3"
                >
                  ${btn.title}
                </p>
              </div>
              <img
                style="height: auto; width: 70px; position: absolute; bottom: 35px; transform: scaleX(-1); right: -10px;"
                src=${btn.image}
                alt=""
              >
            </div>
          </a>
        </div>
    `
  )) 
}