const btnImagesAndNames = [
    {
      "title": "Сила та фізична активність",
      "db_name": "str",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
    {
      "title": "Відновлення регенерація",
      "db_name": "regen",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
    {
      "title": "М'язова сила",
      "db_name": "muscles",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
    {
      "title": "Жировий обмін та дієта",
      "db_name": "diet",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
    {
      "title": "Розумова енергія та концентраці",
      "db_name": "brain",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
    {
      "title": "Здоров'я та біологічна активність",
      "db_name": "health",
      "image": "https://png.pngtree.com/png-clipart/20220117/original/pngtree-cartoon-elements-of-human-muscle-png-image_7142853.png"
    },
]

function createAimButtons() {
  const buttonsContainer = document.getElementById("aimButtons")

  btnImagesAndNames.map(btn => (
    buttonsContainer.innerHTML += `
    <div class="col-6 d-flex justify-content-center">
        <a href="javascript:void(0);" onclick="goodCardsList('${goodCardsListUrl(orderBy, null, null, filterBy, btn.db_name)}', true)">
            <div style="position: relative; height: 140px; width: 180px;">
              <div class="shadow-lg" id="box">
                <p
                  style="margin-left: 15px; font-size: 15px; font-weight: bold; color: #2995b3; text-wrap: pretty; max-width: 60%;"
                  class="mt-3"
                >
                  ${btn.title}
                </p>
              </div>
              <img
                style="height: auto; width: 110px; position: absolute; bottom: 25px; right: -20px;"
                src=${btn.image}
                alt=""
              >
            </div>
          </a>
        </div>
    `
  )) 
}