
import { getAllMeteoraPools, getAllOrcaPools } from './database.js';

export async function checkArbitrage() {
    const meteoraPools = await getAllMeteoraPools();
    const orcaPools = await getAllOrcaPools();

    for (const mPool of meteoraPools) {
        const oPool = orcaPools.find(op => (op.address_a === mPool.address_x) && (op.address_b === mPool.address_y));
        if (!oPool) continue;

        if (oPool) {
            let priceDiff = ((oPool.price - mPool.price) / mPool.price) * 100;

            //Meteora fee calc
            const mFee = (mPool.fees_24hr / mPool.vol_24hr) * 100;

            let lowPrice = oPool.price;
            let highPrice = mPool.price;
            let highFee = mFee;
            let lowFee = oPool.fee

            //Check for inverse price difference
            if (priceDiff < 0) {
                let temp = lowPrice;
                lowPrice = highPrice;
                highPrice = temp;
                highFee = mFee;
                lowFee = oPool.fee

                //add negative to priceDiff
            }

            //Set Base Amount
            let baseAmt = 1;
                if (mPool.pair.startsWith('USD')){
                baseAmt = 100
            }

            //Calculate Buy Swap
            //Exchange 1 * base for n * quote
            const quoteAmt = baseAmt * lowPrice;
            const buyFee = (quoteAmt / 100) * lowFee;
            const netBuy = quoteAmt - buyFee;

            //Calculate Sell Swap
            const invertedHighPrice = 1 / highPrice;
            const returnQuoteAmt = netBuy * invertedHighPrice;
            const returnFeeAmnt = (returnQuoteAmt / 100) * highFee;
            const netReturnQuote = returnQuoteAmt - returnFeeAmnt;

            let profit;
            if (netReturnQuote > 1) {
                profit = (netReturnQuote - baseAmt).toFixed(2);
            }

            if (profit > 1) {
                console.log(`Arbitrage detected on ${mPool.pair}:`);
                console.log(`Profit: ${profit}%`)
                // console.log(`   Meteora: ${mPool.price}, Orca: ${oPool.price}`);
                // console.log(`   Low Price: ${lowPrice}, High Price: ${highPrice}`)
                // console.log(`   Low Fee: ${lowFee}, High Fee: ${highFee}`)
                // console.log(`   Diff ${priceDiff.toFixed(2)}%`);
                // console.log(`Meteora Fee: ${mFee}%`);
                // console.log(`Orca Fee: ${oPool.fee}%`);
                // console.log(`SELL - Base Amount: ${baseAmt}, Quote Amount: ${quoteAmt}, Buy Fee: ${buyFee}, Net Buy Amount: ${netBuy}`)
                // console.log(`BUY - Inverted High Price: ${invertedHighPrice}, Gross Return Quote Amount: ${returnQuoteAmt}, Return Fee: ${returnFeeAmnt} Net After Fees: ${netReturnQuote}`);
                // console.log("Meteora Pair: ", mPool)
                // console.log("Orca pair: ", oPool)

            }
        }
    }
} 