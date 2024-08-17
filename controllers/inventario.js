import cron from 'node-cron'; 
import Inventario from "../models/inventario.js";
import { sendVencimientos } from '../middleware/email.js';


const httpInventario = {
    getInventario: async (req, res) => {
        const {busqueda} = req.query
        const inventario = await Inventario.find()
        .populate("idproveedor")
        res.json({ inventario })
    },
    getInventarioByID: async (req, res) => {
        try {
            const { id } = req.params;
            const elementoInventario = await Inventario.findById(id);
            if (!elementoInventario) {
                return res.status(404).json({ error: "Elemento de inventario no encontrado" });
            }
            res.json({ elementoInventario });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el elemento del inventario" });
        }
    },
    postInventario: async (req, res) => {
        try {
            const { idInventario, descripcion, valor, cantidad, idproveedor,fechaVencimiento,diasAviso } = req.body;
            const nuevoElementoInventario = new Inventario({ idInventario, descripcion, valor, cantidad,idproveedor,fechaVencimiento,diasAviso });
            await nuevoElementoInventario.save();
            res.status(201).json({ nuevoElementoInventario });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el elemento en el inventario" });
        }
    },
    putInventario: async (req, res) => {
        try {
            const { id } = req.params;
            const { idInventario, descripcion, valor, cantidad, idproveedor, fechaVencimiento,diasAviso } = req.body;
            const elementoInventarioActualizado = await Inventario.findByIdAndUpdate(id, { idInventario, descripcion, valor, cantidad, idproveedor,fechaVencimiento,diasAviso }, { new: true });
            res.json({ elementoInventarioActualizado });
        } catch (error) {
            console.log(error);
            res.status(400).json({ error: "No se pudo actualizar el elemento del inventario" });
        }
    },
    getTotalInventario: async (req, res) => {
        try {
            const elementosInventario = await Inventario.find();
            const total = elementosInventario.reduce((acc, curr) => acc + curr.valor * curr.cantidad, 0);
            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el total del inventario" });
        }
    },
    checkVencimiento: async (req, res) => {
        try {
            const productos = await Inventario.find();
            for (let i = 0; i < productos.length; i++) {
                const producto = productos[i];
                const fechaVencimiento = new Date(producto.fechaVencimiento);
                const diasAviso = producto.diasAviso;
    
                fechaVencimiento.setDate(fechaVencimiento.getDate() - diasAviso);
                fechaVencimiento.setHours(0, 0, 0, 0);
    
                const fechaActual = new Date();
                fechaActual.setHours(0, 0, 0, 0);
    
                console.log(fechaVencimiento);
                console.log(fechaActual);
    
                if (fechaVencimiento.getTime() === fechaActual.getTime()) {
                    await sendVencimientos(producto.fechaVencimiento,producto.descripcion);
                    console.log("Notificación enviada");
                }
            } 
        } catch (error) {
            res.status(500).json({ error: "Error papu" });
        }
    },
};
//     verificarVencimientos: async () => {
//         try {
//             const hoy = new Date();
//             const productos = await Inventario.find();
        
//             productos.forEach(producto => {
//                 const fechaVenc = new Date(producto.fechaVencimiento);
//                 const diasAviso = Number(producto.diasAviso);
//                 console.log(fechaVenc)
//                 console.log(diasAviso)

//                 if (isNaN(fechaVenc.getTime())) {
//                     throw new Error("Fecha de vencimiento no válida.");
//                 }
        
//                 // Convertir y validar días de aviso
//                 const diasAvisoNum = Number(diasAviso);
//                 if (isNaN(diasAvisoNum)) {
//                     throw new Error("Días de aviso no válidos.");
//                 }

//                 fechaVenc.setDate(fechaVenc.getDate() - diasAvisoNum);

//                 if (hoy >= fechaVenc && hoy < new Date(fechaVenc.getTime() + (24 * 60 * 60 * 1000))) {
//                     console.log(`¡Atención! El producto "${producto.descripcion}" está próximo a vencer el ${producto.fechaVencimiento.toISOString().split('T')[0]}.`);
//                     // Aquí puedes enviar una alerta por correo, notificación, etc.
//                 }
//             });
//         } catch (error) {
//             console.error('Error al verificar las fechas de vencimiento:', error);
//         }
//     }
    

    // Programar la tarea para que se ejecute diariamente
// Programar la tarea para que se ejecute cada minuto (para pruebas)
 cron.schedule('* * * * *', httpInventario.checkVencimiento);
//minutos - horas - dias - meses - años  
//'0 0 * * *' 24 horas
//'30 2 * * *' 24 horas
//'0 8 * * *' 24 horas 8 de la mañana
//'* * * * *' 24 horas 8 de la mañana
export default httpInventario;
