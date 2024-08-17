import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpInventario from '../controllers/inventario.js';
import helpersInventario from '../helpers/inventario.js'; // Importa el helper de inventario
import helpersProveedor from '../helpers/proveedor.js'; // Importa el helper de inventario
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
      await helpersInventario.validarExistaId(id); 
      next();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
], httpInventario.getInventarioByID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR", "RECEPCIONISTA"]),
  check("descripcion", "La descripcion es requerida").notEmpty(),
  check("valor", "El valor es requerido").notEmpty(),
  check("valor", "El valor debe ser un numero valido").isNumeric(),
  check("fechaVencimiento", "La fecha de vencimiento es requerida").notEmpty(),
  check("fechaVencimiento").custom((fechaVencimiento, { req }) => {
    const diasAviso = Number(req.body.diasAviso); // Convertir a numero
    if (isNaN(diasAviso)) {
        throw new Error("Dias de aviso no validos.");
    }
    return helpersInventario.verificarVencimiento(fechaVencimiento, diasAviso);
  }),
  check("diasAviso", "Los dias de aviso son requeridos").notEmpty(),
  check("diasAviso").isNumeric(), // Asegurarse de que sea un numero
  check("idproveedor", "La id del proveedor es necesaria").notEmpty(),
  check("idproveedor").custom(helpersProveedor.validarExistaId),
  validarCampos,
], httpInventario.postInventario);
 

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de inventario invalido").isMongoId(),
  check("idproveedor", "La id del proveedor es necesaria").notEmpty(),
  check("idproveedor").custom(helpersProveedor.validarExistaId),
  validarCampos,
], httpInventario.putInventario);

router.get("/totalInventario",[
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
], httpInventario.getTotalInventario);

export default router;
