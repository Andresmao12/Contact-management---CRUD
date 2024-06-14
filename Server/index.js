const express = require('express');
const cors = require('cors')

const app = express();

app.set('port', 4000);
app.listen(app.get('port'));

console.log('Corriendo servidor en el puerto ' + app.get('port'));

app.use(cors());
app.use(express.json());

const routes = require('./routes/routes')
app.use('/', routes);