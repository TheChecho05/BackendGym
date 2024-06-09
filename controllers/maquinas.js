import Maquinas from "../models/maquinas.js";

const httpMaquinas = {
    getMaquinas: async (req, res) => {
        const {busqueda} = req.query
        const maquina = await Maquinas.find()
        .populate("idsedes")
        res.json({ maquina })
    },
    getMaquinasID: async (req, res) => {
        const {id} = req.params
        const maquinas = await Maquinas.findById(id)
        res.json({ maquinas })
    },
    postMaquinas: async (req, res) => {
        try {
            const {idsedes,descripcion,ultimoMantenimiento}=req.body;
            const maquina = new Maquinas({idsedes,descripcion,ultimoMantenimiento});
            await maquina.save()
            console.log(maquina);
            res.json({ message: "Maquina creada satisfactoriamente", maquina });
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: "No se pudo crear el registro de la maquina" })
        }
    },
    putMaquinas:async (req, res) => {
        const {id} = req.params;
        const {descripcion, ...resto} = req.body;
        const maquina = await Maquinas.findByIdAndUpdate(id,{descripcion, ...resto}, {new: true});
        res.json(maquina)
    },
    putMaquinasActivar:async (req,res) => {
        const {id} = req.params
        const maquina = await Maquinas.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ maquina })
    },
    putMaquinasDesactivar:async (req,res) => {
        const { id } = req.params
        const maquina= await Maquinas.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ maquina })
    }
}

export default httpMaquinas