import Proveedores from "../models/proveedores.js";

const httpProveedores = {
    getProveedores: async (req, res) => {
        const {busqueda} = req.query
        const proveedor = await Proveedores.find(
            {
                $or: [
                    {nombre: new RegExp(busqueda, "i") }
                ]
            }
        )
        res.json({ proveedor })
    },
    getProveedoresActivos: async (req, res) => {
        const proveedor = await Proveedores.find({estado: 1})
        res.json({ proveedor })
    },
    getProveedoresInactivos: async (req, res) => {
        const proveedor = await Proveedores.find({estado: 0})
        res.json({ proveedor })
    },
    getProveedoresID: async (req, res) => {
        const {id} = req.params
        const sedes = await Proveedores.findById(id)
        res.json({ sedes })
    },
    postProveedores: async (req, res) => {
        try {
            const {nombre,correo,telefono}=req.body;
            const proveedor = new Proveedores({nombre,correo,telefono});
            await proveedor.save()
            console.log(proveedor);
            res.json({ message: "Proveedor creado satisfactoriamente", proveedor });
        } catch (error) {
            console.log(error);
            res.status(400).json({ err: "No se pudo crear la proveedor" })
        }

    },
    putProveedores:async (req, res) => {
        const {id} = req.params;
        const { ...resto} = req.body;
        const proveedor = await Proveedores.findByIdAndUpdate(id, resto, {new: true});
        res.json(proveedor)
    },
    putProveedoresActivar:async (req,res) => {
        const {id} = req.params
        const proveedor = await Proveedores.findByIdAndUpdate(id, { estado: 1 }, { new: true })
        res.json({ proveedor })
    },
    putProveedoresDesactivar:async (req,res) => {
        const { id } = req.params
        const proveedor= await Proveedores.findByIdAndUpdate(id, { estado: 0 }, { new: true })
        res.json({ proveedor })
    }
}

export default httpProveedores