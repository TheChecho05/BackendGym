import Mantenimiento from "../models/mantenimiento.js";

const httpMantenimientos = {
    // Obtener todos los mantenimientos
    getMantenimientos: async (req,res) => {
        try {
            const mantenimientos = await Mantenimiento.find()
            .populate("idmaquina")
            res.json({ mantenimientos });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Error al obtener los mantenimientos" });
        }
    },

    getMantenimientoByID: async (req, res) => {
        try {
            const { id } = req.params;
            const mantenimiento = await Mantenimiento.findById(id);
            if (!mantenimiento) {
                return res.status(404).json({ error: "Mantenimiento no encontrado" });
            }
            res.json({ mantenimiento });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el mantenimiento" });
        }
    },

    // Crear un nuevo mantenimiento
    postMantenimiento: async (req, res) => {
        try {
            const { idMantenimiento, idmaquina, descripcion, responsable, valor } = req.body;
            const nuevoMantenimiento = new Mantenimiento({ idMantenimiento, idmaquina, descripcion, responsable, valor });
            await nuevoMantenimiento.save();
            res.status(201).json({ nuevoMantenimiento });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el mantenimiento" });
        }
    },

    // Actualizar un mantenimiento existente
    putMantenimiento: async (req, res) => {
        try {
            const { id } = req.params;
            const { idMantenimiento, idmaquina, descripcion, responsable, valor } = req.body;
            const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(id, { idMantenimiento, idmaquina, descripcion, responsable, valor }, { new: true });
            res.json({ mantenimientoActualizado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar el mantenimiento" });
        }
    },

    // Consulta de valor entre dos fechas
    getValorEntreFechas: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.query;
            const mantenimientos = await Mantenimiento.find({
                createdAt: { $gte: new Date(fechaInicio), $lte: new Date(fechaFin) }
            });
            const totalValor = mantenimientos.reduce((acc, curr) => acc + curr.valor, 0);
            res.json({ totalValor });
        } catch (error) {
            res.status(500).json({ error: "Error al realizar la consulta de valor entre fechas" });
        }
    }
};

export default httpMantenimientos;
