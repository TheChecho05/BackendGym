import mongoose from "mongoose";
import Pagos from "../models/pagos.js"

const calculatePaymentValueMiddleware = async function(next) {
    try {
        const Plan = mongoose.model('Plan');
        // Buscamos el plan asociado al pago
        const plan = await Plan.findById(this.idPlan);
        if (!plan) {
            throw new Error('Plan no encontrado');
        }
        // Verificar si el valor del plan se esta obteniendo correctamente
        console.log('Valor del plan:', plan.valor);
        // Establecemos el valor del pago basado en el valor del plan
        Pagos.valor = plan.valor;
        next();
    } catch (error) {
        console.error('Error en el middleware:', error);
        next(error);
    }
};

export default calculatePaymentValueMiddleware;

