'use strict';

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty'); //Permite tener un middleware que se pueden subir ficheros a través de http
var md_upload =  multipart({ uploadDir: './uploads/album' });

api.get('/prueba-album', md_auth.ensureAuth, AlbumController.pruebaAlbum);
api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/get-album/:id', md_auth.ensureAuth, AlbumController.getAlbumById);
api.get('/get-all-albums/:artist?', md_auth.ensureAuth, AlbumController.getAllAlbums);
api.put('/put-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;
