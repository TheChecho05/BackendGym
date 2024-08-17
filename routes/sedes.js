import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpSedes from '../controllers/sedes.js';
import helpersSede from '../helpers/sedes.js'; // Importa el helper de sedes
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpSedes.getSedes);

router.get("/obt/activos",[
  // validarJWT,
  // validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
],httpSedes.getSedesActivos);

router.get("/obt/inactivos",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
],httpSedes.getSedesInactivos);

router.get("/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede invalido").isMongoId(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersSede.validarExistaId(id); // Valida la existencia del ID de la sede
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpSedes.getSedesID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("nombre", "El nombre es requerido").notEmpty(),
  check("direccion", "La direccion es requerida").notEmpty(),
  check("direccion", "La direccion es requerida").notEmpty(),
  check("ciudad", "La ciudad es requerida").notEmpty(),
  check("telefono", "El telefono es requerido").notEmpty(),
  validarCampos,
], httpSedes.postSedes);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede invalido").isMongoId(),
  check("nombre", "El nombre es requerido").optional().notEmpty(),
  check("direccion", "La direccion es requerida").optional().notEmpty(),
  check("ciudad", "La ciudad es requerida").optional().notEmpty(),
  check("telefono", "El telefono es requerido").optional().notEmpty(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersSede.validarExistaId(id); // Valida la existencia del ID de la sede
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpSedes.putSedes);

router.put("/activar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede invalido").isMongoId(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersSede.validarExistaId(id); // Valida la existencia del ID de la sede
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpSedes.putSedesActivar);

router.put("/desactivar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede inválido").isMongoId(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await helpersSede.validarExistaId(id); // Valida la existencia del ID de la sede
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpSedes.putSedesDesactivar);

export default router;