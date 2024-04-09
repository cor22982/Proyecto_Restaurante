// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function register(user, password_md5,rol) {
  const result = await conn.query('INSERT INTO personal (nombre,password,rol) VALUES ($1, $2, $3);', [user, password_md5,rol])
  return result.rows
}
//Esta función sirve para el login, verifica y obtiene los datos de los usuarios
export async function login(user, password_md5) {
  const result = await conn.query('SELECT id,rol FROM personal WHERE nombre = $1 AND password = $2;', [user, password_md5])
  if (result.rows.length === 1) {
    const { id, rol } = result.rows[0];
    return { id, rol };
  }
  return false
}
//Con esta función se crearan nuevas spermite crear nuevas sesiones 
export async function createNewSession(){

}
//Con esta función se obtienen todas las sesiones
export async function getSessions(){
  const result = await conn.query('SELECT * from sesion')
  return result
}

//Con esta función obtenemos todos los datos de cada platillo
export async function getFoodData(){
  const result = await conn.query('SELECT * from comidas')
  return result
}
//Con esta función obtenemos el precio y nombre de cada platillo
export async function getFoodPrice(){
  const result = await conn.query('SELECT nombre, precio from comidas')
  return result
}

export async function getMesas () {
  const result = await conn.query('select mesas.id as id_mesa, mesas.capacidad, mesas.se_puede_mover, areas.nombre as area, areas.fumadores from mesas join areas on mesas.id_area = areas.id;')
  return result
}


