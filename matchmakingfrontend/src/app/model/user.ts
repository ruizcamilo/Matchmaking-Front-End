export class User {
  constructor(
    public nombres: string,
    public apellidos: string,
    public fecha_nacimiento: string,
    public nombre_usuario: string,
    public jugando: string,
    public region_id: string,
    public conexion: number,
    public correo: string,
    public foto_perfil: string,
    public reportado: boolean,
    public plataformas: string[]
  ) {}
}
