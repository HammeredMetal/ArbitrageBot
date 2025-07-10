
import { getAllMeteoraPools, getAllOrcaPools } from './database.js';

export async function checkArbitrage() {
    const meteoraPools = await getAllMeteoraPools();
    const orcaPools = await getAllOrcaPools();

    for (const mPool of meteoraPools) {
        const oPool = orcaPools.find(op => op.pair === mPool.pair);
        //Need to change this to compare address_a with addres_x and address_b with address_y
        console.log(oPool);

        // if (oPool) {
        //     const priceDiff = ((oPool.price - mPool.price) / mPool.price) * 100;

        //     if (Math.abs(priceDiff) > 1) {
        //         console.log(`Arbitrage detected on ${mPool.pair}:`);
        //         console.log(`   Meteora: $${mPool.price}, Orca: $${oPool.price}`);
        //         console.log(`   Diff ${priceDiff.toFixed(2)}%`);
        //     }
        // }
    }
}