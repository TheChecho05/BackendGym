import { Router } from "express";
import { check } from 'express-validator';

import  {validarCampos } from '../middleware/validar-campos.js';
import helpersClientes from '../helpers/clientes.js';
import httpClientes from "../controllers/clientes.js";
import helpersPlan from "../helpers/plan.js";
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
],httpClientes.getClientes);

router.get("/:id", [
  // validarJWT,
  // validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check("id", "ID de cliente inválido").isMongoId(),
  check("id").custom(helpersClientes.validarExistaIdCliente),
  validarCampos,
], httpClientes.getClientesID);

router.get("/obt/activos",[
  // validarJWT,
  // validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
],httpClientes.getClientesActivos);

router.get("/obt/inactivos",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
],httpClientes.getClientesInactivos);

router.get('/cumpleanos/fecha', [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check('fechaNacimiento', 'La fecha de nacimiento es requerida').notEmpty(),
httpClientes.listarClientesPorFechaNacimiento]);



router.get('/seguimientos/:id', httpClientes.getSeguimientos);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check("nombre", "El nombre es requerido").notEmpty(),
  check("nombre", "El nombre debe tener al menos 4 caracteres").isLength({ min: 4 }),
  check("direccion", "La direccion es requerida").notEmpty(),
  check("tipodocumento", "El tipo de documento es requerido").notEmpty(),
  check("tipodocumento", "El tipo de documento debe tener al menos 4 caracteres").isLength({ min: 4 }),
  check("numdocumento", "El numero de documento es requerido").notEmpty(),
  check("numdocumento", "El numero de documento debe tener entre 7 y 10 caracteres").isLength({ min: 7, max: 10 }),
  check("numdocumento").custom(helpersClientes.validarDocumentoUnico),
  check("idplan", "Se necesita una mongo ID").custom(helpersPlan.validarExistaIdPlan),
  check("foto", "La foto es requerida").notEmpty(),
  check("fechaNacimiento","La fecha es requerida").notEmpty(),
  check("seguimiento","El campo de seguimiento no esta lleno aun").notEmpty(),
  validarCampos,
], httpClientes.postClientes);

router.post("/seguimiento/agregar/:id" ,[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
],httpClientes.postSeguimientoCliente);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check("id", "ID de cliente inválido").isMongoId(),
  check("id").custom(helpersClientes.validarExistaIdCliente),
  check("numdocumento").custom(helpersClientes.validarDocumentoUnico), 
  validarCampos,
], httpClientes.putClientes);

router.put("/activar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check("id", "ID de cliente inválido").isMongoId(),
  check("id").custom(helpersClientes.validarExistaIdCliente),
  validarCampos,
], httpClientes.putClientesActivar);

router.put("/desactivar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
  check("id", "ID de cliente inválido").isMongoId(),
  check("id").custom(helpersClientes.validarExistaIdCliente),
  validarCampos,
], httpClientes.putClientesDesactivar);

router.get('/traer/totalporplan',[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
], httpClientes.obtenerConteoClientesPorPlan);

router.put('/act/seg/:id',[  
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA","ENTRENADOR"]),
],httpClientes.putClienteSeguimiento);

router.get("/obt/doc/:numdocumento", [
],httpClientes.getClientePorDocumento);

export default router;
