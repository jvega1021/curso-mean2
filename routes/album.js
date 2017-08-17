'use strict';

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/prueba-album', md_auth.ensureAuth, AlbumController.pruebaAlbum);
api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/get-album/:id', md_auth.ensureAuth, AlbumController.getAlbumById);
api.get('/get-all-albums/:artist?', md_auth.ensureAuth, AlbumController.getAllAlbums);
api.put('/put-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
module.exports = api;
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum); 
