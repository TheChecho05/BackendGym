import mongoose from "mongoose";

const pagosSchema= new mongoose.Schema({
    idCliente: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true},
    idPlan: {type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true},
    valor: {type: Number, default:0}, 
    createAt: {type: Date, default: Date.now},
});

export default mongoose.model("Pagos", pagosSchema);

