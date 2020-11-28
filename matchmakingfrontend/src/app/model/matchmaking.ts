import { Person } from './person';
import { VideoJuego } from 'src/app/model/video-juego';

export class Matchmaking {
    constructor(
      public juegos: string[],
      public plataformas: string[],
      public region: string,
      public person: Person
    ){
    }
}
