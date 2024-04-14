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

export async function insertfirstsesion (userid) {
  const result = await conn.query('INSERT INTO SESION (mesero_asociado, monto_total, fecha, fecha_inicio)  VALUES ($1, 0.0,NOW(),NOW());',[userid])
  return result
}

export async function getSessionID () {
  const result = await conn.query('select id from sesion;')
  return result
}

export async function insertfirstCuenta (sesionid) {
  const result = await conn.query('insert into cuenta (total, esta_abierta, sesion) values (0.0, true, $1);',[parseInt(sesionid)]);
  return result
}

export async function getCuentasIDbysesion (sesionid) {
  const result = await conn.query('select id from cuenta where sesion = $1;',[parseInt(sesionid)]);
  return result
}

export async function getCapacityMesas (sesionid) {
  const result = await conn.query('SELECT SUM(mesas.capacidad) as capacidad_sesion FROM mesas_sesion JOIN mesas ON mesas_sesion.mesa = mesas.id where mesas_sesion.sesion = $1;',[parseInt(sesionid)]);
  return result
} 


export async function insertMesaSesion(mesaid, sesionid) {
  try {
    const result = await conn.query('insert into mesas_sesion(mesa,sesion) values ($1,$2);', [parseInt(mesaid), parseInt(sesionid)]);
    return result;
  } catch (error) {
    if (error.code === '20808') {
      return { error: 'No se le puede asignar esta mesa porque excede el límite de la sesión.' };
    } else {
      return { error: 'Ocurrió un error al insertar la mesa en la sesión.' };
    }
  }
}


export async function insertQueja(nit, reason, employee_id, food_id, rating){
  let result
  if (food_id = ''){
    result = await conn.query('insert into queja (nit_cliente, motivo, personal_id, calificacion) values (?, ?, ?,?);',[parseInt(nit), reason, parseInt(employee_id), parseInt(rating)])
  }
  else{
    result = await conn.query('insert into queja (nit_cliente, motivo, comida_id, calificacion) values (?, ?, ?, ?);',[parseInt(nit), reason, parseInt(employee_id), parseInt(food_id)])
  }
  return result
} 


export async function getQuejasbyFoodID(id){
  const result = await conn.query('select queja.id, queja.fecha_hora, cliente.nombre queja.motivo, queja.calificacion, comida.nombre from queja join comidas on queja.comida_id = comidas.id join cliente on queja.nit_cliente = cliente.nit where comida_id = $1;',[parseInt(id)])
  return result
}

export async function getQuejasbyClientID(id){
  const result = await conn.query('select queja.id, queja.fecha_hora, cliente.nombre , queja.motivo, queja.calificacion, comida.nombre from queja join cliente on queja.nit_cliente = cliente.id join comidas on comidas.id = queja.comida_id where nit_cliente = $1;',[parseInt(id)])
  return result
}

export async function getQuejasbyEmployeeID(id){
  const result = await conn.query('select queja.id, queja.fecha_hora, cliente.nombre, queja.motivo, queja.calificacion, personal.nombre from queja join personal on queja.personal_id = personal.id join cliente on queja.nit_cliente = cliente.id where personal_id = $1;',[parseInt(id)])
  return result
}

export async function getPriceforCuenta (cuentaid) {
  const result = await conn.query('select total from cuenta where id = $1;',[parseInt(cuentaid)])
  return result
}


export async function insertplatoonsesion (cuentaid,comida_id, cantidad) {
  const result = await conn.query('insert into cuenta_comida (cuenta,comida,cantidad) values ($1,$2,$3);',[parseInt(cuentaid),parseInt(comida_id),parseInt(cantidad)])
  return result
}

export async function getPedido (cuentaid) {
  const result = await conn.query('select cuenta_comida.cantidad as cantidad, comidas.nombre  as plato, comidas.descripcion as descripcion , comidas.precio as precio, cuenta_comida.cantidad*comidas.precio as total from cuenta_comida join comidas on comidas.id = cuenta_comida.comida where cuenta_comida.cuenta = $1;',[parseInt(cuentaid)])
  return result
}

export async function ordenarPedido (cuentaid) {
  const result = await conn.query('select insertar_comidas_en_orden($1);',[parseInt(cuentaid)])
  return result
}


export async function insertcliente (direccion,nombre,nit,cuenta) {
  await conn.query('insert into cliente(direccion,nombre,nit) values ($1,$2,$3) ON CONFLICT (nit) DO NOTHING;', [direccion,nombre,nit])
  const result = await conn.query('UPDATE cuenta set cliente = $1 where id = $2;',[nit,parseInt(cuenta)])
  return result
}

export async function insertpago (monto,forma,cliente,cuenta) {
  const result = await conn.query('insert into forma_de_pago(monto,forma,cliente,cuenta) values ($1,$2,$3,$4);',[parseFloat(monto), forma,cliente, parseInt(cuenta)])
  return result
}

export async function clientebycuenta (cuentaid) {
  const result = await conn.query('select cliente.nit, cliente.nombre, cliente.direccion from cuenta join cliente on cliente.nit = cuenta.cliente where cuenta.id = $1;', [parseInt(cuentaid)])
  return result
}

export async function infocuenta (cuentaid) {
  const result = await conn.query('select comidas.descripcion, cuenta_comida.cantidad, comidas.precio*cuenta_comida.cantidad as precio from cuenta_comida join comidas on comidas.id = cuenta_comida.comida where cuenta_comida.cuenta = $1;', [parseInt(cuentaid)])
  return result
}

export async function createNewEncuesta(client, employee, kindness, accuracy){
  const result = await conn.query('insert into encuesta(cliente, personal, amabilidad, exactitud) values ($1,$2,$3,$4);',[client,parseInt(employee),parseInt(kindness),parseInt(accuracy)])
  return result 
}



export async function terminarsesion (sesionid) {
  const result = await conn.query('select terminar_sesion($1);', [parseInt(sesionid)])
  return result
}

export async function getKitchenOrders(){
  try{
    const result = await conn.query('select cuenta_id, comidas.nombre, fecha from orden_cocina join comidas on orden_cocina.plato = comidas.id where  DATE(orden_cocina.fecha) = CURRENT_DATE order by orden_cocina.fecha asc;')
    return result.rows
  }
  catch(error){
    console.log(error)
  }
  
}

export async function getBarOrders(){
  const result = await conn.query('select cuenta_id, comidas.nombre, fecha from orden_bar join comidas on orden_bar.bebida = comidas.id where DATE(orden_bar.fecha) = CURRENT_DATE order by orden_bar.fecha asc;')
  return result.rows

}

