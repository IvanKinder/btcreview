import axios from 'axios';
import { scheduleJob } from 'node-schedule';
import { fetchHistoricalData } from './history.js';

const API_URL = 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT';
const BACKEND_URL = 'http://nuxtapp:3000/api/prices'

const fetchBitcoinPrice = async () => {
    try {
        const response = await axios.get(API_URL, { timeout: 3000 });
        const price = parseFloat(response.data.price);

        await axios.post(BACKEND_URL, { price: price })

        console.log(`[${new Date().toISOString()}] Price saved: ${price} USD`);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchHistoricalData()
    .then(() => console.log('🎉 Импорт завершен'))
    .catch(() => process.exit(1));

scheduleJob('1 * * * * *', fetchBitcoinPrice);

console.log('Fetcher service started...');
