import mongoose from "mongoose";
import calculatePaymentValueMiddleware from "../middleware/calculatePaymentValue.js"

const pagosSchema= new mongoose.Schema({
    idCliente: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true},
    idPlan: {type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true},
    valor: {type: Number, required: true, default: 0}, // Estableceremos el valor por defecto en 0
    createAt: {type: Date, default: Date.now},
    estado: {type: Number, default: 1}
});

// Anadimos el middleware calculatePaymentValue
pagosSchema.pre('save', calculatePaymentValueMiddleware);

export default mongoose.model("Pagos", pagosSchema);

