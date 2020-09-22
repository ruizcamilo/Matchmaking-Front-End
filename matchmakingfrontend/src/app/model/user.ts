export class User {
  constructor(
    public apellidos: string,
    public calificacion: number,
    public conexion: number,
    public contrasena: string,
    public correo: string,
    public fecha_nacimiento: string,
    public foto_perfil: string,
    public jugando_id: string,
    public nombre_usuario: string,
    public nombres: string,
    public region_id: string,
    public reportado: boolean
  ) {}
}
