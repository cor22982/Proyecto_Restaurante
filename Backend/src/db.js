// eslint-disable-next-line import/extensions
import conn from './conn.js'

export async function getAllPersonal() {
  try {
    const result = await conn.query('SELECT * FROM areas;');
    console.log('Connection to PostgreSQL is active.');
    return true;
  } catch (error) {
    console.error('Error checking connection to PostgreSQL:', error);
    return false;
  }
}
