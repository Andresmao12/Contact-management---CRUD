const btnPlus = document.getElementById("btnPlus");
const btnClose = document.getElementById("btnClose");
const inpName = document.getElementById("name");
const inpPhone = document.getElementById("phone");
const dropArea = document.querySelector(".file");
const screenAdd = document.querySelector(".userIn");
const inpFile = document.getElementById("inpFile");

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
