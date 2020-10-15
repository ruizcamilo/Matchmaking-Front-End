import { Mensaje } from './mensaje';

export class Chat {

  constructor(
    public integrantes : string[],
    public mensajes : Mensaje[],
    public id : string,
    public ultimomsj: string ){}
}
