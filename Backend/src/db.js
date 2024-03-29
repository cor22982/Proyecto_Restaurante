// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function getAllPersonal() {
  try {
    const result = await conn.query('SELECT * FROM personal;');
    return result.rows;
  } catch (error) {
    console.error('Error checking connection to PostgreSQL:', error);
    return false;
  }
}
export async function register(user, password_md5,rol) {
  const result = await conn.query('INSERT INTO personal (nombre,password,rol) VALUES (?, ?, ?);', [user, password_md5,rol])
  return result.rows
}