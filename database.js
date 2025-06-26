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
    name, binAddress, addressX, addressY, currentPrice, vol_24Hr, fees_24Hr, flipped
  } = poolData;

  const query = `INSERT INTO meteora (
  pair, address, address_x, address_y, price, vol_24hr, fees_24hr, flipped)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (address) DO UPDATE SET
  pair = EXCLUDED.pair,
  address_x = EXCLUDED.address_x,
  address_y = EXCLUDED.address_y,
  price = EXCLUDED.price,
  vol_24hr = EXCLUDED.vol_24hr,
  fees_24hr = EXCLUDED.fees_24hr,
  flipped = EXCLUDED.flipped`;
  const values = [name, binAddress, addressX, addressY, currentPrice, vol_24Hr, fees_24Hr, flipped];

  try {
    await pool.query(query, values);
    console.log('Inserted pool: ', name);
  } catch (err) {
    console.error('DB insert failed for ', name, err.message);
  }
}
 