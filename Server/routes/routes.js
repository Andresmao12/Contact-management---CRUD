const routes = require('express').Router();
const mehtods = require('./../actions/methods')
const path = require('path')

const multer = require('multer');
const { METHODS } = require('http');
const upload = multer({dest : path.join(__dirname, ".." ,"images")})

routes.post('/add',upload.single('file'),  mehtods.add);
routes.get('/returnAll', mehtods.returnAll)
routes.delete('/delete', mehtods.deleteContact)

module.exports = routes;