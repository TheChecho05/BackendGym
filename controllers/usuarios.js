import Usuario from "../models/usuarios.js";
import bcryptjs from "bcryptjs"
import { generarJWT } from '../middleware/validar-jwts.js'
import { sendEmail } from "../middleware/email.js";
const httpUsuarios = {
    getUsuarios: async (req, res) => {
        const { busqueda } = req.query
        const usuario = await Usuario.find(
            {
                $or: [
                    { nombre: new RegExp(busqueda, "i") }
                ]
            }
        )
        .populate("idsedes")
        res.json({ usuario })
    },
    getUsuariosActivos: async (req, res) => {
        const usuario = await Usuario.find({estado: 1})
        .populate("idsedes")
        res.json({ usuario })
    },
    getUsuariosInactivos: async (req, res) => {
        const usuario = await Usuario.find({estado: 0})
        .populate("idsedes")
        res.json({ usuario })
    },
    getUsuariosID: async (req, res) => {
        const { id } = req.params
        const usuarios = await Usuario.findById(id)
        res.json({ usuarios })
    },

    postUsuarios: async (req, res) => {
        try {
            const { idsedes, nombre, correo, contrasena, telefono, rol } = req.body
            const salt = bcryptjs.genSaltSync(10);
            const usuario = new Usuario({ idsedes, nombre, correo, contrasena, telefono, rol });
            usuario.contrasena = bcryptjs.hashSync(contrasena, salt)
            await usuario.save()
            console.log(usuario);
            res.json({ message: "Usuario creado satisfactoriamente", usuario });
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: "No se pudo crear el usuario" })
        }

    },
    putUsuarios: async (req, res) => {
        const { id } = req.params;
        const { correo, ...resto } = req.body;
        const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
        res.json({ usuario });
    },
    putUsuariosActivar: async (req, res) => {
        const { id } = req.params
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ usuario })
    },
    putUsuariosDesactivar: async (req, res) => {
        const { id } = req.params
        const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ usuario })
    },
    login: async (req, res) => {
        const { correo, contrasena } = req.body;


        try {
            const usuario = await Usuario.findOne({ correo })
            if (!usuario) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos+"
                })
            }

            const validPassword = bcryptjs.compareSync(contrasena, usuario.contrasena);
            if (!validPassword) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos"
                })
            }


            const token = await generarJWT(usuario._id);
            res.json({
                usuario,
                token
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({


                msg: "Hable con el WebMaster"
            })
        }
    },
    enviarEmail:async (req, res) => {
        try {
            const { correo } = req.body;
            await sendEmail(correo);
            res.status(200).json({ success: true });
        } catch (error) {
            console.error("Error en el controlador enviarEmail:", error);
            res.status(500).json({ success: false, error: "Error al enviar el correo" });
        }
    },
    usuarioGetEmail:async (req,res) => {
        const {correo}=req.params
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            res.json({
                "msg":"No ha encontrado el correo"
            })
        }else{
            res.json({
                usuario
            })
        }
    },
    usuarioPutPassword:async(req,res)=>{
        try {
            const { correo, contrasena } = req.body;
            const salt = bcryptjs.genSaltSync(10);
            const usuario = await Usuario.findOne({ correo: correo});
    
            if (!usuario) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }
            usuario.contrasena = bcryptjs.hashSync(contrasena, salt);
            await usuario.save();
    
            return res.status(200).json({ msg: 'Contraseña actualizada correctamente' });
        } catch (error) {
            return res.status(500).json({ msg: 'Error interno del servidor', error });
        }
    }
}

export default httpUsuarios