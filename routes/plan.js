import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpPlanes from '../controllers/plan.js';
import helpersPlan from '../helpers/plan.js'; // Importa el helper de plan
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpPlanes.getPlanes);

router.get("/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de plan inválido").isMongoId(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersPlan.validarExistaIdPlan(id); // Valida la existencia del ID del plan
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpPlanes.getPlanByID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("descripcion", "La descripción es requerida").notEmpty(),
  check("valor", "El valor es requerido ").notEmpty(),
  check("valor", "El valor debe ser un número válido").isNumeric(),
  check("dias", "Los días son requeridos").notEmpty(),
  check("dias", "Los días deben ser un número válido").isNumeric(),
  validarCampos,
], httpPlanes.postPlan);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("id", "ID de plan inválido").isMongoId(),
  validarCampos,
], httpPlanes.putPlan);

router.put("/activar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("id", "ID de plan inválido").isMongoId(),
  validarCampos,
], httpPlanes.activarPlan);

router.put("/desactivar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("id", "ID de plan inválido").isMongoId(),
  validarCampos,
], httpPlanes.desactivarPlan);

export default router;

