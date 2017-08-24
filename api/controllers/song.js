'use strict';

'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function pruebaSong(req, res){
    res.status(200).send({message: 'Probando una acción del controlador song.js'});
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({message: 'Error en el servidor'});
        }
        else {
            if (!songStored) {
                res.status(404).send({message: 'No se ha guardado la canción'});
            }else {
                res.status(200).send({song: songStored});
            }
        }
    });
}

function getSongById(req, res){
    var songId = req. params.id;
    Song.findById(songId).populate({path: 'album'}).exec((err, album)=>{
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else {
            if (!album) {
                res.status(404).send({message: "No existe el album"});
            }
            else {
                res.status(200).send({album});
            }
        }
    });
}

function getAllSongs(req, res){
    var albumId = req.params.album;
    var find;
    if (!albumId) {
        find = Song.find({}).sort('number');
    }
    else {
        find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec( (err, songs) => {
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else {
            if (!songs) {
                res.status(404).send({message: "No hay canciones"});
            }
            else {
                res.status(200).send({songs});
            }
        }
    });
}


function updateSong(req, res){

    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else {
            if (!songUpdated) {
                res.status(404).send({message: "No se ha actualizado el album"});
            }
            else {
                res.status(200).send({songUpdated});
            }
        }
    });
}

function deleteSong(req, res){

    var songId = req.params.id;

    Song.findByIdAndRemove( songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({message: 'Error al eliminar la canción'});
        }
        else {
            if (!songRemoved) {
                res.status(404).send({message: 'No hay canciones asociadas al album.'});
            }
            else {
                res.status(200).send({song: songRemoved});
            }
        }
    });
}

function uploadFileSong(req, res){
    var songId = req.params.id;

        if (req.files) {
            //Para hacer el split solamente se pone el separador
            var file_path = req.files.file.path;
            var file_split = file_path.split('/'); //Divide la ruta de la imagen en un vector
            var file_name = file_split[2]; //Captura el nombre de la imagen con la que fue guardada
            var ext_split = file_name.split('.'); //Hace un nuevo array en donde se captura la extension de la imagen
            var file_ext = ext_split[1]; //Captura la extension de la imagen

            console.log(file_ext);

            if (file_ext == 'mp3' || file_ext == 'ogg') {

                Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                    if (!songUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar la canción'});
                    }
                    else {
                        res.status(404).send({song: songUpdated});
                    }
                });
            }
            else {
                res.status(200).send({message: 'Extension del archivo no valida.'});
            }
        }
        else {
            res.status(200).send({message: 'No has subido ningun archivo'});
        }
}

function getSongFile(req, res){

    var imageFile = req.params.songFile; //Aqui se recoge el nombre de la imagen junto con su extensión
    var path_file = './uploads/song/'+imageFile; //Esta es la ruta mas el nombre de la imagen

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file)); //Si la imagen existe se envia de vuelta la imagen con ruta
        }else {
            res.status(200).send({message: 'No existe la canción'}); //Si no existe envia un mensaje que muestra que la imagen no existe
        }
    });
}

module.exports = {
    pruebaSong,
    saveSong,
    getSongById,
    getAllSongs,
    updateSong,
    deleteSong,
    uploadFileSong,
    getSongFile
};
