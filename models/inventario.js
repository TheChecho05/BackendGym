import mongoose from "mongoose";

const inventarioSchema=new mongoose.Schema({
    descripcion:{type:String,required:true},
    valor:{type:Number,required:true},
    cantidad:{type:Number,default:0},
    fechaVencimiento:{type:Date,required:true},
    diasAviso:{type:Number,required:true},
    idproveedor:{type:mongoose.Schema.Types.ObjectId,ref:'Proveedor',required:true},
})


export default mongoose.model("Inventario",inventarioSchema)