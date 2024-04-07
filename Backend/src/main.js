import express from 'express'
import { validationResult } from 'express-validator'
import cors from 'cors'
import {
  register,
  login,
  getFoodData,
  getFoodPrice
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
    res.status(200)
    res.json({rol:rol})
    return
  }
  res.status(403)
  res.json([])
  
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const success = await login(username, password)
  console.log('success', success)
  if (success) {
    const user =  {
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


app.use((req, res) => {
  res.status(501).json({ error: 'Método no implementado' })
})
