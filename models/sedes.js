import mongoose from "mongoose";

const SedeSchema=new mongoose.Schema({
    nombre:{type:String,required:true},
    direccion:{type:String,unique:true,required:true},
    ciudad:{type:String,required:true},
    horario:[{
        apertura:{type:String },
        cierre:{type: String }
    }],
    telefono:{type:String,required:true},
    estado:{type:Number,default:1}
})

export default mongoose.model("Sede",SedeSchema)