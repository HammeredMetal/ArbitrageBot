import axios from 'axios';

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