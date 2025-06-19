import axios from 'axios';
import { name } from 'ejs';

const orcaAPI_URL = 'https://api.orca.so/v2/solana/';

//Test Orca endpoints
async function orcaVersion() {
    try {
        let response = await axios.get(orcaAPI_URL + 'health');
        response = response.data.status;
        return response;
    } catch (error) {
        console.error('Failed to get Orca version', error);
        throw error
    }
}
orcaVersion();
export { orcaVersion };


//Pull Orca data
async function orcaData() {
    try {
        let response = await axios.get(orcaAPI_URL + 'pools?minTvl=1000&&size=3000');
        const pools = response.data.data;

        const totalPairs = pools.length;

        //Filter low vol pools
        const filteredPools = pools.filter(pool => {
            return pool.stats["24h"].volume > 1;
        });

        //Sanitise and normalise symbols
        for (const filteredPool of filteredPools) {
            function sanitiseSymbol(symbol) {
                return symbol
                .replace(/[^\w]/g, "")
                .toUpperCase()
                .trim()
                .replaceAll("$","")
            }
            const name = `${sanitiseSymbol(filteredPool.tokenA.symbol)}_${sanitiseSymbol(filteredPool.tokenB.symbol)}`
                    console.log("Symbol name: ", name)
        }


        console.log('Orca - Cleaned pools detected: ',filteredPools.length);
        console.log('Orca - Initial pools detected: ',totalPairs);   

    } catch (error) {
        console.error('Failed to get Orca data', error);
    }
}
orcaData();
//export { orcaData };