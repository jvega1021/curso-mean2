//Fichero aparte en el que se llama a express, se cargan las rutas y etc, este es aparte del fichero index.js (que es el que se ejecuta)

"use strict";

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras



//rutas base
app.use('/api', user_routes);
app.use('/api', artist_routes);
module.exports = app;
