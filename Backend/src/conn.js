import pg from 'pg';
const { Client } = pg;
const connectionData = {
  user: 'owner',
  host: 'localhost',
  database: 'proyecto2',
  password: '36L8W7Nm',
  port: 5432,
}
const client = new Client(connectionData)
client.connect();
export default client;
