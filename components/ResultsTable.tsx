
import React from 'react';
import { YearlyData } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultsTableProps {
  data: YearlyData[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-text-primary">Year</th>
            <th scope="col" className="py-3.5 px-4 text-right text-sm font-semibold text-text-primary">Starting Balance</th>
            <th scope="col" className="py-3.5 px-4 text-right text-sm font-semibold text-text-primary">Interest Earned</th>
            <th scope="col" className="py-3.5 px-4 text-right text-sm font-semibold text-text-primary">Total Contributions</th>
            <th scope="col" className="py-3.5 px-4 text-right text-sm font-semibold text-text-primary">Ending Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-bg-light">
          {data.map((row) => (
            <tr key={row.year} className="hover:bg-gray-700 transition-colors">
              <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-text-primary">{row.year}</td>
              <td className="whitespace-nowrap py-4 px-4 text-sm text-right text-text-secondary">{formatCurrency(row.startingBalance)}</td>
              <td className="whitespace-nowrap py-4 px-4 text-sm text-right text-text-secondary">{formatCurrency(row.interestEarned)}</td>
              <td className="whitespace-nowrap py-4 px-4 text-sm text-right text-text-secondary">{formatCurrency(row.totalContributions)}</td>
              <td className="whitespace-nowrap py-4 px-4 text-sm text-right font-semibold text-brand-primary">{formatCurrency(row.endingBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
