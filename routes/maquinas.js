import { Router } from 'express'
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpMaquinas from '../controllers/maquinas.js'
import helpersMaquinas from '../helpers/maquinas.js';
import helpersSede from "../helpers/sedes.js"
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router()

router.get("/",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpMaquinas.getMaquinas);

router.get("/obt/activos",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  ],httpMaquinas.getMaquinasActivos);
  
  router.get("/obt/inactivos",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  ],httpMaquinas.getMaquinasInactivos);

router.get("/:id", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id", "ID de maquina invalido").isMongoId(),
    check("id").custom(helpersMaquinas.validarExistaId),
    validarCampos,
], httpMaquinas.getMaquinasID);

router.post("/agregar", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("idsedes", "La id de la sede es necesaria").notEmpty(),
    check("idsedes").custom(helpersSede.validarExistaId),
    check("descripcion", "La descripcion es requerida").notEmpty(),
    validarCampos,
], httpMaquinas.postMaquinas)

router.put("/actualizar/:id",[
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id","ID de la sede no valido").isMongoId(),
    check("id").custom(helpersSede.validarExistaId),
    check("descripcion", "La descripcion es requerida").notEmpty(),
    check("ultimoMantenimiento","La fecha es requerida").notEmpty()
], httpMaquinas.putMaquinas)

router.put("/activar/:id", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id", "ID de maquina inválido").isMongoId(),
    check("id").custom(helpersMaquinas.validarExistaId),
    validarCampos,
], httpMaquinas.putMaquinasActivar)

router.put("/desactivar/:id", [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id", "ID de maquina inválido").isMongoId(),
    check("id").custom(helpersMaquinas.validarExistaId),
    validarCampos,
], httpMaquinas.putMaquinasDesactivar)


export default router