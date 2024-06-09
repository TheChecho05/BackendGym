    import Pagos from "../models/pagos.js";
    import Plan from "../models/plan.js";
    import mongoose from "mongoose";
    
const httpPagos = {
    // Obtener todos los pagos
    getPagos: async (req, res) => {
        try {
            const pagos = await Pagos.find()
            .populate("idCliente")
            .populate("idPlan")
            res.json({ pagos });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los pagos" });
        }
    },

    // Obtener un pago por su ID
    getPagoByID: async (req, res) => {
        try {
            const { id } = req.params;
            const pago = await Pagos.findById(id);
            if (!pago) {
                return res.status(404).json({ error: "Pago no encontrado" });
            }
            res.json({ pago });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el pago" });
        }
    },

    // Crear un nuevo pago
    postPago: async (req, res) => {
        try {
            const { idCliente, idPlan } = req.body;

            // Obtener el valor del plan
            const plan = await Plan.findById(idPlan);
            if (!plan) {
                return res.status(404).json({ error: "Plan no encontrado" });
            }

            // Crear el nuevo pago con valor inicial en 0
            const nuevoPago = new Pagos({ idCliente, idPlan, valor: 0 });
            
            // Sumar el valor del plan al valor del pago
            nuevoPago.valor += plan.valor;

            await nuevoPago.save();
            res.status(201).json({ nuevoPago });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el pago" });
        }
    },

    // Actualizar un pago existente
    putPago: async (req, res) => {
        try {
            const { id } = req.params;
            const { idCliente, idPlan, valor, estado } = req.body;
            const pagoActualizado = await Pagos.findByIdAndUpdate(id, { idCliente, idPlan, valor, estado }, { new: true });
            res.json({ pagoActualizado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar el pago" });
        }
    },

    // Obtener el total de los pagos realizados dentro de un rango de fechas dado
    getTotalPagosEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const totalPagos = await Pagos.aggregate([
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
                        total: { $sum: "$valor" }
                    }
                }
            ]);

            const total = totalPagos.length > 0 ? totalPagos[0].total : 0;

            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el total de los pagos" });
        }
    },

    // Obtener el total de los pagos realizados por plan dentro de un rango de fechas dado
    getTotalPagosPorPlanEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin, idPlan } = req.query;
    
            // Crear un objeto de filtro para las fechas
            const filtroFechas = {
                createAt: {
                    $gte: new Date(fechaInicio),
                    $lte: new Date(fechaFin)
                }
            };
    
            // Agregar filtro por idPlan si está presente
            if (idPlan) {
                filtroFechas.idPlan = new mongoose.Types.ObjectId(idPlan);
            }
    
            // Consulta de agregación para obtener el total de pagos por plan entre fechas
            const totalPagosPorPlan = await Pagos.aggregate([
                { $match: filtroFechas }, // Aplicar filtro por fechas y/o idPlan
                { $group: { _id: "$idPlan", total: { $sum: "$valor" } } }
            ]);
    
            res.json({ totalPagosPorPlan });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error al obtener el total de los pagos por plan" });
        }
    },

     // Obtener el total pagado por cada cliente
     getTotalPagosPorCliente: async (req, res) => {
        try {
            const { idCliente } = req.query;
    
            // Crear filtro por idCliente si esta presente
            const filtroIdCliente = idCliente ? { idCliente: new mongoose.Types.ObjectId(idCliente) } : {};
    
            // Consulta de agregacion para obtener el total de pagos por cliente
            const totalPagosPorCliente = await Pagos.aggregate([
                { $match: filtroIdCliente }, // Aplicar filtro por idCliente si esta presente
                { $group: { _id: "$idCliente", total: { $sum: "$valor" } } }
            ]);
    
            res.json({ totalPagosPorCliente });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el total de los pagos por cliente" });
        }
    }
    
};

export default httpPagos;
