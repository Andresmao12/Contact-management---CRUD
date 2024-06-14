const sqlite = require("sqlite3");

const db = new sqlite.Database("db/contacts.db", sqlite.OPEN_READWRITE, (e) => {
  if (e) {
    console.log("An error occurred conecting to the data base" + e);
  } else {
    console.log("Connected with the database");

    const createDB = `
CREATE TABLE IF NOT EXISTS contacts(
    Id INTEGER PRIMARY KEY AUTOINCREMENT,   
    name VARCHAR(30) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    photo VARCHAR(50) NOT NULL
)`;

    db.run(createDB, (err) => {
      if (err) {
        console.log("An error ocurred creating the database" + err);
      } else {
        console.log(
          "The database was created successfully or it was already created"
        );
      }
    });
  }
});

async function add(req, res) {
  const name = req.body.name;
  const phone = req.body.phone;
  const photo = req.file;

  if (name == '' || phone == '' || !photo) {
    return res
      .status(400)
      .send({ status: "error", message: "Data incomplete" });
  }

  const url = await processFile(photo);

  if (!url) {
    return res
      .status(400)
      .send({ status: "error", message: "An error reading file" });
  }

  const addDB = `
    INSERT INTO contacts(name, phone, photo)
    VALUES(?, ?, ?)
    `;

  db.run(addDB, [name, phone, url], (err) => {
    if (err) {
      console.log("An error in the query" + err);
      return res
        .status(400)
        .send({ status: "error", message: "An error in the query" });
    } else {
      return res
      .status(200)
      .send({ status: "success", message: "Se añadio el registro correctamente" });
      // return upload();
    }
  });
}

async function processFile(file) {
  const validExtension = ["image/png", "image/jpeg"];
  const extension = file.mimetype;

  if (!validExtension.includes(extension)) {
    return false;
  }

  return `/images/${file.filename}`;
}

async function returnAll(req, res) {
  const getDB = `
          SELECT * FROM contacts 
          ORDER BY name
      `;
  db.all(getDB, (err, rows) => {
    if (err) {
      console.log("An error occurred while querying the database - search");
      return res
        .status(400)
        .send({ status: "error", message: "An error in the query" });
    } else if (rows.length == 0) {
      return res.status(400).send({
        status: "success",
        message: "Without registers",
        data: undefined,
      });
    } else {
      return res.status(200).send({
        status: "success",
        message: "Conection successfull",
        data: rows,
      });
    }
  });
}

async function search(req, res) {
  const { data } = req.body;

  const searchDB = `
        SELECT * FROM contacts WHERE name LIKE "%?%"
    `;
  db.all(searchDB, [data], (err, rows) => {
    if (err) {
      console.log("An error occurred while querying the database - search");
      return res
        .status(400)
        .send({ status: "error", message: "An error in the query" });
    } else if (!rows) {
      return res.status(200).send({
        status: "success",
        message: "Contact not found",
        data: undefined,
      });
    } else {
      return res.status(200).send({
        status: "success",
        message: "Conection successfull",
        data: rows,
      });
    }
  });
}

module.exports = { add, returnAll };
