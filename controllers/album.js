'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function pruebaAlbum(req, res){
    res.status(200).send({message: "Método de prueba del controlador album.js"});
}

function saveAlbum(req, res){
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else{
            if (!albumStored) {
                res.status(404).send({message: "No se ha guardado el album."});
            }
            else {
                res.status(200).send({album: albumStored});
            }
        }
    });
}

function getAlbumById (req, res){
    var albumId = req. params.id;
    Album.findById( albumId).populate({path: 'artist'}).exec((err, album)=>{
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

function getAllAlbums(req, res){
    var artistId = req.params.artist;
    var find;
    if (!artistId) {
        //sacar todos los albums de la base de datos
        find = Album.find({}).sort('title');
    }
    else {
        //sacar los albums de un artista en concreto de la base de datos
        find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums)=>{
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else {
            if (!albums) {
                res.status(404).send({message: "No hay albums"});
            }
            else {
                res.status(200).send({albums});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({message: "Error en la petición"});
        }
        else {
            if (!albumUpdated) {
                res.status(404).send({message: "No se ha actualizado el album"});
            }
            else {
                res.status(200).send({albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res){
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
             res.status(500).send({message: 'Error al eliminar el album'});
        }
        else {
            if (!albumRemoved) {

                res.status(404).send({message: 'No hay albums asociados al artista.'});
            }
            else {

                Song.find({album: albumRemoved._id}).remove( (err, songRemoved => {
                    if (err) {
                        res.status(500).send({message: 'Error al eliminar la canción'});
                    }
                    else {
                        if (!songRemoved) {
                            res.status(404).send({message: 'No hay canciones asociadas al album.'});
                        }
                        else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                }));
            }
        }
    });
}


function uploadImage(req, res){
    var albumId = req.params.id;

        if (req.files) {
            //Para hacer el split solamente se pone el separador
            var file_path = req.files.image.path;
            var file_split = file_path.split('/'); //Divide la ruta de la imagen en un vector
            var file_name = file_split[2]; //Captura el nombre de la imagen con la que fue guardada
            var ext_split = file_name.split('.'); //Hace un nuevo array en donde se captura la extension de la imagen
            var file_ext = ext_split[1]; //Captura la extension de la imagen

            console.log(file_ext);

            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {

                Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                    if (!albumUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }
                    else {
                        res.status(404).send({album: albumUpdated});
                    }
                });
            }
            else {
                res.status(200).send({message: 'Extension del archivo no valida.'});
            }
        }
        else {
            res.status(200).send({message: 'No has subido ninguna imagen'});
        }


}

function getImageFile(req, res){
    var imageFile = req.params.imageFile; //Aqui se recoge el nombre de la imagen junto con su extensión
    var path_file = './uploads/album/'+imageFile; //Esta es la ruta mas el nombre de la imagen

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file)); //Si la imagen existe se envia de vuelta la imagen con ruta
        }else {
            res.status(200).send({message: 'No existe la imagen'}); //Si no existe envia un mensaje que muestra que la imagen no existe
        }
    });
}

module.exports = {
    pruebaAlbum,
    saveAlbum,
    getAlbumById,
    getAllAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};
