import Sedes from "../models/sedes.js";

const httpSedes = {
    getSedes: async (req, res) => {
        const {busqueda} = req.query
        const sede = await Sedes.find(
            {
                $or: [
                    {nombre: new RegExp(busqueda, "i") }
                ]
            }
        )
        res.json({ sede })
    },
    getSedesActivos: async (req, res) => {
        const sede = await Sedes.find({estado: 1})
        res.json({ sede })
    },
    getSedesInactivos: async (req, res) => {
        const sede = await Sedes.find({estado: 0})
        res.json({ sede })
    },
    getSedesID: async (req, res) => {
        const {id} = req.params
        const sedes = await Sedes.findById(id)
        res.json({ sedes })
    },
    postSedes: async (req, res) => {
        try {
            const {nombre,direccion,horario,ciudad,telefono}=req.body;
            const sede = new Sedes({nombre,direccion,horario,ciudad,telefono});
            await sede.save()
            console.log(sede);
            res.json({ message: "Sede creada satisfactoriamente", sede });
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: "No se pudo crear la sede" })
        }

    },
    putSedes:async (req, res) => {
        const {id} = req.params;
        const { ...resto} = req.body;
        const sede = await Sedes.findByIdAndUpdate(id, resto, {new: true});
        res.json(sede)
    },
    putSedesActivar:async (req,res) => {
        const {id} = req.params
        const sede = await Sedes.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ sede })
    },
    putSedesDesactivar:async (req,res) => {
        const { id } = req.params
        const sede= await Sedes.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ sede })
    }
}

export default httpSedes