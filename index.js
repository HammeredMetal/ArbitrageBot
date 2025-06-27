import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

import { meteoraData, orcaVersion } from './API/index.js';
import arbiTest from './arbitrage.js';
import { insertMeteoraPool } from './database.js';

async function run() {
  const pools = await meteoraData();

  console.log(`Found ${pools.length} viable Meteora pools.`);

  for (const pool of pools) {
    await insertMeteoraPool(pool);
  }

  console.log(`Meteora pools successfully inserted into the database.`)
}
run()

async function APITest() {
  const orcaTest = await orcaVersion();
  console.log(`Orca status: ${orcaTest}`);
}
APITest();

console.log(arbiTest);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//GIT UPDATE PROCESS
//git add .
//git status
//git commit -m "Insert message"
//git push