import Ingreso from "../models/ingresos.js";

const httpIngresos = {
    getIngresos: async (req, res) => {
        const ingreso = await Ingreso.find()
        .populate("idsedes")
        .populate("idcliente")
        res.json({ingreso})
    },
    getIngresosID: async (req, res) => {
        const {id} = req.params
        const ingresos = await Ingreso.findById(id)
        res.json({ ingresos })
    },
    postIngresos: async (req, res) => {
        try {
            const {idsedes,idcliente}=req.body;
            const ingreso = new Ingreso({idsedes,idcliente});
            await ingreso.save()
            console.log(ingreso);
            res.json({ message: "Ingreso guardado satisfactoriamente" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: "No se pudo crear el registro" })
        }

    }
    
}

export default httpIngresos