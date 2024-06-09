import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
    descripcion:{type:String,required:true},
    valor:{type:Number,required:true},
    dias:{type:Number,required:true},
    estado:{type:Number,default:1}
})


export default mongoose.model("Plan",planSchema)