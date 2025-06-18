import axios from 'axios';
import { scheduleJob } from 'node-schedule';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
const BACKEND_URL = 'http://nuxtapp:3000/api/prices'

async function fetchBitcoinPrice() {
    try {
        const response = await axios.get(API_URL);
        const price = response.data.bitcoin.usd;

        await axios.post(BACKEND_URL, { price: price })

        console.log(`[${new Date().toISOString()}] Price saved: ${price} USD`);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

scheduleJob({ rule: '*/10 * * * * *' }, fetchBitcoinPrice);

console.log('Fetcher service started...');
