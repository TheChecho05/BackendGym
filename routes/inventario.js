import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpInventario from '../controllers/inventario.js';
import helpersInventario from '../helpers/inventario.js'; // Importa el helper de inventario
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpInventario.getInventario);

router.get("/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPSIONISTA"]),
  check("id", "ID de inventario inválido").isMongoId(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersInventario.validarExistaId(id); // Valida la existencia del ID de inventario
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpInventario.getInventarioByID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("descripcion", "La descripción es requerida").notEmpty(),
  check("valor", "El valor es requerido").notEmpty(),
  check("valor", "El valor debe ser un número válido").isNumeric(),
  validarCampos,
], httpInventario.postInventario);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de inventario inválido").isMongoId(),
  validarCampos,
], httpInventario.putInventario);

router.get("/totalInventario",[
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
], httpInventario.getTotalInventario);

export default router;
