import axios from 'axios';

const meteoraAPI_URL = 'https://dlmm-api.meteora.ag/';


//Pull Meteora data
//Filters response by TVL<$5000
export async function meteoraData() {
    try {
        let response = await axios.get(meteoraAPI_URL + 'pair/all_by_groups?hide_low_tvl=5000');
        response = response.data;

        const cleanedMeteora=[];
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


            //Flip pairs function
            function flipPair(name, binAddress, addressX, addressY, currentPrice, vol_24Hr, fees_24Hr, flipped) {
                flipped = true;

                //Flip name
                let underScorePos = name.indexOf("_")
                if (underScorePos !== -1) {
                    let tokenX = name.slice(0, underScorePos);
                    let tokenY = name.slice(underScorePos+1)
                    name = tokenY + "_" + tokenX;
                }

                //Flip addresses
                let temp = addressX
                addressX = addressY;
                addressY = temp;

                //Flip Price
                currentPrice = 1/currentPrice;

                cleanedMeteora.push({
                    name,
                    binAddress,
                    addressX,
                    addressY,
                    currentPrice,
                    vol_24Hr,
                    fees_24Hr,
                    flipped,
                });
            }

            cleanMeteoraPairs += filteredPools.length;

            for (const pair of filteredPools) {
                const name = pair.name.toUpperCase().trim().replaceAll(" ","").replaceAll("-","_");
                const binAddress = pair.address;
                const addressX = pair.mint_x;
                const addressY = pair.mint_y;
                const currentPrice = pair.current_price;
                const vol_24Hr = pair.trade_volume_24h;
                const fees_24Hr = pair.fees_24h;
                let flipped = false;

                if ((name.endsWith("SOL")) || ((name.endsWith("USDC")) && !(name.startsWith("SOL")))) {
                    flipPair(name, binAddress, addressX, addressY, currentPrice, vol_24Hr, fees_24Hr, flipped)
                } else {
                    cleanedMeteora.push({
                        name,
                        binAddress,
                        addressX,
                        addressY,
                        currentPrice,
                        vol_24Hr,
                        fees_24Hr,
                        flipped,
                    });
                }
            }
        }
        return cleanedMeteora;
    } catch (error) {
        console.error('Failed to get Meteora data', error);
        throw error
    }
}

