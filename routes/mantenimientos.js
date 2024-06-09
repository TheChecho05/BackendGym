import { Router } from 'express';
import { check } from 'express-validator';
import httpMantenimientos from '../controllers/mantenimiento.js';
import  {validarCampos } from '../middleware/validar-campos.js';
import helpersMaquinas from '../helpers/maquinas.js'
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpMantenimientos.getMantenimientos);

router.get("/ventasfechas",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check('fechaInicio', 'La fecha de inicio es requerida').notEmpty().isISO8601(),
    check('fechaFin', 'La fecha de fin es requerida').notEmpty().isISO8601(),
    validarCampos,
    httpMantenimientos.getValorEntreFechas
]);

router.get("/:id",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    validarCampos
], httpMantenimientos.getMantenimientoByID);

router.post("/agregar", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check('idmaquina', 'ID de maquina invalido').notEmpty().isMongoId().custom(helpersMaquinas.validarExistaId), // Añadimos la validación de existencia de máquina
    check('descripcion', 'La descripcion es requerida').notEmpty(),
    check('responsable', 'El responsable es requerido').notEmpty(),
    check('valor', 'El valor es requerido').notEmpty().isNumeric(),
    validarCampos,
    httpMantenimientos.postMantenimiento
]);

router.put("/actualizar/:id", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check('idmaquina', 'ID de máquina inválido').optional().isMongoId().custom(helpersMaquinas.validarExistaId), // Añadimos la validación de existencia de máquina
    check('descripcion', 'La descripción es requerida').optional().notEmpty(),
    check('responsable', 'El responsable es requerido').optional().notEmpty(),
    check('valor', 'El valor es requerido').optional().notEmpty().isNumeric(),
    validarCampos,
    httpMantenimientos.putMantenimiento
]);



export default router;
