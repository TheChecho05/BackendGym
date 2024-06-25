import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middleware/validar-campos.js';
import httpIngresos from "../controllers/ingresos.js";
import helpersIngreso from "../helpers/ingresos.js";
import helpersSede from "../helpers/sedes.js";
import helpersClientes from "../helpers/clientes.js"; // Corregido el nombre del helper de clientes
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpIngresos.getIngresos);

router.get("/:id",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id", "ID de ingreso invalido").isMongoId().custom(helpersIngreso.validarExistaId), // Validar la existencia de la ID de ingreso
    validarCampos,
  ],
  httpIngresos.getIngresosID
);

router.post("/agregar",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("idsedes", "ID de sede invalido").isMongoId(),
    check("idcliente", "ID de cliente invalido").isMongoId(),
    check("idsedes").custom(helpersSede.validarExistaId), // Usamos el helper de sede para validar la sede
    check("idcliente").custom(helpersClientes.validarExistaIdCliente), // Usamos el helper de clientes para validar el cliente
    validarCampos,
  ],
  httpIngresos.postIngresos
);

export default router;


