import Ventas from "../models/ventas.js";
import Inventario from "../models/inventario.js";

const helpersVentas = {
    validarExistaId: async (id) => {
        const existe = await Ventas.findById(id);
        if (!existe) {
            throw new Error("ID de venta no encontrado");
        }
    },

    validarCantidadInventario: async (idInventario, cantidad) => {
        const producto = await Inventario.findById(idInventario);
        if (!producto) {
            throw new Error("El producto no esta en inventario");
        }
        if (producto.cantidad < cantidad) {
            throw new Error("No hay suficiente cantidad en inventario");
        }
    }
};

export default helpersVentas;
