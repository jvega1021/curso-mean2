'use strict';
var jwt  = require('jwt-simple');
var moment = require('moment');

var secret = 'clave_secreta';

exports.createToken = function (user){

    var payload = { //Datos que se van a codificar
        sub: user._id,  //Se utiliza para guardad el id del registro o id de la bd
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(), //Fecha de creacion del token
        exp: moment().add(30,'days').unix() //Fecha de expiracion del token
    };

    return jwt.encode(payload, secret);
};
