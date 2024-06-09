import Mantenimiento from "../models/mantenimiento.js"

    const helpersMantenimiento = {
        validarExistaId:async (id)=>{
            const existe = await Mantenimiento.findById(id)
            if (existe==undefined){
                throw new Error ("Id de Mantenimiento no existe")
            }
        }
}

export default helpersMantenimiento