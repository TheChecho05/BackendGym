import Proveedor from "../models/proveedores.js";

const helpersProveedor = {
    validarExistaId: async (id) => {
        const existe = await Proveedor.findById(id);
        if (!existe) {
            throw new Error("Id del proveedor no existe");
        }
    },
    validarExistaCorreo: async (correo = '', { req }) => {
        const { id } = req.params;
        const existe = await Proveedor.findOne({ correo });

        if (existe && existe._id.toString() !== id) {
            throw new Error(`El correo ${correo} ya está registrado en otro proveedor.`);
        }
    },
    validarExistaTelefono: async (telefono = '', { req }) => {
        const { id } = req.params;
        const existe = await Proveedor.findOne({ telefono });

        if (existe && existe._id.toString() !== id) {
            throw new Error(`El teléfono ${telefono} ya está registrado en otro proveedor.`);
        }
    }
}

export default helpersProveedor;


