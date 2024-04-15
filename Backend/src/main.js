import express from 'express'
import { validationResult } from 'express-validator'
import cors from 'cors'
import {
  register,
  login,
  getFoodData,
  getFoodPrice,
  getMesas,
  insertfirstsesion,
  getSessionID ,
  insertfirstCuenta,
  getCuentasIDbysesion,
  getCapacityMesas,
  insertMesaSesion,
  insertQueja,
  getQuejasbyFoodID,
  getQuejasbyClientID,
  getQuejasbyEmployeeID,
  getPriceforCuenta,
  insertplatoonsesion,
  getPedido,
  ordenarPedido,
  insertcliente,
  insertpago ,
  clientebycuenta,
  infocuenta,
  createNewEncuesta,
  terminarsesion,
  getBarOrders,
  getKitchenOrders,
  getpricewithoutpropina,
  terminarcuenta,
  terminarodencocina  ,
  terminarodenbar,
  getTiemposDeEspera,
  getHorarios

// eslint-disable-next-line import/extensions
} from './db.js'

import { generateToken, validateToken,decodeToken } from './jwt.js'

const app = express()
const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: 'No mandaste los campos correctos' })
  }
  return next()
}

app.use(express.json())
app.use(cors())



const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Hello from API PROYECTO RESTAURANTE')
})
app.use(validateRequest)
app.post('/register', async (req, res) => {
  console.log("body", req.body)
  const { username, password,rol } = req.body
  const success = await register(username, password,rol)
  res.send('{ "message": "user created" }')
})

app.post('/verified', async (req, res) => {
  const { token } = req.body
  if (validateToken(token)) {
    const payload = decodeToken(token)
    const { rol } = payload;
    const {username} = payload;
    res.status(200)
    res.json({rol:rol,username:username })
    return
  }
  res.status(403)
  res.json([])
  
})

app.post('/insertfirstsession', async(req, res) =>{
  const { token } = req.body
  if (validateToken(token)) {
    const payload = decodeToken(token)
    const { id } = payload;
    const success = await insertfirstsesion(id)
    if (success) {
      res.status(200)
      res.send('{ "message": "Se ha insertado una nueva sesion" }')
      return
    }
    res.status(401)
    res.send('{ "message": "No tiene permisos" }')
  }
})

app.post('/insertfirstcuenta', async(req, res) =>{
    const { sesionid } = req.body
    const success = await insertfirstCuenta(sesionid)
    if (success) {
      res.status(200)
      res.send('{ "message": "Se ha insertado una cuenta" }')
      return
    }
    res.status(401)
    res.send('{ "message": "No se puede insertar la cuenta" }')

})

app.post('/insertpagos', async(req, res) =>{
  const { direccion,nombre,nit,cuenta,monto,forma } = req.body
  await insertcliente (direccion,nombre,nit,cuenta)
  const success = await insertpago (monto,forma,nit,cuenta)
  if (success) {
    res.status(200)
    res.send('{ "message": "Se ha insertado una forma de pago" }')
    return
  }
  res.status(401)
  res.send('{ "message": "No se inserto la forma de pago" }')

})


app.post('/insertpedido', async(req, res) =>{
  const { cuentaid } = req.body
  const success = await ordenarPedido (cuentaid)
  if (success) {
    res.status(200)
    res.send('{ "message": "Se ha enviado los pedidos" }')
    return
  }
  res.status(401)
  res.send('{ "message": "No se pueden enviar los pedidos" }')

})


app.post('/insertMesa', async (req, res) => {
  const { mesaid, sesionid } = req.body;
  const result = await insertMesaSesion(mesaid, sesionid);

  if (result.error) {
    res.status(401).json({ message: result.error });
  } else {
    res.status(200).json({ message: 'Se ha insertado una mesa.' });
  }
});

app.post('/insertplatoonsesion', async(req,res) => {
  const { cuentaid,comida_id, cantidad } = req.body;
  const result = await insertplatoonsesion (cuentaid,comida_id, cantidad);

  if (result.error) {
    res.status(401).json({ message: result.error });
  } else {
    res.status(200).json({ message: 'Se ha insertado un plato.' });
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const success = await login(username, password)
  console.log('success', success)
  if (success) {
    const user =  {
      id: success.id,
      username: username,
      rol: success.rol
    }
    const token = generateToken(user)
    res.status(200)
    res.json({"success": true, acces_token: token})
    return
  }

  res.status(401)
  res.send('{ "message": "not logged in" }')
})

app.get('/foodData', async (req, res) => {
  try{
    const result = await getFoodData()
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})

app.get('/idsession', async (req,res) =>{
  try{
    const result = await getSessionID()
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})


app.get('/idcuentas/:sesionid', async (req, res) =>{
  const sesionid = req.params.sesionid;
  try{
    const result = await getCuentasIDbysesion(sesionid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})


app.get('/getpedidos/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  try{
    const result = await getPedido (cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})


app.get('/clientebycuenta/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  try{
    const result = await clientebycuenta (cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})

app.get('/infocuenta/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  try{
    const result = await infocuenta (cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})



app.get('/cuentaprecio/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  try{
    const result = await getPriceforCuenta (cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})

app.get('/cuentapreciosinpropina/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  try{
    const result = await getpricewithoutpropina (cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})



app.get('/capacytibySesion/:sesionid', async (req, res) =>{
  const sesionid = req.params.sesionid;
  try{
    const result = await getCapacityMesas (sesionid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})


app.get('/mesasData', async (req, res) => {
  try{
    const result = await getMesas()
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})


app.get('/foodPrice', async (req, res) => {
  try{
    const result = await getFoodPrice()
    res.status(200).json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send({error: 'Error con el servidor :('})
  }
})

app.post('/queja' , async (req, res) => {
  const { nit, reason, employee_id, food_id, rating } = req.body
  try{
    res.status(200).send(await insertQueja(nit, reason, employee_id, food_id, rating))
  }
  catch(e){
    res.status(500).send('Error de servidor :/')
  }

})



app.get('/quejaComida/:food_id', async (req, res) => {
  const food_id = req.params.food_id
  try{
    
    res.status(200).json(await getQuejasbyFoodID(food_id))
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})

app.put ('/terminarcuenta/:cuentaid', async (req, res) =>{
  const cuentaid = req.params.cuentaid;
  const result = await terminarcuenta (cuentaid)
  if (result.error){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({message: 'Error de servidor:('})
  }
  else {
    res.status(200)
    res.json({message: "Se ha terminado la cuenta"})
  }
}) 

app.get('/quejaCliente/:client_id', async (req, res) => {
  const client_id = req.params.client_id
  try{
    res.status(200).json(await getQuejasbyClientID(client_id))
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})

app.get('/quejaEmpleado/:employee_id', async (req, res) => {
  const employee_id = req.params.employee_id
  try{
    res.status(200).json(await getQuejasbyEmployeeID(employee_id))
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})

app.post('/encuesta', async (req, res) =>{

  
  const {client, token, kindness, accuracy} = req.body
  const payload = decodeToken(token)
  const { id } = payload;

  try{
    res.status(200).send(await createNewEncuesta(client, id, kindness, accuracy))
  }
  catch(e){
    console.log('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  
  }
})


app.post ('/terminarsesion', async (req, res) => {
  const { sesionid } = req.body;
  const result = await  terminarsesion (sesionid);

  if (result.error) {
    res.status(401).json({ message: result.error });
  } else {
    res.status(200).json({ message: 'Se ha terminado la sesion' });
  }
})


app.get('/barOrders', async (req, res) => {
  try{
    res.status(200).json(await getBarOrders())
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})

app.get('/kitchenOrders', async (req, res) => {
  try{
    res.status(200).json(await getKitchenOrders())
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})

app.delete('/deleteordencocina', async (req, res) =>{
  const { platoid, cuentaid } = req.body;
  try{
    const result = await terminarodencocina (platoid, cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})

app.delete('/deleteordenbar', async (req, res) =>{
  const { bebidaid, cuentaid } = req.body;
  try{
    const result = await terminarodenbar (bebidaid, cuentaid)
    res.status(200)
    res.json(result.rows)
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500)
    res.send({error: 'Error de servidor:('})
  }
})

app.get('/TiemposDeEspera', async (req, res) => {
  try {
  
    const fecha_inicio = new Date(req.query.fecha_inicio);
    const fecha_fin = new Date(req.query.fecha_fin);


    if (!fecha_inicio || isNaN(fecha_inicio.getTime()) || !fecha_fin || isNaN(fecha_fin.getTime())) {
      return res.status(400).json({ error: 'Las fechas proporcionadas son inválidas' });
    }



    res.status(200).json(await getTiemposDeEspera(fecha_inicio, fecha_fin))
  } catch (error) {

    console.error('Error de servidor :(', error);
    res.status(500).send('Error de servidor :/');
  }
})

app.get('/horario', async (req, res) => {
  try {
  
    const fecha_inicio = new Date(req.query.fecha_inicio);
    const fecha_fin = new Date(req.query.fecha_fin);


    if (!fecha_inicio || isNaN(fecha_inicio.getTime()) || !fecha_fin || isNaN(fecha_fin.getTime())) {
      return res.status(400).json({ error: 'Las fechas proporcionadas son inválidas' });
    }
    res.status(200).json(await getHorarios(fecha_inicio, fecha_fin))
  } catch (error) {
    console.error('Error de servidor :(', error)
    res.status(500).send('Error de servidor :/')
  }
})



app.use((req, res) => {
  res.status(501).json({ error: 'Método no implementado' })
})
