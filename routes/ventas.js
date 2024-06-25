import { Router } from "express";
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import helpersVentas from '../helpers/ventas.js';
import httpVenta from "../controllers/ventas.js";
import { validarRol } from "../middleware/rolesPermisos.js";
import {validarJWT } from '../middleware/validar-jwts.js'

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpVenta.getVentas);

router.get("/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de venta inválido").isMongoId(),
  check("id").custom(helpersVentas.validarExistaId),
  validarCampos,
], httpVenta.getVentaByID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("idInventario", "El ID de inventario es requerido").notEmpty(),
  check("idInventario", "El ID de inventario debe ser un ID válido de MongoDB").isMongoId(),
  check("cantidad", "La cantidad es requerida").notEmpty(),
  check("valorUnitario", "El valor unitario es requerido").notEmpty(),
  check("valorUnitario", "El valor unitario debe ser un número válido").isNumeric(),
  validarCampos,
  async (req, res, next) => {
    try {
      const { idInventario, cantidad } = req.body;
      await helpersVentas.validarCantidadInventario(idInventario, cantidad);
      next();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
], httpVenta.postVenta);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de venta inválido").isMongoId(),
  check("id").custom(helpersVentas.validarExistaId),
  check("idInventario", "El ID de inventario es requerido").optional().notEmpty(),
  check("idInventario", "El ID de inventario debe ser un ID válido de MongoDB").optional().isMongoId(),
  check("cantidad", "La cantidad es requerida").optional().notEmpty(),
  check("valorUnitario", "El valor unitario es requerido").optional().notEmpty(),
  check("valorUnitario", "El valor unitario debe ser un número válido").optional().isNumeric(),
  validarCampos,
], httpVenta.putVenta);


router.get("/traer/ventasfechas", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("fechaInicio", "La fecha de inicio es requerida").notEmpty(),
  check("fechaFin", "La fecha de fin es requerida").notEmpty(),
  validarCampos,
], httpVenta.getTotalVentasEntreFechas);

router.get("/ver/ventasProductosfechas", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("fechaInicio", "La fecha de inicio es requerida").notEmpty(),
  check("fechaFin", "La fecha de fin es requerida").notEmpty(),
  validarCampos,
], httpVenta.getTotalVentasPorProductoEntreFechas);

export default router;
