'use strict';

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty'); //Permite tener un middleware que se pueden subir ficheros a través de http
var md_upload =  multipart({ uploadDir: './uploads/artist' });

api.get('/prueba-artist', md_auth.ensureAuth, ArtistController.pruebaArtist);
api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/get-artist/:id', md_auth.ensureAuth, ArtistController.getArtistById);
api.get('/get-all-artists/:page?', md_auth.ensureAuth, ArtistController.getAllArtist);
api.put('/put-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
api.post('/upload-image-artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-image-artist/:imageFile', ArtistController.getImageFile);

module.exports = api;
