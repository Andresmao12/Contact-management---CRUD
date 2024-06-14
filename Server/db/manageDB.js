const sqlite = require("sqlite3");
const path = require('path')

const db = new sqlite.Database(path.join(__dirname, 'contacts.db'));

const sqlDelete = `DELETE FROM contacts`;

db.run(sqlDelete, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Operation success");
  }
});

db.close(err =>{
    if (err) {
        console.log(err)
    }else{
        console.log("Se cerro la conexion a la bd")
    }
})