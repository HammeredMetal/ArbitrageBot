import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool ({
  user: process.env.PGADMIN_USER,
  host: process.env.PGADMIN_HOST,
  database: process.env.PGADMIN_DB_NAME,
  password: process.env.PGADMIN_PASSWORD,
  port: 5432,
});

export async function insertMeteoraPool(poolData) {
  const {
    pair, address, address_x, address_y, price, vol_24hr, fees_24hr, flipped
  } = poolData;

  const query = `
  INSERT INTO meteora (
  pair, address, address_x, address_y, price, vol_24hr, fees_24hr, flipped)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [pair, address, address_x, address_y,  price, vol_24hr, fees_24hr, flipped];
 
  // console.log('poolData in db.js = ', poolData)

  try {
    await pool.query(query, values);
    console.log(`Inserted pool: ${pair}`);
  } catch (err) {
    // console.error(`DB insert failed for ${pair}:`, err.message);
  }
}