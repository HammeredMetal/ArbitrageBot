import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

import { rayVersion, orcaVersion } from './api.js';
import arbiTest from './arbitrage.js';
import db from './database.js';

// Modular tests
//Test API
async function testAPI() {
  try {
    const rayTest = await rayVersion();
    console.log(`Raydium version: ${rayTest.data.data.latest}`);
  } catch (error) {
    console.error('Error: ', error);
  }
    try {
    const orcaTest = await orcaVersion();
    console.log(`Orca status: ${orcaTest.data.status}`);
  } catch (error) {
    console.error('Error: ', error);
  }
}

testAPI();

console.log(arbiTest);
console.log(`Database: ${db.database}`);






app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


//GIT UPDATE PROCESS
//git add .
//git commit -m "Insert message"
//git push