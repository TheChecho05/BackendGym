import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middleware/validar-campos.js';
import httpIngresos from "../controllers/ingresos.js";
import helpersIngreso from "../helpers/ingresos.js";
import helpersSede from "../helpers/sedes.js";
import helpersClientes from "../helpers/clientes.js"; 
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
    check("id", "ID de ingreso invalido").isMongoId().custom(helpersIngreso.validarExistaId), 
    validarCampos,
  ],
  httpIngresos.getIngresosID
);

router.post("/agregar",
  [
    check("idsedes", "ID de sede invalido").isMongoId(),
    check("idcliente", "ID de cliente invalido").isMongoId(),
    check("idsedes").custom(helpersSede.validarExistaId), 
    check("idcliente").custom(helpersClientes.validarExistaIdCliente), 
    validarCampos,
  ],
  httpIngresos.postIngresos
);

router.post("/crear/ingreso",
  [
    check("idsedes", "ID de sede invalido").isMongoId(),
    check("idsedes").custom(helpersSede.validarExistaId), 
    check("numdocumento", "Es obligatorio el documento").not().isEmpty(),
    validarCampos,
  ],
  httpIngresos.postIngresosClientes
);


export default router;


