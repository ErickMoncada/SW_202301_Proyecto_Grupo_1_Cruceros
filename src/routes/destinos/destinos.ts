import express from 'express';
const router = express.Router();
import { DestinosDao } from '@dao/models/Destinos/DestinosDao';
import { MongoDBConn } from '@dao/MongoDBConn';
import { IDestinos } from '@dao/models/Destinos/IDestinos';
import { Destinos } from '@libs/Destinos/Destinos';
const DestinoDao = new DestinosDao(MongoDBConn);
let destinosModel:Destinos;
DestinoDao.init().then(()=>{
  destinosModel = new Destinos(DestinoDao);
});

//registrar los endpoint en router
//http://localhost:3001/Destinos
router.get('/', (_req, res)=>{
  const jsonUrls = {
    "getAll": {"method":"get", "url": "Destinos/all"},
    "getById": {"method":"get", "url": "Destinos/byid/:id"},
    "new": {"method":"post", "url": "Destinos/new"},
    "update": {"method":"put", "url": "Destinos/upd/:id"},
    "delete": {"method":"delete", "url": "Destinos/del/:id"},
  };
  res.status(200).json(jsonUrls);
});

router.get('/all', async (_req, res) => {
  res.status(200).json(await destinosModel.getAll());
});

router.get('/byid/:id', async (req, res)=>{
  const {id: codigo} = req.params;
  const empresa = await destinosModel.getById(codigo);
  if(empresa){
    return res.status(200).json(empresa);
  }
  return res.status(404).json({"error":"No se encontró Destino"});
});

router.post('/new', async (req, res) => {
  const {
    pais = "---indefinido---",
    status ="---indefinido---",
    fechaComienzo="---indefinido---"
  } = req.body;

  if (
    pais === "---indefinido---" || status === "---indefinido---" || fechaComienzo === "---indefinido---"
  ) {
    return res.status(403).json({"error":"Debe venir el pais, status y fecha de comienzo correctos"});
  }
  //TODO: Validar Entrada de datos
  const newDestino: IDestinos = {
    pais,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
    fechaComienzo
  };
  if (await destinosModel.add(newDestino)) {
    return res.status(200).json({"created": true});
  }
  return res.status(404).json(
    {"error": "Error al agregar una nuevo Destino"}
  );
});

router.put('/upd/:id', async (req, res) => {
  const { id } = req.params;
  const {
    pais="---indefinido---",
    status="---indefinido---",
    fechaComienzo="---indefinido---",
  } = req.body;

  if (
    pais === "---indefinido---" || status === "---indefinido---" || fechaComienzo === "---indefinido---"
  ) {
    return res.status(403).json({"error":"Debe venir el pais, status y fecha de comienzo correctos"});
  }
  const UpdateDestino : IDestinos = {
    pais,
    status,
    updatedAt: new Date(),
    fechaComienzo,
  };

  if (await destinosModel.update(id, UpdateDestino)) {
    return res
      .status(200)
      .json({"updated": true});
  }
  return res
    .status(404)
    .json(
      {
        "error": "Error al actualizar Destino"
      }
    );
});

router.delete('/del/:id', async (req, res)=>{
  const {id } = req.params;
  if(await destinosModel.delete(id)){
    return res.status(200).json({"deleted": true});
  }
  return res.status(404).json({"error":"No se pudo eliminar Destino"});
});
export default router;
