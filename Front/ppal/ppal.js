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
  dropArea.querySelector(".fa-upload").classList.remove("hidden");

  inpFile.files = e.dataTransfer.files;

  const URLimage = URL.createObjectURL(inpFile.files[0]);
  dropArea.style.backgroundImage = `url(${URLimage})`;
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

  const res = await fetch(url + `/search?name=${encodeURIComponent(valueSearch)}`);

  const data = await res.json();

  if (res.status == 200) {
    let elements = ``;

    data.data.forEach((contact) => {
      const element = `
      <div class="contacto" data-id="${contact.Id}">
          <div class="photo" style = "background-image: url(${contact.photo});"></div>
          <div class="data">
            <h5>${contact.name}</h5>
            <p>telefono:${contact.phone}</p>
          </div>
          <div class="btn-cont">
            <button class="button btn-red btn-trash" data-id="${contact.Id}">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button class="button btn-blue btn-edit" data-id="${contact.Id}">
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
});

inpSearch.addEventListener("input", () => {
  btnSearch.click();
});

async function update() {
  const res = await fetch(url + "/returnAll");
  const data = await res.json();

  if (res.status == 200) {
    let elements = ``;

    data.data.forEach((contact) => {
      const element = `
      <div class="contacto" data-id="${contact.Id}">
          <div class="photo" style = "background-image: url(${contact.photo});"></div>
          <div class="data">
            <h5>${contact.name}</h5>
            <p>telefono:${contact.phone}</p>
          </div>
          <div class="btn-cont">
            <button class="button btn-red btn-trash" data-id="${contact.Id}">
              <i class="fa-solid fa-trash"></i>
            </button>
            <button class="button btn-blue btn-edit" data-id="${contact.Id}">
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

inpFile.addEventListener("change", () => {
  const URLimage = URL.createObjectURL(inpFile.files[0]);
  dropArea.style.backgroundImage = `url(${URLimage})`;
});

const contactArea = document.querySelector(".contact-container");

contactArea.addEventListener("click", (e) => {
  const trash = e.target.closest(".btn-trash");
  const edit = e.target.closest(".btn-edit");

  if (trash) {
    const id = trash.getAttribute("data-id");
    deleteContact(id);
  } else if (edit) {
    const id = edit.getAttribute("data-id");
    editContact(id);
  }
});

async function deleteContact(id) {
  const res = await fetch(url + "/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();

  if (res.status == 200) {
    console.log("Se elimino correctamente");
    update();
  } else if (res.status == 400) {
    console.log("Ocurio un error eliminando");
  }
}

const screenEdit = document.querySelector(".edit-cont");
const btnClose2 = document.getElementById("btnClose2");

btnClose2.addEventListener("click", () => {
  screenEdit.classList.add("addHidden");
});

async function editContact(id) {
  screenEdit.classList.remove("addHidden");

  document.querySelector(".btnEdit").addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("editName").value;
    const phone = document.getElementById("editPhone").value;
    console.log(name, phone);
    const res = await fetch(url + "/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, phone }),
    });

    const data = await res.json();

    if (res.status == 200) {
      update();
    } else {
      console.log(data.message);
    }
  });
}
