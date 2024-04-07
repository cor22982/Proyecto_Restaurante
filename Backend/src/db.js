// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function register(user, password_md5,rol) {
  const result = await conn.query('INSERT INTO personal (nombre,password,rol) VALUES ($1, $2, $3);', [user, password_md5,rol])
  return result.rows
}

export async function login(user, password_md5) {
  const result = await conn.query('SELECT id,rol FROM personal WHERE nombre = $1 AND password = $2;', [user, password_md5])
  if (result.rows.length === 1) {
    const { id, rol } = result.rows[0];
    return { id, rol };
  }
  return false
}