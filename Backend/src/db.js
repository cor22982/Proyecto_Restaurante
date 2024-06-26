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
  const result = await conn.query('select id,esta_abierta from cuenta where sesion = $1;',[parseInt(sesionid)]);
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


export async function insertQueja(nit, reason, employee_id, food_id, rating) {
  try {
    let result;
    if (food_id === '' && employee_id !== '') {
      if (!isNaN(employee_id)) {
        result = await conn.query('INSERT INTO queja (nit_cliente, motivo, calificacion, personal_id) VALUES ($1, $2, $3, $4);', [nit, reason, parseInt(rating), parseInt(employee_id)]);
      }else {
        console.error('Invalid employeeid:', employee_id);
        // Handle the error or throw an exception
      }
      
    }
    else if (employee_id === '' && food_id !== '') {
      // Check if food_id is not an empty string and is a valid integer
      if (!isNaN(food_id)) {
        result = await conn.query('INSERT INTO queja (nit_cliente, motivo, comida, calificacion) VALUES ($1, $2, $3, $4);', [nit, reason, parseInt(food_id), parseInt(rating)]);
      } else {
        console.error('Invalid food_id:', food_id);
        // Handle the error or throw an exception
      }
    }
    else  {
      result = await conn.query('INSERT INTO queja (nit_cliente, motivo, personal_id, comida, calificacion) VALUES ($1, $2, $3, $4, $5);', [nit, reason,parseInt(employee_id), parseInt(food_id), parseInt(rating)]);
    }
    return result.rows;
  } catch (error) {
    console.error('Error inserting complaint:', error);
    throw error;
  }
}

export async function insertQuejaforfood(nit, reason, food_id, rating){
  try{
    const result = await conn.query('insert into queja (nit_cliente, motivo, comida, calificacion) values (?, ?, ?, ?);',[nit,reason,parseInt(food_id),parseInt(rating)])
    return result
  }
  catch(error){
    console.log(error)
    throw error
  }
  
}

export async function insertQuejaforemployee(nit, reason, employee_id, rating){
  const result = await conn.query('insert into queja (nit_cliente, motivo, calificacion, personal_id) values ($1,$2,$3,$4);',[nit,reason,parseInt(rating),parseInt(employee_id)])
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
    const result = await conn.query(`
      SELECT 
          cuenta_id, 
          plato,
          comidas.nombre, 
          TO_CHAR(EXTRACT(HOUR FROM orden_cocina.fecha), 'FM00') || ':' || TO_CHAR(EXTRACT(MINUTE FROM orden_cocina.fecha), 'FM00') AS hora_minutos, 
          cuenta_comida.cantidad 
      FROM 
          orden_cocina 
      JOIN 
          comidas ON orden_cocina.plato = comidas.id 
      JOIN 
          cuenta_comida ON cuenta_comida.comida = orden_cocina.plato 
      WHERE 
          DATE(orden_cocina.fecha) = CURRENT_DATE 
          AND cuenta_comida.cuenta = orden_cocina.cuenta_id 
      ORDER BY 
          hora_minutos ASC;
`   );
    return result.rows
  }
  catch(error){
    console.log(error)
  }
  
}

export async function getBarOrders(){
  const result = await conn.query(`
    select cuenta_id,
      bebida, 
      comidas.nombre, 
      TO_CHAR(EXTRACT(HOUR FROM orden_bar.fecha), 'FM00') || ':' || TO_CHAR(EXTRACT(MINUTE FROM orden_bar.fecha), 'FM00') AS hora_minutos,
      cuenta_comida.cantidad  
    from 
      orden_bar 
    join 
      comidas on orden_bar.bebida = comidas.id 
    JOIN 
      cuenta_comida ON cuenta_comida.cuenta = orden_bar.cuenta_id
    where 
      DATE(orden_bar.fecha) = CURRENT_DATE 
      order by orden_bar.fecha asc;`)
  return result.rows

}

export async function getpricewithoutpropina (cuentaid) {
  const result1 = await conn.query('select sesion from cuenta where id = $1;', [parseInt(cuentaid)])
  const sesion = result1.rows[0].sesion;  
  const result2 = await conn.query('select total - (SELECT sesion.propina/(select count(*) from cuenta where sesion = $1) from sesion where id = $1) as costo_sin_propina from cuenta where id = $2;', [parseInt(sesion), parseInt(cuentaid)])
  return result2
}

export async function terminarcuenta (cuentaid) {
  const result = await conn.query('UPDATE cuenta set esta_abierta = false, fecha_fin = now() where id = $1;',[parseInt(cuentaid)])
  return result
}


export async function terminarodencocina (platoid, cuentaid) {
  const result = await conn.query('delete from orden_cocina where plato = $1 and cuenta_id = $2;',[parseInt(platoid),parseInt(cuentaid)])
  return result
}



export async function terminarodenbar (bebidaid, cuentaid) {
  const result = await conn.query('delete from orden_bar where bebida = $1 and cuenta_id = $2;',[parseInt(bebidaid),parseInt(cuentaid)])
  return result
}

export async function getTiemposDeEspera(fecha_inicio, fecha_fin){
  const result = await conn.query('SELECT c.nombre AS plato, COUNT(*) AS total_pedidos FROM cuenta_comida cc JOIN comidas c ON cc.comida = c.id WHERE cc.fecha BETWEEN $1 AND $2 GROUP BY c.nombre ORDER BY total_pedidos DESC;', [fecha_inicio.toISOString(), fecha_fin.toISOString()])
  return result.rows
}

export async function getHorarios(fecha_inicio, fecha_fin){
  const result = await conn.query('SELECT EXTRACT(HOUR FROM cc.fecha) AS hora, COUNT(*) AS total_pedidos FROM cuenta_comida cc WHERE cc.fecha BETWEEN $1 AND $2 GROUP BY hora ORDER BY total_pedidos DESC', [fecha_inicio.toISOString(), fecha_fin.toISOString()])
  return result.rows
}

export async function getTimeAVG(fecha_inicio, fecha_fin){
  const result = await conn.query('select fechas.personas, avg(extract(epoch from (fechas.fecha_fin - fechas.fecha_inicio))/60) from (select * from sesion join (select ms.sesion, sum(m.capacidad) as personas from mesas m join mesas_sesion ms on ms.mesa = m.id group by ms.sesion) as cant on sesion.id = cant.sesion where sesion.fecha_fin is not null) as fechas where DATE(fechas.fecha_inicio) BETWEEN $1 and $2 and DATE(fechas.fecha_fin) BETWEEN $3 and $4 group by fechas.personas', [fecha_inicio.toISOString(), fecha_fin.toISOString(), fecha_inicio.toISOString(), fecha_fin.toISOString()])
  return result.rows
}


export async function getQuejasByName(fecha_inicio, fecha_fin){
  try{
    const result = await conn.query(' SELECT p.nombre AS persona, COUNT(*) AS total_quejas FROM queja q JOIN personal p ON q.personal_id = p.id WHERE DATE(q.fecha_hora) BETWEEN $1 AND $2 GROUP BY p.nombre ORDER BY count(*) desc', [fecha_inicio.toISOString(), fecha_fin.toISOString()])
    return result.rows
  }
  catch(error){
    console.log(error)
  }
  
}

export async function getQuejasByFood(fecha_inicio, fecha_fin){
  try{
    const result = await conn.query('SELECT c.nombre AS COMIDA, COUNT(*) AS total_quejas FROM queja q JOIN comidas c ON c.id = q.comida WHERE DATE(q.fecha_hora) BETWEEN $1 AND $2 GROUP BY c.nombre ORDER BY count(*) desc', [fecha_inicio.toISOString(), fecha_fin.toISOString()])
    return result.rows
  }
  catch(error){
    console.log(error)
  }
  
}

export async function getEmployeesPerformance(){
  try{
    const result = await conn.query("select p.nombre, DATE_TRUNC('month', e.fecha)as month, avg(e.amabilidad) as amabilidad, avg(e.exactitud) as exactitud from encuesta e join personal p on e.personal = p.id where fecha >= CURRENT_DATE - INTERVAL '6 months' group by p.nombre, month")
    return result.rows
  }
  catch(error){
    console.log(error)
  }
}
