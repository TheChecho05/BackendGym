import mongoose from "mongoose";

const usuarioSchema=new mongoose.Schema({
    idsedes:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Sede"},
    nombre:{type:String,unique:true,required:true},
    correo:{type:String,unique:true,required:true},
    contrasena:{type:String,required:true},
    telefono:{type:String,unique:true,required:true},
    rol:{type:String,required:true},
    estado:{type:Number,default:1}
})

export default mongoose.model("Usuario",usuarioSchema)