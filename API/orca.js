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
        const volumeFilter = pools.filter(pool => {
            return pool.stats["24h"].volume > 1;
        });

        //Removes all pairs that are not either Sol or USDC
        const filteredPools = volumeFilter.filter(pool => {
            const allowed = ["SOL", "USDC"];
            const a = pool.tokenA.symbol.toUpperCase();
            const b = pool.tokenB.symbol.toUpperCase();
            return allowed.includes(a) || allowed.includes(b);
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
            const name = `${sanitiseSymbol(filteredPool.tokenA.symbol)}_${sanitiseSymbol(filteredPool.tokenB.symbol)}`;
            const priceAtoB = filteredPool.price;
            const fee = filteredPool.feeRate;
            const tvlUSDC = parseFloat(filteredPool.tvlUsdc);
            const addressA = filteredPool.tokenA.address;
            const addressB = filteredPool.tokenB.address;
            const poolAddress = filteredPool.address;


            console.log(`Symbol name: ${name}`);
            console.log(`Orca - Symbol name: ${name}, Price A to B: $${priceAtoB}, Pool address: ${poolAddress}, Address A: ${addressA}, Address B: ${addressB}, Fee Rate: ${fee}, TVL: $${tvlUSDC}`);
        }


        console.log('Orca - Cleaned pools detected: ',filteredPools.length);
        console.log('Orca - Initial pools detected: ',totalPairs);   

    } catch (error) {
        console.error('Failed to get Orca data', error);
    }
}
orcaData();
//export { orcaData };