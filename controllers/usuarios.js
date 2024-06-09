import Usuario from "../models/usuarios.js";
import bcryptjs from "bcryptjs"
import { generarJWT } from '../middleware/validar-jwts.js'

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
    }
}

export default httpUsuarios