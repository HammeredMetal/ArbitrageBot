import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const db = new Client ({
  user: process.env.PGADMIN_USER,
  host: process.env.PGADMIN_HOST,
  database: process.env.PGADMIN_DB_NAME,
  password: process.env.PGADMIN_PASSWORD,
  port: 5432,
});
db.connect();


db.end();
export default db;