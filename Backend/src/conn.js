import pg from 'pg';
const { Client } = pg;
const connectionData = {
  user: 'postgres',
  host: 'localhost',
  database: 'proyecto2',
  port: 5432,
}
const client = new Client(connectionData)
client.connect();
export default client;
