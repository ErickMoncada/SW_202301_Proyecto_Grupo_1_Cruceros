import { ObjectId } from "mongodb";
import { IAuditable } from "../IAuditable";
export enum EUserState{
  "DIS" = "Disponible",
  "CAN" = "Cancelado",
  "FIN" = "Finalizado"
}
export interface IDestinos extends IAuditable {
  _id?: ObjectId | string;
  pais: string;
  status: string;
  fechaComienzo: string;
}
export const DefaultDestinos:IDestinos={
  pais: "",
  status: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  fechaComienzo: ""
}

