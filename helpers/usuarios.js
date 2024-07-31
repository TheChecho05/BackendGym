import Usuario from "../models/usuarios.js"

    const helpersUsuario = {
        validarIdCliente:async (id) =>{
            const existe = await Usuario.findById(id)
            if(existe==undefined){
                throw new Error ("Id no existe")
            }
        },
        validarCorreoUnico:async (correo) =>{
            const unico = await Usuario.findOne({correo})
            if(unico){
                throw new Error ("Correo Existe")
            }
        }
}

export default helpersUsuario