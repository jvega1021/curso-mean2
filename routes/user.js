'use strict';

var express = require('express');
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/authenticated');

var api = express.Router();

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
//Cuando recibe el id, debe ser obligatorio, si quisiera que fuera opcional se deberia poner :id? con la interrogacion al final
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);

module.exports = api;
