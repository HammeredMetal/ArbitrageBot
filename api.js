import axios from 'axios';

const raydiumAPI_URL = 'https://api-v3.raydium.io/';
const orcaAPI_URL = 'https://api.orca.so/v2/solana/';

//Test Raydium endpoints
async function rayVersion() {
    try {
        const response = await axios.get(raydiumAPI_URL + 'main/version');
        return response;
    } catch (error) {
        console.error('Failed to get Raydium version', error);
        throw error
    }
}

//Test Orca endpoints
async function orcaVersion() {
    try {
        const response = await axios.get(orcaAPI_URL + 'health');
        return response;
    } catch (error) {
        console.error('Failed to get Orca version', error);
        throw error
    }
}


export { rayVersion, orcaVersion };