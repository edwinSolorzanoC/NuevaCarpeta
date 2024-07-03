import { conexion } from "../model/conexion.js";

var leerAutos = ({})
var agregarAuto = ({})
var consultaUltimosAutos = ({})


leerAutos.leer = (req,res) => {

    const userId = req.session.userId;
    const autosBd = 'SELECT tb_autos_nombre, tb_autos_set, tb_autos_edicion, tb_autos_imagen FROM tb_autos WHERE tb_usuarios_idtb_usuarios = ?;';

    conexion.query(autosBd, [userId], (error, results) => {
        if(error){
            throw error;
        }else{
            const registroExitoso = req.query.registro === 'exitoso';
            res.render('clients/principal', { resultadoAutos: results, registroExitoso }); // Pasar la señal de éxito a la vista; // Pasar la señal de éxito a la vista
            //  res.render('clients/principal',{resultadoAutos:results}) //cada ves que se inicia se muestra el principal y guarda datos en resultadoAutos
        }
    })


};

agregarAuto.agregar = (req,res) => {

    const datosUs = req.body;
    let nombreAuto = datosUs.nameAuto;
    let setAuto = datosUs.set;
    let edicionAuto = datosUs.edicion;
    // let imagenAuto = datosUs.imagen;
    let imagenAuto = req.file ? req.file.key : null;
    let opcionesAuto = datosUs.opciones;

    // Asegúrate de que `req.session.userId` esté presente
    if (!req.session.userId) {
        res.render('clients/index',{ nombreAuto: nombreAuto });
    }

    

    let registrar = "INSERT INTO tb_autos (tb_autos_nombre, tb_autos_set, tb_autos_edicion, tb_autos_imagen, tb_usuarios_idtb_usuarios, tb_autos_especial) VALUES (?, ?, ?, ?, ?, ?)";
    
    // Aquí estamos utilizando los parámetros de consulta para evitar inyecciones SQL y asegurar la correspondencia
    conexion.query(registrar, [nombreAuto, setAuto, edicionAuto, imagenAuto, req.session.userId,opcionesAuto], function(error) {
        if (error) {
            console.log("eerrorr acaa")
            throw error;
        } else {
            console.log("Datos almacenados en la bd");
            res.redirect('/principal?registro=exitoso'); // Redirigir a la página principal con una señal de éxito // Redirigir a la página principal
            //res.redirect('/principal?registro=exitoso', {showAlert: true, icon: 'success', title: 'Ingreso exitoso', alertMessage: 'Nuevo auto en tu coleccion !!' });

        }
    });

};

consultaUltimosAutos.consultar = (req,res) => {
    const userId = req.session.userId;
    const autosBd = 'SELECT tb_autos_imagen FROM tb_autos WHERE tb_usuarios_idtb_usuarios = ? ORDER BY idtb_autos DESC LIMIT 3;';

    conexion.query(autosBd,[userId], (error, results) => {
        if(error){
            throw error;
        }else{
            res.render('clients/perfil',{resultadoAutos:results})
        }
    })
}

export{leerAutos}
export{agregarAuto}
export{consultaUltimosAutos}
