import Pagos from "../models/pagos.js"

    const helpersPagos = {
        validarExistaId:async (id)=>{
            const existe = await Pagos.findById(id)
            if (existe==undefined){
                throw new Error ("Id no existe")
            }
        }
} 

export default helpersPagos