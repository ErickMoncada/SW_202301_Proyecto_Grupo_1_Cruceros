import express from 'express';
const router  = express.Router();

import {validateKeyMiddleWare} from './middlewares/apikeyValidator';
import {validateJwtMiddleWare} from './middlewares/jwtTokenValidator';


// REST API
// Internet  ->  HTTP  ->  REST API JSON ->  DB
// SOAP XML wsdl
// {} -> JSON
// [] -> JSON
// { llave : valor }
// valor: texto, numérico, booleano, array [valores], objeto {llave:valor}

// REST stateless, resource unique representation
// CRUD Create, Read, Update, Delete
//      POST, GET, PUT, DELETE

// http://localhost:3001
router.get('/', (_req, res) => {
  res.json({msg:'Destinos Turisticos'});
 });

// http://localhost:3001/version
router.get('/version', (_req, res)=>{
  const version: string = "1.0.0";
  const jsonResp = {"name":"FODA Be", "version": version};
  // string, number, boolean, types, interfaces, classes, enumerators
  res.json(jsonResp);
 });

import securityRoutes from './security/security';
router.use('/security', validateKeyMiddleWare, securityRoutes);

import destinosRouter from './destinos/destinos';
router.use('/destinos', validateKeyMiddleWare, validateJwtMiddleWare, destinosRouter);





export default router;
