import {Router} from "express";
import { check } from "express-validator";
import { validarCampos } from '../middleware/validar-campos.js';
import httpUsuarios from "../controllers/usuarios.js";
import helpersUsuario from "../helpers/usuarios.js";
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
],httpUsuarios.getUsuarios);

router.get("/obt/activos",[
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
],httpUsuarios.getUsuariosActivos);

router.get("/obt/inactivos",[
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
],httpUsuarios.getUsuariosInactivos);

router.get("/:id",[
  validarJWT,
], httpUsuarios.getUsuariosID);

router.post("/agregar",
  [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
    check("idsedes", "ID de sede invalido").isMongoId(),
    check("nombre", "El nombre es requerido").notEmpty(),
    check("correo", "El correo es requerido").notEmpty(),
    check("correo", "Formato de correo electronico invalido").isEmail(),
    check("correo").custom(helpersUsuario.validarCorreoUnico),
    check("contrasena", "La contrasena es requerida").notEmpty(),
    check("telefono", "El telefono es requerido").notEmpty(),
    check("rol", "El rol es requerido").notEmpty(),
    validarCampos,
  ],
  httpUsuarios.postUsuarios
);

router.put("/actualizar/:id",
  [
  validarJWT,
  validarRol(["ADMINISTRADOR"]),
    check("nombre", "El nombreee es requerido").optional().notEmpty(),
    check("correo", "El correo es requerido").optional().notEmpty(),
    check("correo", "Formato de correo electronico invalido").optional().isEmail(),
    check("correo").optional().custom(helpersUsuario.validarCorreoUnico),
    check("contrasena", "La contrasena es requerida").optional().notEmpty(),
    check("telefono", "El teléfono es requerido").optional().notEmpty(),
    validarCampos,
  ],
  httpUsuarios.putUsuarios
);

router.put("/activar/:id",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR"]),
    validarCampos,
  ],
  httpUsuarios.putUsuariosActivar
);

router.put("/desactivar/:id",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR"]),
    validarCampos,
  ],
  httpUsuarios.putUsuariosDesactivar
);

router.post("/login",
  [
    check("correo", "El correo es requerido").optional().notEmpty(),
    check("correo", "Formato de correo electronico invalido").isEmail(),
    // check("correo").optional().custom(helpersUsuario.validarCorreoUnico),
    check("contrasena", "La contrasena es requerida").optional().notEmpty(),
    validarCampos
  ],httpUsuarios.login)

router.post("/contrasena/recuperar",httpUsuarios.enviarEmail)

router.get("/obtener/:correo",httpUsuarios.usuarioGetEmail)

router.put("/cambiar/contrasena",httpUsuarios.usuarioPutPassword)

export default router;