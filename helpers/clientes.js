import Clientes from "../models/clientes.js"

    const helpersClientes = {
        validarExistaIdCliente:async (id)=>{
            const existe = await Clientes.findById(id)
            if (existe==undefined){
                throw new Error ("Id del cliente no existe")
            }
        },
        validarDocumentoUnico: async (numdocumento) => {
            const existe = await Clientes.findOne({ numdocumento });
            if (existe) {
              throw new Error("Este documento ya existe en la base de datos");
            }
        },
}

export default helpersClientes
