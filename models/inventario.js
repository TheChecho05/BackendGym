import mongoose from "mongoose";

const inventarioSchema=new mongoose.Schema({
    descripcion:{type:String,required:true},
    valor:{type:Number,required:true},
    cantidad:{type:Number,default:0}
})


export default mongoose.model("Inventario",inventarioSchema)