import Maquinas from "../models/maquinas.js"

const helpersMaquinas={
    validarExistaId:async (id)=>{
        const existe = await Maquinas.findById(id)
        if (existe==undefined){
            throw new Error ("Id no existe")
        }
    }
}

export default helpersMaquinas