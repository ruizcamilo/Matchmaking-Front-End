import { Person } from './person';

export class Comment {

    constructor(
      public publicacion_id: string,
      public person: Person,
      public comentario: string,
      public fecha: string){
    }
}
