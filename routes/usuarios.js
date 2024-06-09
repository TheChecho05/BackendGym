import {Router} from "express";
import { check } from "express-validator";
import { validarCampos } from '../middleware/validar-campos.js';
import httpUsuarios from "../controllers/usuarios.js";
import helpersUsuario from "../helpers/usuarios.js";
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

// const rolesPermitidos = ['1', '2'];

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR",]),
],httpUsuarios.getUsuarios);

router.get("/:id",[
  validarJWT,
  validarRol(["ADMINISTRADOR",]),
], httpUsuarios.getUsuariosID);
//recepcionista, administrador, entrenador
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

export default router;