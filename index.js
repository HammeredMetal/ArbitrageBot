import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const { Client } = pg;

const db = new Client ({
  user: process.env.PGADMIN_USER,
  host: process.env.PGADMIN_HOST,
  database: process.env.PGADMIN_DB_NAME,
  password: process.env.PGADMIN_PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));









app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
