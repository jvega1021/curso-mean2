'use strict';

var express = require('express');
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty'); //Permite tener un middleware que se pueden subir ficheros a través de http
var md_upload =  multipart({ uploadDir: './uploads/users' });

var api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
//Cuando recibe el id, debe ser obligatorio, si quisiera que fuera opcional se deberia poner :id? con la interrogacion al final
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);

module.exports = api;
