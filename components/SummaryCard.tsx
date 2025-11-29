
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  colorClass?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, colorClass = 'text-text-primary' }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
};
