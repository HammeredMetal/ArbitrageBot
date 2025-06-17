import axios from 'axios';

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

        for (const group of response.groups) {
            for (const pair of group.pairs) {
                const name = pair.name;
                const binAddress = pair.address;
                const addressX = pair.mint_x;
                const addressY = pair.mint_y;
                const currentPrice = pair.current_price;
                const vol_24Hr = pair.trade_volume_24h;
                const fees_24Hr = pair.fees_24h;

                console.log(`Meteora, Bin Pair: ${name}, Bin Address: ${binAddress}, Token X Address: ${addressX}, Token Y Address: ${addressY}, Price: ${currentPrice}, 24 Hr Volume: ${vol_24Hr}, 24 Hr Fees: ${fees_24Hr}`);
            }
        }



    } catch (error) {
        console.error('Failed to get Meteora data', error);
        throw error
    }
}
meteoraData();
// export { meteoraData };