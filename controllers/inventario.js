import Inventario from "../models/inventario.js";


const httpInventario = {
    // Obtener todos los elementos del inventario
    getInventario: async (req, res) => {
        try {
            const inventario = await Inventario.find();
            res.json({ inventario });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el inventario" });
        }
    },

    // Obtener un elemento del inventario por su ID
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

    // Crear un nuevo elemento en el inventario
    postInventario: async (req, res) => {
        try {
            const { idInventario, descripcion, valor, cantidad } = req.body;
            const nuevoElementoInventario = new Inventario({ idInventario, descripcion, valor, cantidad });
            await nuevoElementoInventario.save();
            res.status(201).json({ nuevoElementoInventario });
        } catch (error) {
            res.status(400).json({ error: "No se pudo crear el elemento en el inventario" });
        }
    },

    // Actualizar un elemento del inventario
    putInventario: async (req, res) => {
        try {
            const { id } = req.params;
            const { idInventario, descripcion, valor, cantidad } = req.body;
            const elementoInventarioActualizado = await Inventario.findByIdAndUpdate(id, { idInventario, descripcion, valor, cantidad }, { new: true });
            res.json({ elementoInventarioActualizado });
        } catch (error) {
            res.status(400).json({ error: "No se pudo actualizar el elemento del inventario" });
        }
    },
    // Consulta para obtener el total del inventario (multiplicando cantidad por valor)
    getTotalInventario: async (req, res) => {
        try {
            const elementosInventario = await Inventario.find();
            const total = elementosInventario.reduce((acc, curr) => acc + curr.valor * curr.cantidad, 0);
            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener el total del inventario" });
        }
    }
};

export default httpInventario;
