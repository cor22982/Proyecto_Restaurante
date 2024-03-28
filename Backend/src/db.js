// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function getAllPersonal() {
  try {
    const [rows] = await conn.query('select * from personal;')
    return rows
  } catch (error) {
    console.error('Error en getAllPersonal:', error)
    throw error // Relanza el error para que sea manejado por el código que llama a getAllPersonal
  }
}
