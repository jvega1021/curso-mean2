'use strict';

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function pruebaArtist(req, res){
    res.status(200).send({message: "Método de prueba del controlador artist.js"});
}

function saveArtist(req, res){

    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({message: 'Error al guardar el artista'});
        }
        else {
            if (!artistStored) {
                res.status(404).send({message: 'El artista no ha sido guardado'});
            }
            else {
                res.status(200).send({artist: artistStored});
            }
        }
    });
}

//Encontrar un artista por id
function getArtistById (req, res){

    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        }
        else {
            if (!artist) {
                res.status(404).send({message: 'El artista no existe'});
            }
            else {
                res.status(200).send({artist});
            }
        }
    });

}

//Método que trae los artistas por paginación
function getAllArtist (req, res){

    var page;

    if (req.params.page) {

        page = req.params.page;
    }
    else {
        page = 1;
    }

    var itemsPerPage = 4;

    //.sort() es para ordenar en orden alfabetico por name
    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artists, total) => {
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        }
        else {
            if (!artists) {
                res.status(404).send({message: 'No hay artistas.'});
            }
            else {
                return (res.status(200).send({
                    total_items: total,
                    artists: artists
                }));
            }
        }
    });
}

//Método para actualizar un artista o modificar un artista

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    console.log(req.body);

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el artista.'});
        }
        else {
            if (!artistUpdated) {
                res.status(404).send({message: 'El artista no existe'});
            }
            else {
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

//Método para eliminar artistas
function deleteArtist(req, res){

    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({message: 'Error al eliminar el artista.'});
        }
        else {
            if (!artistRemoved) {
                res.status(404).send({message: 'El artista no ha sido eliminado.'});
            }
            else {
                console.log(artistRemoved);

                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
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
                                        res.status(200).send({song: songRemoved});
                                    }
                                }
                            }));
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res){
    var artistId = req.params.id;

        if (req.files) {
            //Para hacer el split solamente se pone el separador
            var file_path = req.files.image.path;
            var file_split = file_path.split('/'); //Divide la ruta de la imagen en un vector
            var file_name = file_split[2]; //Captura el nombre de la imagen con la que fue guardada
            var ext_split = file_name.split('.'); //Hace un nuevo array en donde se captura la extension de la imagen
            var file_ext = ext_split[1]; //Captura la extension de la imagen

            console.log(file_ext);

            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {

                Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                    if (!artistUpdated) {
                        res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                    }
                    else {
                        res.status(200).send({user: artistUpdated});
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
    var path_file = './uploads/artist/'+imageFile; //Esta es la ruta mas el nombre de la imagen

    fs.exists(path_file, function(exists){
        if (exists) {
            res.sendFile(path.resolve(path_file)); //Si la imagen existe se envia de vuelta la imagen con ruta
        }else {
            res.status(200).send({message: 'No existe la imagen'}); //Si no existe envia un mensaje que muestra que la imagen no existe
        }
    });
}

module.exports = {
    pruebaArtist,
    saveArtist,
    getArtistById,
    getAllArtist,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
