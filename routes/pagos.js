import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middleware/validar-campos.js';
import httpPagos from "../controllers/pagos.js";
import helpersPagos from "../helpers/pagos.js";
import helpersClientes from "../helpers/clientes.js";
import helpersPlan from "../helpers/plan.js";
import {validarJWT } from '../middleware/validar-jwts.js'
import { validarRol } from "../middleware/rolesPermisos.js";

const router = Router();

router.get("/",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
], httpPagos.getPagos);

router.get("/:id",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("id", "ID de pago invalido").isMongoId(),
    validarCampos,
  ],
  httpPagos.getPagoByID
);

router.post("/agregar",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("idCliente", "ID de cliente invalido").isMongoId().custom(helpersClientes.validarExistaIdCliente),
    check("idPlan", "ID de plan invalido").isMongoId().custom(helpersPlan.validarExistaIdPlan),
    validarCampos,
  ],
  httpPagos.postPago
);

router.put("/actualizar/:id",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR"]),
    check("idCliente", "ID de cliente invalido").optional().isMongoId().custom(helpersClientes.validarExistaIdCliente),
    check("idPlan", "ID de plan inválido").optional().isMongoId().custom(helpersPlan.validarExistaIdPlan),
    check("valor", "El valor es requerido").optional().notEmpty().isNumeric(),
    validarCampos,
  ],
  httpPagos.putPago
);


// PAGO PERSOLANIZADAS   
router.get("/traer/totalentrefechas",[
  validarJWT,
  validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
  validarCampos
], httpPagos.getTotalPagosEntreFechas);

router.get("/ver/totalporplanentrefechas",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("idPlan", "ID de plan invalido").isMongoId().custom(helpersPlan.validarExistaIdPlan),
    validarCampos,
  ],
  httpPagos.getTotalPagosPorPlanEntreFechas
);

router.get("/mostrar/totalporcliente",
  [
    validarJWT,
    validarRol(["ADMINISTRADOR","RECEPCIONISTA"]),
    check("idCliente", "ID de cliente inválido").isMongoId().custom(helpersClientes.validarExistaIdCliente),
    validarCampos,
  ],
  httpPagos.getTotalPagosPorCliente
);

export default router;

