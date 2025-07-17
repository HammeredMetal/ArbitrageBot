
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

            let lowPrice = mPool.price;
            let highPrice = oPool.price;
            let lowFee = mFee;
            let highFee = oPool.fee

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
            let quoteAmt = baseAmt * lowPrice;
            let buyFee = (quoteAmt / 100) * lowFee;
            let netBuy = quoteAmt - buyFee;

            //Calculate Sell Swap
            let invertedHighPrice = 1 / highPrice;
            let returnQuoteAmt = netBuy * invertedHighPrice;
            let returnFeeAmnt = (returnQuoteAmt / 100) * highFee;
            let netReturnQuote = returnQuoteAmt - returnFeeAmnt;

            if (Math.abs(priceDiff) > 1) {
                console.log(`Arbitrage detected on ${mPool.pair}:`);
                console.log(`   Meteora: ${mPool.price}, Orca: ${oPool.price}`);
                console.log(`   Low Price: ${lowPrice}, High Price: ${highPrice}`)
                console.log(`   Low Fee: ${lowFee}, High Fee: ${highFee}`)
                console.log(`   Diff ${priceDiff.toFixed(2)}%`);
                console.log(`Meteora Fee: ${mFee}%`);
                console.log(`Orca Fee: ${oPool.fee}%`);
                console.log(`SELL - Base Amount: ${baseAmt}, Quote Amount: ${quoteAmt}, Buy Fee: ${buyFee}, Net Buy Amount: ${netBuy}`)
                console.log(`BUY - Inverted High Price: ${invertedHighPrice}, Gross Return Quote Amount: ${returnQuoteAmt}, Return Fee: ${returnFeeAmnt} Net After Fees: ${netReturnQuote}`);
                console.log("Meteora Pair: ", mPool)
                console.log("Orca pair: ", oPool)

            }
        }
    }
} 