import axios from 'axios';
import { fileLoader } from 'ejs';

const meteoraAPI_URL = 'https://dlmm-api.meteora.ag/';

//Test Meteora endpoints
async function meteoraVersion() {
    try {
        let response = await axios.get(meteoraAPI_URL + 'info/protocol_metrics');
        response = response.data.total_tvl
        return response;
    } catch (error) {
        console.error('Failed to get Meteora version', error);
        throw error
    }
}
meteoraVersion();
export { meteoraVersion };


//Pull Meteora data
//Filters response by TVL<$5000
async function meteoraData() {
    try {
        let response = await axios.get(meteoraAPI_URL + 'pair/all_by_groups?hide_low_tvl=5000');
        response = response.data;

        let totalPairs = 0;
        let cleanMeteoraPairs = 0;
        const groupNumber = response.groups.length;
        
        for (let i=0; i<groupNumber; i++){
            let pools = response.groups[i].pairs;
            totalPairs += pools.length;

            //Remove low activity pairs
            const filteredPools = pools.filter(pool => {
                return pool.trade_volume_24h > 1;
            });

            cleanMeteoraPairs += filteredPools.length;

            for (const pair of filteredPools) {
                const name = pair.name.toUpperCase().trim().replaceAll(" ","").replaceAll("-","_");
                const binAddress = pair.address;
                const addressX = pair.mint_x;
                const addressY = pair.mint_y;
                const currentPrice = pair.current_price;
                const vol_24Hr = pair.trade_volume_24h;
                const fees_24Hr = pair.fees_24h;

                console.log(`Meteora, Bin Pair: ${name}, Bin Address: ${binAddress}, Token X Address: ${addressX}, Token Y Address: ${addressY}, Price: ${currentPrice}, 24 Hr Volume: ${vol_24Hr}, 24 Hr Fees: ${fees_24Hr}`);

            }
        }
        console.log(`Initial pools detected: ${totalPairs}`);
        console.log(`Cleaned pools detected: ${cleanMeteoraPairs}`); 

    } catch (error) {
        console.error('Failed to get Meteora data', error);
        throw error
    }
}
meteoraData();
// export { meteoraData };