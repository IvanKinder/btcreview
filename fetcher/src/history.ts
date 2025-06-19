import axios from 'axios';

interface BitcoinPrice {
    price: number;
    timestamp: Date;
}

interface ApiResponse {
    success: boolean;
    count?: number;
    error?: string;
}

const API_URL = 'https://api.binance.com/api/v3/klines'
const BACKEND_URL = process.env.API_URL || 'http://nuxtapp:3000/api/history';

const fetchBinanceHistory = async (): Promise<BitcoinPrice[]> => {
    const response = await axios.get(
        API_URL,
        {
            params: {
                symbol: 'BTCUSDT',
                interval: '1d',
                limit: 1000
            },
            timeout: 3000
        }
    );
    return response.data?.map((item: any) => ({
        timestamp: new Date(item[0]),
        price: parseFloat(item[4]) // Цена закрытия
    }));
};

export const fetchHistoricalData = async (): Promise<void> => {
    try {
        const prices: BitcoinPrice[] = await fetchBinanceHistory();

        const { data } = await axios.post<ApiResponse>(
            BACKEND_URL,
            {
                truncate: false, // если хотим очистить базу ( для удобства )
                prices,
                timeout: 10000,
            }
        );

        if (!data.success) {
            throw new Error(data.error || 'Failed to import historical data');
        }

        console.log(`✅ Успешно импортировано ${data.count} записей`);
        console.log(`⏰ Первая дата: ${prices[0].timestamp.toISOString()}`);
        console.log(`⏰ Последняя дата: ${prices[prices.length - 1].timestamp.toISOString()}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('🚨 Ошибка сети:', error.message);
            if (error.response) {
                console.error('📡 Статус:', error.response.status);
                console.error('📦 Данные:', error.response.data);
            }
        } else if (error instanceof Error) {
            console.error('🚨 Ошибка:', error.message);
        }
        process.exit(1);
    }
}
