import Ingreso from "../models/ingresos.js";

const helpersIngreso = {
  validarExistaId: async (id) => {
    try {
      const existe = await Ingreso.findById(id);
      if (!existe) {
        throw new Error("El ID de ingreso no fue encontrado en la base de datos");
      }
    } catch (error) {
      throw new Error(`Error al validar ID de ingreso: ${error.message}`);
    }
  }
};

export default helpersIngreso;
