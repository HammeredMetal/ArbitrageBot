import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

import { meteoraVersion, orcaVersion } from './API/index.js';
import arbiTest from './arbitrage.js';
import db from './database.js';

async function APITest() {
  const meteoraTest = await meteoraVersion();
  const orcaTest = await orcaVersion();
  console.log(`Meteora TVL: $${meteoraTest}`);
  console.log(`Orca status: ${orcaTest}`);
}
APITest();

console.log(arbiTest);
console.log(`Database: ${db.database}`);
 



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//GIT UPDATE PROCESS
//git add .
//git commit -m "Insert message"
//git push