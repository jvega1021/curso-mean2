'use strict';

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty'); //Permite tener un middleware que se pueden subir ficheros a través de http
var md_upload =  multipart({ uploadDir: './uploads/song' });

api.get('/prueba-song', SongController.pruebaSong);
api.post('/save-song', md_auth.ensureAuth, SongController.saveSong);
api.get('/get-song/:id', md_auth.ensureAuth, SongController.getSongById);
api.get('/get-all-songs/:album?', md_auth.ensureAuth, SongController.getAllSongs);

api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong);
module.exports = api;
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFileSong);
api.get('/get-file-song/:songFile', SongController.getSongFile);
