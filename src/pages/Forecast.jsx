import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ForecastSuggestion = ({ data }) => {
    if (!data || data.length < 2) return null;
    const endBalance = parseFloat(data[data.length - 1].projectedBalance);
    const startBalance = parseFloat(data[0].projectedBalance);
    const isTrendingUp = endBalance > startBalance;

    return (
        <div className={`mt-6 p-4 rounded-lg ${isTrendingUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <h3 className="font-bold">Forecast Suggestion</h3>
            {isTrendingUp ? (
                <p>Your projected balance is trending upwards. Keep up the great work!</p>
            ) : (
                <p>Your projected balance is trending downwards. Consider reviewing your budgets or finding ways to increase income.</p>
            )}
        </div>
    );
};

const Forecast = () => {
    const [forecastData, setForecastData] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForecast = async () => {
            setLoading(true);
            try {
                const res = await api.get('/forecasting');
                setForecastData(res.data.forecast);
                if(res.data.message) setMessage(res.data.message);
            } catch (err) {
                console.error("Failed to fetch forecast", err);
                setMessage('Could not generate a forecast.');
            } finally {
                setLoading(false);
            }
        };
        fetchForecast();
    }, []);

    const chartData = {
        labels: forecastData.map(d => d.month),
        datasets: [{
            label: 'Projected Balance',
            data: forecastData.map(d => d.projectedBalance),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
        }],
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Financial Forecast</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">6-Month Balance Projection</h2>
                    {loading ? <p>Generating forecast...</p> : message ? <p>{message}</p> : (
                        <>
                            <Line data={chartData} />
                            <ForecastSuggestion data={forecastData} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Forecast;

