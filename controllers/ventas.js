import Venta from "../models/ventas.js";
import mongoose from "mongoose";
import Inventario from "../models/inventario.js"

const httpVentas = {
    // Obtener todas las ventas
    getVentas: async (req, res) => {
        try {
            const ventas = await Venta.find()
            .populate("idInventario")
            res.json({ ventas });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las ventas" });
        }
    },

    // Obtener una venta por su ID
    getVentaByID: async (req, res) => {
        try {
            const { id } = req.params;
            const venta = await Venta.findById(id);
            if (!venta) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
            res.json({ venta });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener la venta" });
        }
    },

    // Crear una nueva venta
    postVenta: async (req, res) => {
        try {
            // Extraer datos del cuerpo de la solicitud
            const { idInventario, cantidad, valorUnitario } = req.body;
    
            // Validar datos de entrada
            if (!idInventario || !cantidad || !valorUnitario) {
                return res.status(400).json({ error: "Los campos idInventario, cantidad y valorUnitario son requeridos" });
            }
    
            // Buscar el producto en el inventario
            const productoInventario = await Inventario.findById(idInventario);
            if (!productoInventario) {
                return res.status(404).json({ error: "Producto no encontrado en el inventario" });
            }
    
            // Validar cantidad disponible en el inventario
            if (cantidad > productoInventario.cantidad) {
                return res.status(400).json({ error: "La cantidad ingresada es mayor que la cantidad disponible en el inventario" });
            }
    
            // Calcular el total
            const total = cantidad * valorUnitario;
    
            // Crear nueva venta
            const nuevaVenta = new Venta({ idInventario, cantidad, valorUnitario, total });
            await nuevaVenta.save();
    
            // Restar la cantidad vendida del inventario
            productoInventario.cantidad -= cantidad;
            await productoInventario.save();
    
            // Enviar respuesta con la venta creada
            res.status(201).json({ nuevaVenta });
        } catch (error) {
            // Manejar errores
            console.error("Error al crear la venta:", error);
            res.status(500).json({ error: "No se pudo crear la venta" });
        }
    },

    // Actualizar una venta existente
    putVenta: async (req, res) => {
        try {
            const { id } = req.params;
            const { idInventario, cantidad, valorUnitario, total } = req.body;
            const ventaActualizada = await Venta.findByIdAndUpdate(id, { idInventario, cantidad, valorUnitario, total }, { new: true });
            res.json({ ventaActualizada });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar la venta" });
        }
    },

    // Obtener el total de las ventas realizadas dentro de un rango de fechas dado
    getTotalVentasEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const totalVentas = await Venta.aggregate([
                {
                    $match: {
                        createAt: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total" }
                    }
                }
            ]);

            const total = totalVentas.length > 0 ? totalVentas[0].total : 0;

            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el total de las ventas" });
        }
    },

    // Obtener el total de las ventas realizadas de un producto específico dentro de un rango de fechas dado
    getTotalVentasPorProductoEntreFechas: async (req, res) => {
        try {
            const { idInventario, fechaInicio, fechaFin } = req.query;
            const totalVentas = await Venta.aggregate([
                {
                    $match: {
                        idInventario: new mongoose.Types.ObjectId(idInventario),
                        createAt: {
                            $gte: new Date(fechaInicio),
                            $lte: new Date(fechaFin)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$total" }
                    }
                }
            ]);

            const total = totalVentas.length > 0 ? totalVentas[0].total : 0;

            res.json({ total });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener el total de las ventas por producto" });
        }
    }
};

export default httpVentas;
