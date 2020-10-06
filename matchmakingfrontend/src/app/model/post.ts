import { Person } from './person';

// tslint:disable: variable-name
export class Post {
    constructor(
        public person: Person,
        public contenido: string,
        public fecha_hora: string,
        public imagen: string,
        public reportado: boolean,
    ) {}
}
