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
  const result = await conn.query('INSERT INTO personal (nombre,password,rol) VALUES ($1, $2, $3);', [user, password_md5,rol])
  return result.rows
}

export async function login(user, password_md5) {
  const result = await conn.query('SELECT id FROM personal WHERE nombre = $1 AND password = $2;', [user, password_md5])
  if (result.rows.length === 1) {
    
    return result.rows[0].id
    
  }
  return false
}