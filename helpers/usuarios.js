import Usuario from "../models/usuarios.js"

    const helpersUsuario = {
        validarCorreoUnico:async (correo) =>{
            const unico = await Usuario.findOne({correo})
            if(unico){
                throw new Error ("Correo Existe")
            }
        },
        validarIdCliente:async (id) =>{
            const existe = await Usuario.findById(id)
            if(existe==undefined){
                throw new Error ("Id no existe")
            }
        }
}

export default helpersUsuario