import Sede from "../models/sedes.js"

    const helpersSede = {
        validarExistaId:async (id)=>{
            const existe = await Sede.findById(id)
            if (existe==undefined){
                throw new Error ("Id de sede no existe")
            }
        }
}

export default helpersSede