import mysql from 'mysql';

//CONEXION A LA BASE DE DATOS:::::::::::::::::::::::::::::::::::
var conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "patodonal26",
    database: "dbmycolection"
});

conexion.connect(function(err){ //erorres en la conexion o no
    if(err){
        console.log("ERROR EN CONCEXION")
       console.log(err)
       
   }else{
         console.log("CONEXION EXITOSA");
     }
 });

 export {conexion}