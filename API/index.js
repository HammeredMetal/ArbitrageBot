import axios from 'axios';

import { meteoraVersion } from './meteora.js';
import { orcaVersion } from './orca.js';

// // Modular tests
// //Test API
// async function raydiumAPITest() {
//   try {
//     let rayTest = await rayVersion();
//     rayTest = rayTest.data.data.latest;
//     return rayTest;
//   } catch (error) {
//     console.error('Error: ', error);
//   }
// }
// raydiumAPITest();

// async function orcaAPITest() {
//     try {
//     let orcaTest = await orcaVersion();
//     orcaTest = orcaTest.data.status;
//     return orcaTest;
//   } catch (error) {
//     console.error('Error: ', error);
//   }
// }
// orcaAPITest();

export { meteoraVersion, orcaVersion }; 



