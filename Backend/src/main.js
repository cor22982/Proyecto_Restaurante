import express from 'express'
import { validationResult } from 'express-validator'
import cors from 'cors'
import {
  getAllPersonal
// eslint-disable-next-line import/extensions
} from './db.js'

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

app.get('/personal', async (req, res) => {
  try {
    const personal = await getAllPersonal()
    console.log(personal)
    res.status(200).json({ data: personal }) // Se agrega el campo "data" para mostrar los datos
  } catch (error) {
    console.log(personal)
    res.status(500).json({ error: error.message }) // Si hay un error, se muestra el mensaje de error
  }
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Hello from API PROYECTO RESTAURANTE')
})
app.use(validateRequest)



app.use((req, res) => {
  res.status(501).json({ error: 'Método no implementado' })
})
