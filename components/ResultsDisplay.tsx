
import React, { useState } from 'react';
import { CalculationResult } from '../types';
import { SummaryCard } from './SummaryCard';
import { InvestmentChart } from './InvestmentChart';
import { ResultsTable } from './ResultsTable';
import { formatCurrency } from '../utils/formatters';

interface ResultsDisplayProps {
  results: CalculationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="bg-bg-light p-6 rounded-lg shadow-lg space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-4 border-b-2 border-brand-primary pb-2">Projection Results</h2>
        
        <div className="text-center p-4 bg-gray-800 rounded-lg mb-6">
          <p className="text-lg text-text-primary whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: results.summaryMessage.replace(/(\$\d{1,3}(,\d{3})*(\.\d+)?)/g, '<strong class="text-brand-primary">$&</strong>') }}></p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <SummaryCard title="End Balance" value={formatCurrency(results.endBalance)} />
          <SummaryCard title="Total Principal" value={formatCurrency(results.totalPrincipal)} />
          <SummaryCard title="Total Interest" value={formatCurrency(results.totalInterest)} colorClass="text-brand-primary" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-4">Investment Growth Over Time</h3>
        <div className="h-80 w-full">
          <InvestmentChart data={results.yearlyBreakdown} />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowTable(!showTable)}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-dark"
        >
          {showTable ? 'Hide' : 'Show'} Year-by-Year Breakdown
        </button>
      </div>

      {showTable && (
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-4">Annual Breakdown</h3>
          <ResultsTable data={results.yearlyBreakdown} />
        </div>
      )}
    </div>
  );
};
