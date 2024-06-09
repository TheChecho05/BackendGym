import Plan from "../models/plan.js"

    const helpersPlan = {
        validarExistaIdPlan:async (id)=>{
            const existe = await Plan.findById(id)
            if (existe==undefined){
                throw new Error ("Id no existe")
            }
        }
} 

export default helpersPlan