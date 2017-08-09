"use strict";

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', function (err){
    if(err){
        throw err;
    }
    else{
        console.log('La base de datos se conecto correctamente...');

        app.listen(port, function(){
            console.log("Servidor del API Rest de música escuchando por el puerto: "+port);
        });
    }
});
