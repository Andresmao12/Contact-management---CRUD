const inpSearch = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

const btnPlus = document.getElementById("btnPlus");
const btnClose = document.getElementById("btnClose");
const screenAdd = document.querySelector(".userIn");

const inpName = document.getElementById("name");
const inpPhone = document.getElementById("phone");
const dropArea = document.querySelector(".file");
const inpFile = document.getElementById("inpFile");

const btnAdd = document.getElementById("btnAdd");

const url = "http://127.0.0.1:4000";

update();

btnPlus.addEventListener("click", (e) => {
  e.preventDefault();

  screenAdd.classList.remove("addHidden");
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  screenAdd.classList.add("addHidden");
});

dropArea.addEventListener("click", () => {
  inpFile.click();
});

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();

  dropArea.classList.add("active");
  dropArea.querySelector(".fa-upload").classList.add("hidden");
  dropArea.querySelector("span").textContent = "Drop here";
  dropArea.querySelector("span").classList.remove("hidden");
});

dropArea.addEventListener("dragleave", (e) => {
  e.preventDefault();

  dropArea.classList.remove("active");

  dropArea.querySelector(".fa-upload").classList.remove("hidden");
  dropArea.querySelector("span").textContent = "";
  dropArea.querySelector("span").classList.add("hidden");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();

  dropArea.classList.remove("active");
  dropArea.querySelector("span").textContent = "";
  dropArea.querySelector("span").classList.add("hidden");

  inpFile.files = e.dataTransfer.files;
});

btnAdd.addEventListener("click", async (e) => {
  e.preventDefault();

  const form = document.getElementById("form");
  const formData = new FormData(form);

  console.log(formData.get("name"));
  console.log(formData.get("phone"));
  console.log(formData.get("file"));

  const res = await fetch(url + "/add", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (res.status == 200) {
    update();
  } else {
    console.log(data.message);
  }
});

btnSearch.addEventListener("click", async (e) => {
  e.preventDefault();

  const valueSearch = inpSearch.value;

  const res = fetch(url + "/search", {
    method: "POST",
    headers: "application/json",
    body: JSON.stringify(valueSearch),
  });

  const data = await res.json();

  console.log(data);
});

async function update() {
  const res = await fetch(url + "/returnAll");
  const data = await res.json();

  console.log(data);

  if (res.status == 200) {
    let elements = ``;

    data.data.forEach((contact) => {
      const element = `
      <div class="contacto">
          <div class="photo" style = "background-image: url(${contact.photo});"></div>
          <div class="data">
            <h5>${contact.name}</h5>
            <p>telefono:${contact.phone}</p>
          </div>
          <div class="btn-cont">
            <button class="button btn-red btn-trash">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button class="button btn-blue btn-edit">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </div>
        `;
      elements += element;
    });
    document.querySelector(".contact-container").innerHTML = elements;
  } else if (res.status == 400) {
    document.querySelector(".contact-container").innerHTML =
      "<h4>Without registers</h4>";
  }
}

inpFile.addEventListener("change", async () => {
  const reader = new FileReader();

  const url = await new Promise((rej, res) => {
    reader.onload = () => res(reader.result);
    reader.onerror = () => rej(false);

    reader.readAsDataURL(inpFile.files[0]);
  });

  if (url) {
    dropArea.setAttribute("background-image", `url(${url})`);
  } else {
    console.log("Ocurrio un error leyendo la imagen");
  }
});
