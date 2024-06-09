import mongoose from "mongoose";

const ventaSchema=new mongoose.Schema({
    idInventario:{type:mongoose.Schema.Types.ObjectId,ref:'Inventario',required:true},
    createAt:{type:Date,default:Date.now},
    cantidad:{type:Number,required:true},
    valorUnitario:{type:Number,required:true},
    total:{type:Number},
})

export default mongoose.model("Venta",ventaSchema)
