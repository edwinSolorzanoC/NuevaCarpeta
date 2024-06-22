
import express from"express";
import session from 'express-session';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
});

//CONFIGURACION SERVIDOS EXPRESS:::::::::::::::::::::::::::::::::

const app = express();

app.set('views', 'views');
app.set("view engine", "ejs");

app.use(express.static('./views'))
app.use(express.static('./controller'))
app.use(express.static('./model'))
app.use(express.static('./public'))

app.use(express.json()); // Middleware integrado en Express para parsear JSON
app.use(express.urlencoded({ extended: true }));// Middleware integrado en Express para parsear URL-encoded

app.use(session({
    secret: 'clavesecretaparalasession',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));


//puerto que se esta escuchando
app.listen(3000,function(){ //8000, 5000...
    console.log("El servido es http://localhost:3000");
}); 

// =>
//MULTER::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const upload = multer({storage});

//RENDERIZACION::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get('/',function(req,res){
    res.render('clients/index')
});

app.get('/registrarse',function(req,res){
    res.render('clients/registrarse')
});
app.get('/agregar',function(req,res){
    res.render('clients/agregar')
});
app.get('/acercaDe',function(req,res){
    res.render('clients/acercaDe')
})

//PETICIONES :::::::::::::::::::::::::::::::::::::::::::::::::::::::::

import { consultaUltimosAutos } from "./controller/crudAutos.js";
app.get('/perfil',function(req,res){

    if (req.session.userId) {
        consultaUltimosAutos.consultar(req,res);
    } else {
        res.redirect('clients/index'); // Redirigir a la página de login si no está autenticado
    }

})

import { leerAutos } from "./controller/crudAutos.js";
app.get('/principal',function(req,res){

    if (req.session.userId) {

        leerAutos.leer(req, res);
    } else {
        res.redirect('clients/index'); // Redirigir a la página de login si no está autenticado
    }

})

import { agregarUsuarios } from "./controller/crudUsuarios.js";
app.post("/ingresar",agregarUsuarios.agregar);

import { agregarAuto } from "./controller/crudAutos.js";
 app.post("/nuevoAuto", upload.single('imagen'), agregarAuto.agregar);

import { consultarUsuario } from "./controller/crudUsuarios.js";
app.post("/consultar",consultarUsuario.consultar);

/**
 * INVESTIGAR SOBRE ROUTERS PARA NODE.JS
 * 
 */