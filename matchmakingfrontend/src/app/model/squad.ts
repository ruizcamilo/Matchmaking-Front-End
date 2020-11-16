import { Person } from './person';
export class Squad {
  constructor(
    public id_squad: string,
    public admin: string,
    public integrantes: Person[],
    public chat_id: string,
    public nombre: string,
    public imagen: string,
    public visibilidad: boolean
) {}
}
