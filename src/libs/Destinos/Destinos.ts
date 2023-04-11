import { IDestinos,DefaultDestinos } from "@server/dao/models/Destinos/IDestinos";
import { IDataAccessObject } from "@dao/IDataAccessObject";
export class Destinos {
  private dao: IDataAccessObject;
  constructor(dao: IDataAccessObject) {
    this.dao = dao;
  }
  getAll() {
    return this.dao.findAll();
  }
  getById(id: string) {
    return this.dao.findByID(id);
  }
  add(nuevoDestino: IDestinos) {
    const date = new Date();
    const nueva: IDestinos = {
      ...DefaultDestinos,
      ...nuevoDestino,
      createdAt: date,
      updatedAt: date
    }
    return this.dao.create(nueva);
  }

  update(id: string, updateDestino: IDestinos) {
    const updateObject = { ...updateDestino, updatedAt: new Date() };
    return this.dao.update(id, updateObject);
  }

  delete(id: string) {
    return this.dao.delete(id);
  }
}