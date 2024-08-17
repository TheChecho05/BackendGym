import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middleware/validar-campos.js';
import httpProveedores from '../controllers/proveedores.js';
import helpersProveedor from '../helpers/proveedor.js'; // Importa el helper de proveedores
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpProveedores.getProveedores);

router.get("/obt/activos",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
],httpProveedores.getProveedoresActivos);

router.get("/obt/inactivos",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
],httpProveedores.getProveedoresInactivos);

router.get("/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede invalido").isMongoId(),
  check("id").custom(helpersProveedor.validarExistaId),
  validarCampos,
], httpProveedores.getProveedoresID);

router.post("/agregar", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("nombre", "El nombre es requerido").notEmpty(),
  check("correo", "El correo es requerido").notEmpty(),
  check("correo").custom(helpersProveedor.validarExistaCorreo),
  check("telefono", "El telefono es requerido").notEmpty(),
  check("telefono").custom(helpersProveedor.validarExistaTelefono),
  validarCampos,
], httpProveedores.postProveedores);

router.put("/actualizar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
  check("id", "ID del proveedor no valido").isMongoId(),
  check("id").custom(helpersProveedor.validarExistaId),
  check("nombre", "El nombre es requerido").notEmpty(),
  check("correo", "El correo es requerido").notEmpty(),
  check("correo").custom(helpersProveedor.validarExistaCorreo),  
  check("telefono", "El telefono es requerido").notEmpty(),
  check("telefono").custom(helpersProveedor.validarExistaTelefono),  
  validarCampos,
], httpProveedores.putProveedores);


router.put("/activar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id", "ID de sede invalido").isMongoId(),
  check("id").custom(helpersProveedor.validarExistaId),
  validarCampos,
], httpProveedores.putProveedoresActivar);

router.put("/desactivar/:id", [
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  check("id","ID del proveedor no valido").isMongoId(),
  check("id").custom(helpersProveedor.validarExistaId),
  validarCampos,
], httpProveedores.putProveedoresDesactivar);

export default router;