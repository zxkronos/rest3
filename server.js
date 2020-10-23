const fs = require('fs');
require('./config/config');
const express = require('express');
const app = express();
const path = require('path');


const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


let historial = [];

const guardarDB = () => {

    let data = JSON.stringify(historial);

    fs.writeFile('db/data.json', data, (err) => {
        if (err) throw new Error('No se pudo grabar', err);
    });

}

const cargarDB = () => {

    try {

        historial = require('./db/data.json');

    } catch (error) {
        historial = [];
    }

}
cargarDB();
app.post('/usuario', function(req, res) {

    cargarDB();
    let body = req.body;
    historial.push(body);
    guardarDB();

    res.status(200).json({
        ok: true,
        mensaje: body
    });

    console.log(body);
});

app.get('/usuario', function(req, res) {
    res.json(historial);
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});