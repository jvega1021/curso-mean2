'use strict';

var express = require('express'); //Para poder a las rutas se carga express
var ArtistController = require('../controllers/artist'); //Se carga el controlador de artista

var api = express.Router(); //Permite hacer las funciones get, post, put
var md_auth = require('../middlewares/authenticated'); //Para que solo un usuario de prueba pueda ingresar a los metodos

api.get('/get-artist', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);

module.exports = api;
