import  express  from "express"
import 'dotenv/config'
import dbConexion from "./database/cnxmongoose.js"

import clientes from "./routes/clientes.js"
import ingresos from "./routes/ingresos.js"
import inventario from "./routes/inventario.js" 
import mantenimientos from "./routes/mantenimientos.js"
import maquinas from "./routes/maquinas.js"
import pagos from "./routes/pagos.js"
import plan from "./routes/plan.js"
import sedes from "./routes/sedes.js"
import Usuario from "./routes/usuarios.js"
import ventas from "./routes/ventas.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/clientes",clientes)
app.use("/api/ingresos",ingresos)
app.use("/api/inventario",inventario)
app.use("/api/mantenimientos",mantenimientos)
app.use("/api/maquinas",maquinas)
app.use("/api/pagos",pagos)
app.use("/api/plan",plan)
app.use("/api/sedes",sedes)
app.use("/api/usuarios",Usuario)
app.use("/api/ventas",ventas)


app.listen(process.env.PORT,()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    dbConexion()
})
