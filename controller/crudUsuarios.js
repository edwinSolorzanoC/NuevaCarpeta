
import { conexion } from "../model/conexion.js";
import bcryptjs from 'bcryptjs';
import { body, validationResult } from 'express-validator';


var agregarUsuarios = ({})
var consultarUsuario = ({})
var buscarUsuario = ({})

agregarUsuarios.agregar = [
    // Validaciones
    body('username').trim().isLength({ min: 6 }).withMessage('El nombre de usuario debe tener al menos 6 caracteres'),
    body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/[a-zA-Z]/).withMessage('La contraseña debe contener al menos una letra')
    .matches(/\d/).withMessage('La contraseña debe contener al menos un número'),
    
    async (req, res) => {
        // Manejo de errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('clients/registrarse', { showAlert: true, alertMessage: 'Datos incompletos' });
        }

        const datosUsuario = req.body;
        let nombreUsuario = datosUsuario.username;
        let passwordUsuario = datosUsuario.password;
        
        const buscarNombreUser = "SELECT tb_usuarios_nombre FROM tb_usuarios WHERE tb_usuarios_nombre = ?";
        
        conexion.query(buscarNombreUser, [nombreUsuario], async (error, rows) => {
            if (error) {
                throw error;
            } else {
                if (rows.length > 0) {
                    return res.render('clients/registrarse', { showAlert: true, alertMessage: 'Usuario ya existe' });
                } else {
                    let passwordHash = await bcryptjs.hash(passwordUsuario, 8);
                    const registrarUsuario = "INSERT INTO tb_usuarios(tb_usuarios_nombre, tb_usuarios_contrasenna) VALUES (?, ?)";
                    conexion.query(registrarUsuario, [nombreUsuario, passwordHash], (error) => {
                        if (error) {
                            throw error;
                        } else {
                            res.render('clients/index', { username: nombreUsuario, showAlert: true, icon: 'success', title: 'Registro exitoso', alertMessage: 'Registro exitoso' });
                        }
                    });
                }
            }
        });
    }
];

consultarUsuario.consultar = (req, res) => {

    const datosUsuario = req.body; 

    let nombreUsuario = datosUsuario.username;
    let passwordUsuario = datosUsuario.password;

    let buscarUsuario = "SELECT idtb_usuarios, tb_usuarios_nombre, tb_usuarios_contrasenna FROM tb_usuarios WHERE tb_usuarios_nombre = ?";

    conexion.query(buscarUsuario, [nombreUsuario], async function(error, results) { // Usamos parámetros para evitar inyección SQL
        if (error) {
            throw error;
        } else {
            if (results.length > 0) {
                // Obtener la contraseña encriptada de la base de datos
                let passwordHash = results[0].tb_usuarios_contrasenna;

                // Comparar la contraseña proporcionada con la encriptada
                let isMatch = await bcryptjs.compare(passwordUsuario, passwordHash);

                if (isMatch) {
                    // Si las contraseñas coinciden, iniciar sesión
                    req.session.userId = results[0].idtb_usuarios;
                    res.redirect('/principal'); // Redirigir a la página principal
                } else {
                    // Si las contraseñas no coinciden
                    console.log("Datos incorrectos");
                    return res.render('clients/index', {username: nombreUsuario, showAlert: true , icon: 'error', title: 'Datos Incorrectos', alertMessage: 'intentar nuevamente' });
                    // res.render('clients/index', { username: nombreUsuario });
                }
            } else {
                // Si no se encuentra el usuario
                console.log("Datos incorrectos");
                return res.render('clients/index', {username: nombreUsuario, showAlert: true , icon: 'error', title: 'Datos Incorrectos', alertMessage: 'intentar nuevamente' });
            }
        }
    });
};

buscarUsuario.buscar = (req,res)  => {

    let buscarUsuario = "SELECT tb_usuarios_nombre FROM tb_usuarios WHERE idtb_usuarios = ?";

    conexion.query(buscarUsuario,[req.session.userId], (error, results) => {
        if(error){
            console.log("aca estoy")
            throw error;
        }else{
            console.log("si entre al else")
            res.render('clients/perfil',{ resultadoUsuario: results[0] })
        }
    })
}

export{buscarUsuario}
export{agregarUsuarios}
export{consultarUsuario}

