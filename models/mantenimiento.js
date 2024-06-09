import mongoose from "mongoose";

const mantenimientoSchema = new mongoose.Schema({
    idmaquina:{type:mongoose.Schema.Types.ObjectId,ref:'Maquinas',required:true},
    descripcion:{type:String,required:true},
    responsable:{type:String,required:true},
    valor:{type:Number,required:true},
    createdAt:{type:Date,default:Date.now},
})


export default mongoose.model("Mantenimiento",mantenimientoSchema)