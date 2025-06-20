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

        //Pool flip function
        function flipPair(poolAddress,name,priceAtoB,fee,tvlUSDC,addressA,addressB,flipped,symbolA,symbolB){

            flipped = true;
            let temp = symbolA;
             symbolA = symbolB;
             symbolB = temp;
             name = `${symbolA}_${symbolB}`;

            temp = addressA;
             addressA = addressB;
             addressB = temp;

             priceAtoB = 1/priceAtoB;

            console.log(`Orca - clean and normalised data - Symbol name: ${name}, Price A to B: ${priceAtoB}, Pool address: ${poolAddress}, Address A: ${addressA}, Address B: ${addressB}, Fee Rate: ${fee}, TVL: $${tvlUSDC}, Flipped: ${flipped}`);
        }

        //Sanitise pair names
        for (const filteredPool of filteredPools) {
            function sanitiseSymbol(symbol) {
                return symbol
                .replace(/[^\w]/g, "")
                .toUpperCase()
                .trim()
                .replaceAll("$","")
            }
            let symbolA = `${sanitiseSymbol(filteredPool.tokenA.symbol)}`;
            let symbolB = `${sanitiseSymbol(filteredPool.tokenB.symbol)}`;

            const name = `${symbolA}_${symbolB}`;
            const priceAtoB = filteredPool.price;
            const fee = filteredPool.feeRate;
            const tvlUSDC = parseFloat(filteredPool.tvlUsdc);
            const addressA = filteredPool.tokenA.address;
            const addressB = filteredPool.tokenB.address;
            const poolAddress = filteredPool.address;
            let flipped = false;

            if (( symbolB === "SOL" && symbolA !== "USDC" && symbolA !== "USDT") || (( symbolB === "USDC" || symbolB ==="USDT") && (symbolA !== "USDC" && symbolA !== "USDT" && symbolA !=="SOL"))){
                    flipPair(poolAddress,name,priceAtoB,fee,tvlUSDC,addressA,addressB,flipped,symbolA,symbolB);
                } else {
                    console.log(`Orca - clean and normalised data - Symbol name: ${name}, Price A to B: ${priceAtoB}, Pool address: ${poolAddress}, Address A: ${addressA}, Address B: ${addressB}, Fee Rate: ${fee}, TVL: $${tvlUSDC}, Flipped: ${flipped}`);
                }
        }


        console.log('Orca - Cleaned pools detected: ',filteredPools.length);
        console.log('Orca - Initial pools detected: ',totalPairs);   

    } catch (error) {
        console.error('Failed to get Orca data', error);
    }
}
orcaData();
//export { orcaData };