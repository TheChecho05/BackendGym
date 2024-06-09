import mongoose from "mongoose";

const ingresoSchema=new mongoose.Schema({
    idsedes:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Sede"},
    idcliente:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Cliente"},
    createdAt:{type:Date,default:Date.now }
})

export default mongoose.model("Ingreso",ingresoSchema)