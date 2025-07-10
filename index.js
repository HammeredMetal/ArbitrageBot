import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

import { meteoraData, orcaData } from './API/index.js';
import { checkArbitrage } from './arbitrage.js';
import { insertMeteoraPool, insertOrcaPool } from './database.js';

async function run() {
  const m_pools = await meteoraData();
  const o_pools = await orcaData();

  console.log(`Found ${m_pools.length} viable Meteora pools.`);
  console.log(`Found ${o_pools.length} viable Orca pools.`);

  for (const pool of m_pools) {
    await insertMeteoraPool(pool);
  }

    for (const pool of o_pools) {
    await insertOrcaPool(pool);
  }

  console.log(`Meteora pools successfully inserted into the database.`)
  console.log(`Orca pools successfully inserted into the database.`)
}
// run()


async function runArb() {
  await checkArbitrage();
}
runArb();


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//GIT UPDATE PROCESS
//git add .
//git status
//git commit -m "Insert message"
//git push