import Plan from "../models/plan.js";

const httpPlanes = {
    // Obtener todos los planes
    getPlanes: async (req, res) => {
        try {
            const planes = await Plan.find();
            res.json({ planes });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener los planes" });
        }
    },

    // Obtener un plan por su ID
    getPlanByID: async (req, res) => {
        try {
            const { id } = req.params;
            const plan = await Plan.findById(id);
            if (!plan) {
                return res.status(404).json({ error: "Plan no encontrado" });
            }
            res.json({ plan });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el plan" });
        }
    },

    // Crear un nuevo plan
    postPlan: async (req, res) => {
        try {
            const { descripcion, valor, dias } = req.body;
            const nuevoPlan = new Plan({ descripcion, valor, dias });
            await nuevoPlan.save();
            res.status(201).json({ nuevoPlan });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el plan" });
        }
    },

    // Actualizar un plan existente
    putPlan: async (req, res) => {
        try {
            const { id } = req.params;
            const { descripcion, valor, dias, estado } = req.body;
            const planActualizado = await Plan.findByIdAndUpdate(id, { descripcion, valor, dias, estado }, { new: true });
            res.json({ planActualizado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar el plan" });
        }
    },

    // Activar un plan
    activarPlan: async (req, res) => {
        try {
            const { id } = req.params;
            const planActivado = await Plan.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            res.json({ planActivado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo activar el plan" });
        }
    },

    // Desactivar un plan
    desactivarPlan: async (req, res) => {
        try {
            const { id } = req.params;
            const planDesactivado = await Plan.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            res.json({ planDesactivado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo desactivar el plan" });
        }
    }
};

export default httpPlanes;
