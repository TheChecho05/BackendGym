import mongoose from "mongoose";

const proveedorSchema=new mongoose.Schema({
    nombre:{type:String,unique:true,required:true},
    correo:{type:String,unique:true,required:true},
    telefono:{type:String,unique:true,required:true},
    estado:{type:Number,default:1}
})

export default mongoose.model("Proveedor",proveedorSchema)