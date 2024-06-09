import Clientes from "../models/clientes.js"

    const helpersClientes = {
        validarExistaIdCliente:async (id)=>{
            const existe = await Clientes.findById(id)
            if (existe==undefined){
                throw new Error ("Id del cliente no existe")
            }
        }
}

export default helpersClientes
