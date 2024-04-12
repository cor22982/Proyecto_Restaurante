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
  getQuejasbyFoodID
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



app.get('/queja/:food_id', async (req, res) => {
  const food_id = req.params.food_id
  try{
    
    res.status(200).json(await getQuejasbyFoodID(food_id))
  }
  catch(e){
    console.error('Error de servidor :(', e)
    res.status(500).send('Error de servidor :/')
  }
})


app.use((req, res) => {
  res.status(501).json({ error: 'Método no implementado' })
})
