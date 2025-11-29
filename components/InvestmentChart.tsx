
import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { YearlyData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface InvestmentChartProps {
  data: YearlyData[];
}

export const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    ...item,
    principal: item.totalContributions,
    interest: item.endingBalance - item.totalContributions,
  }));

  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-light p-4 border border-gray-600 rounded-lg shadow-lg">
          <p className="font-bold text-text-primary">{`Year ${label}`}</p>
          <p className="text-blue-400">{`Total Contributions: ${formatCurrency(payload[0].value)}`}</p>
          <p className="text-teal-400">{`Total Interest: ${formatCurrency(payload[1].value)}`}</p>
           <p className="text-text-secondary mt-1">{`Ending Balance: ${formatCurrency(payload[0].payload.endingBalance)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
        <XAxis dataKey="year" stroke="#9ca3af" tick={{ fill: '#d1d5db' }} />
        <YAxis 
          stroke="#9ca3af" 
          tickFormatter={(value) => formatCurrency(value, 0)} 
          tick={{ fill: '#d1d5db' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{color: '#d1d5db'}} />
        <Line 
          type="monotone" 
          dataKey="principal" 
          name="Total Contributions" 
          stroke="#38bdf8" 
          strokeWidth={2} 
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="interest" 
          name="Total Interest" 
          stroke="#2dd4bf" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
