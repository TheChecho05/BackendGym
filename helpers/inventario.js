import Inventario from "../models/inventario.js"

const helpersInventario = {
    validarExistaId: async (id) => {
        const existe = await Inventario.findById(id);
        if (!existe) {
            throw new Error("Id no existe");
        }
    },
    verificarVencimiento(fechaVencimiento, diasAviso) {
        // console.log("Fecha de vencimiento:", fechaVencimiento);
        // console.log("Dias de aviso (antes de conversión):", diasAviso);


        const hoy = new Date();
        const fechaVenc = new Date(fechaVencimiento);

        // Verificar si la fecha es válida
        if (isNaN(fechaVenc.getTime())) {
            throw new Error("Fecha de vencimiento no válida.");
        }

        // Convertir y validar días de aviso
        const diasAvisoNum = Number(diasAviso);
        if (isNaN(diasAvisoNum)) {
            throw new Error("Días de aviso no válidos.");
        }

        // Restar los días de aviso a la fecha de vencimiento
        fechaVenc.setDate(fechaVenc.getDate() - diasAvisoNum);

        // if (hoy >= fechaVenc) {
        //     throw new Error(`¡Atención! El producto está próximo a vencer en menos de ${diasAvisoNum} días.`);
        // }

        return true;
    }
}

export default helpersInventario;