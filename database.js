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
  flipped = EXCLUDED.flipped,
  timestamp = NOW()`;
  const values = [name, binAddress, addressX, addressY, currentPrice, vol_24Hr, fees_24Hr, flipped];

  try {
    await pool.query(query, values);
    console.log('Inserted Meteora pool: ', name);
  } catch (err) {
    console.error('Meteora DB insert failed for ', name, err.message);
  }
};

export async function insertOrcaPool(poolData) {
  const {
    name, poolAddress, addressA, addressB, priceAtoB, tvlUSDC, fee, flipped
  } = poolData;

  const query = `INSERT INTO orca (
  pair, address, address_a, address_b, price, tvl, fee, flipped)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  ON CONFLICT (address) DO UPDATE SET
  pair = EXCLUDED.pair,
  address_a = EXCLUDED.address_a,
  address_b = EXCLUDED.address_b,
  price = EXCLUDED.price,
  tvl = EXCLUDED.tvl,
  fee = EXCLUDED.fee,
  flipped = EXCLUDED.flipped,
  timestamp = NOW()`;
  const values = [name, poolAddress, addressA, addressB, priceAtoB, tvlUSDC, fee, flipped];

  try {
    await pool.query(query, values);
    console.log('Inserted Orca pool: ', name);
  } catch (err) {
    console.error('Orca DB insert failed for ', name, err.message);
  }
}; 
 

export async function getAllMeteoraPools() {

  const query = `
    SELECT pair, address, address_x, address_y, price, vol_24hr, fees_24hr
    FROM meteora
    `;

  try {
    const mResult = await pool.query(query);
    return mResult.rows;
  } catch (err) {
    console.error('Meteora DB retrieval failed for ', err.message);
    throw err;
  }
}

export async function getAllOrcaPools() {

    const query = `
    SELECT pair, address, address_a, address_b, price, tvl, fee
    FROM orca
    `;

  try {
    const oResult = await pool.query(query);
    return oResult.rows;
  } catch (err) {
    console.error('Orca DB retrieval failed for ', err.message);
    throw err;
  }
}