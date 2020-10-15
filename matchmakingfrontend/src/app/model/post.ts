import { Person } from './person';

// tslint:disable: variable-name
export class Post {
    public id: string;
    constructor(
        public person: Person,
        public contenido: string,
        public fecha: string,
        public imagen: string,
        public reportado: boolean,
    ) {}
}
