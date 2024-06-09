import mongoose from "mongoose";

const maquinaSchema=new mongoose.Schema({
    idsedes:{type:mongoose.Schema.Types.ObjectId,ref:'Sede',required:true},
    descripcion:{type:String,required:true},
    ultimoMantenimiento:{type: Date,default:Date.now},
    createdAt:{type:Date,default:Date.now},
    estado:{type:Number,default:1}
})

export default mongoose.model("Maquinas",maquinaSchema)