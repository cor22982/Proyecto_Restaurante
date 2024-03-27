// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function getAllPersonal() {
  const [rows] = await conn.query('select * from personal personal')
  return rows
}
