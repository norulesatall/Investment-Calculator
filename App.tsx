
import React, { useState, useMemo } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useInvestmentCalculator } from './hooks/useInvestmentCalculator';
import { CalculationInput, CalculationResult, ContributionFrequency, CalculationMode } from './types';
import { GithubIcon } from './components/icons/GithubIcon';

const TABS = [
  { id: CalculationMode.EndAmount, label: 'End Balance' },
  { id: CalculationMode.AdditionalContribution, label: 'Additional Contribution' },
  { id: CalculationMode.InvestmentLength, label: 'Investment Length' },
];

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculationMode>(CalculationMode.EndAmount);
  const [input, setInput] = useState<CalculationInput>({
    initialAmount: 10000,
    monthlyContribution: 500,
    years: 20,
    interestRate: 7,
    contributionFrequency: ContributionFrequency.Monthly,
    targetAmount: 1000000,
  });

  const calculator = useInvestmentCalculator();

  const results: CalculationResult | null = useMemo(() => {
    try {
      return calculator.calculate(input, mode);
    } catch (error) {
      console.error(error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, mode]);

  const handleInputChange = (field: keyof CalculationInput, value: string | number | ContributionFrequency) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary font-sans antialiased">
      <header className="bg-bg-light p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-brand-primary">
            Investment Growth Calculator
          </h1>
          <a href="https://github.com/gemini-apps/investment-calculator" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <GithubIcon className="w-6 h-6" />
          </a>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-bg-light p-6 rounded-lg shadow-lg">
                <div className="mb-6">
                  <div className="flex border-b border-gray-700">
                    {TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setMode(tab.id)}
                        className={`py-2 px-4 text-sm font-medium transition-colors focus:outline-none
                          ${mode === tab.id 
                            ? 'border-b-2 border-brand-primary text-brand-primary' 
                            : 'text-text-secondary hover:text-text-primary'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <CalculatorForm 
                  input={input} 
                  mode={mode}
                  onInputChange={handleInputChange} 
                />
            </div>
          </div>
          <div className="lg:col-span-3">
            {results ? (
              <ResultsDisplay results={results} />
            ) : (
              <div className="flex items-center justify-center h-full bg-bg-light rounded-lg p-8">
                <p className="text-text-secondary text-center">Enter your investment details to see the projection. The calculation may not be possible with the current inputs.</p>
              </div>
            )}
          </div>
        </div>
      </main>

       <footer className="text-center p-4 mt-8 text-text-secondary text-sm">
        <p>This calculator is for illustrative purposes only and does not constitute financial advice.</p>
      </footer>
    </div>
  );
};

export default App;
