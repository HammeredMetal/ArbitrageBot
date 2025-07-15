
import { getAllMeteoraPools, getAllOrcaPools } from './database.js';

export async function checkArbitrage() {
    const meteoraPools = await getAllMeteoraPools();
    const orcaPools = await getAllOrcaPools();

    for (const mPool of meteoraPools) {
        const oPool = orcaPools.find(op => (op.address_a === mPool.address_x) && (op.address_b === mPool.address_y));
        if (!oPool) continue;

        // console.log("Comparable pairs found: ", oPool, mPool);

        if (oPool) {
            const priceDiff = ((oPool.price - mPool.price) / mPool.price) * 100;

            if (Math.abs(priceDiff) > 1) {
                console.log(`Arbitrage detected on ${mPool.pair}:`);
                console.log(`   Meteora: $${mPool.price}, Orca: $${oPool.price}`);
                console.log(`   Diff ${priceDiff.toFixed(2)}%`);
                console.log("Meteora Pair: ", mPool)
                console.log("Orca pair: ", oPool)
            }
        }
    }
}