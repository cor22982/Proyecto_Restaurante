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
