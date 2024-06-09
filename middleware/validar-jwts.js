import jwt from "jsonwebtoken"
import Usuario from "../models/usuarios.js";

const generarJWT = (uid) => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: "4h"//4h
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token")
            } else {
                resolve(token)
            }
        })
    })

}

const validarJWT = async (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion"
        })
    }

    try { 
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
console.log("uid: ",uid);
        let usuario = await Usuario.findById({ _id: uid });

        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido existencia"//- usuario no existe DB
            })
        }


        if (usuario.estado == 0) {
            return res.status(401).json({
                msg: "Token no válido estado" //- usuario con estado: false
            })
        }

        req.usuario=usuario

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido ni mierda"
        })
    }
}


export { generarJWT, validarJWT }