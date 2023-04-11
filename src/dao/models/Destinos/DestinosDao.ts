import { MongoDAOBase } from "@dao/MongoDAOBase";
import { IDBConnection } from "@server/dao/IDBConnection";
import { IDestinos } from "./IDestinos";

export class DestinosDao extends MongoDAOBase<IDestinos>{
  constructor(conexion: IDBConnection){
      super("destinos", conexion);
  }
}
