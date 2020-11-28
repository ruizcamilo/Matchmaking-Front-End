import { Person } from './person';
import { Post } from './post';

export class Clan {
    constructor(
        public esPrivado: boolean,
        public person: Person,
        public nombre_clan: string,
        public foto_clan: string,
        public descripcion: string,
    ) {}
}





