'use strict';

var bcrypt = require('bcrypt-nodejs'); //Trayendo el modulo para encriptar contraseñas
var User = require('../models/user'); //Trayendo el modelo ya creado
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({message: 'Probando una acción del controlador de usuarios del API Rest con Node y MongoDB'});
}

function saveUser(req, res){
    //Método para el registro de usuarios
    var user = new User();

    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password) {
        //Encriptar contraseña
        bcrypt.hash(params.password, null, null, function (err, hash) {
            //La contraseña guardada ahora es igual cl codigo hash
            user.password = hash;

            if (user.name != null && user.surname != null && user.email != null) {
                //Guardar usuario

                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }
                    else {
                        if (!userStored) {
                            res.status(404).send({message: 'No se ha registrado el usuario'});
                        }
                        else {
                            res.status(202).send({user:userStored});
                        }
                    }

                });


            }
            else {
                res.status(200).send({message: 'Parece que hay un campo vacio, introduce todos los campos.'});
            }
        });
    }
    else {
        res.status(200).send({message: 'Introduce la contraseña: '});
    }

}

function loginUser(req, res){
    //Comprueba si el e-mail y la contraseña registradas existen en la base de datos

    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, function(err, user){
        if (err) {
            res.status(500).send({message: 'Error en la petición'});
        }
        else{

            if (!user) {
                res.status(404).send({message: 'El usuario no se encuentra registrado.'});
            }
            else{
                //Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check){
                    if (check) {
                        //Devolver los datos del usuario logueado
                        if (params.gethash) {
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }
                        else {
                            res.status(200).send({user});
                        }
                    }
                    else {
                        res.status(404).send({message: 'Contraseña incorrecta, no se ha podido identificar.'});
                    }
                });
            }

        }
    });
}

function updateUser(req, res){
     var userId = req.params.id; //Se saca de la url el id, el método que se utuliza para modificar es el put
     var update = req.body;

     User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({message: 'Error al actualizar el usuario'});
        }
        else {

            if (!userUpdated) {
                res.status(404).send({message: 'No se ha podido actualizar el usuario'});
            }
            else {
                res.status(200).send({user: userUpdated});
            }
        }
     });
}

function uploadImage(req, res){
    var userId = req.params.id;
    //var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/'); //Divide la ruta de la imagen en un vector
        var file_name = file_split[2]; //Captura el nombre de la imagen con la que fue guardada
        var ext_split = file_name.split('.'); //Hace un nuevo array en donde se captura la extension de la imagen
        var file_ext = ext_split[1]; //Captura la extension de la imagen

        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg') {

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({message: 'No se ha podido actualizar el usuario'});
                }
                else {
                    res.status(404).send({user: userUpdated});
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


module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
};
