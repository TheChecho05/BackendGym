import mongoose from "mongoose";

const clienteSchema=new mongoose.Schema({
    idplan:{type:mongoose.Schema.Types.ObjectId,required:true,ref:"Plan"},
    nombre:{type:String,required:true,minlenght:4},
    fechaNacimiento:{type:Date},
    direccion:{type:String,required:true},
    tipodocumento:{type:String,required:true,minlenght:4},
    numdocumento:{type:String,unique:true,minlenght:7,maxlenght:10},
    foto:{type:String,required:true},
    seguimiento:[{
        fechainicio:{type:Date,default:Date.now},
        peso:{type:String,required:true},
        imc:{type:String,required:true},
        rango:{type:String},
        brazo:{type:String,required:true},
        pierna:{type:String,required:true},
        cintura:{type:String,required:true},
        estatura:{type:String,required:true},
    }],
    estado:{type:Number,default:1},
    createdAt:{type:Date,default:Date.now}
})

export default mongoose.model("Cliente",clienteSchema)
