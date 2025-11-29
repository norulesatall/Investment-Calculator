
import React from 'react';
import { CalculationInput, ContributionFrequency, CalculationMode } from '../types';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

interface CalculatorFormProps {
  input: CalculationInput;
  mode: CalculationMode;
  onInputChange: (field: keyof CalculationInput, value: string | number | ContributionFrequency) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ input, mode, onInputChange }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary mb-4 border-b-2 border-brand-primary pb-2">Investment Parameters</h2>
      
      {mode !== CalculationMode.EndAmount && (
         <FormInput
          label="Your Target ($)"
          id="targetAmount"
          type="number"
          value={input.targetAmount.toString()}
          onChange={(e) => onInputChange('targetAmount', parseFloat(e.target.value) || 0)}
        />
      )}

      <FormInput
        label="Starting Amount ($)"
        id="initialAmount"
        type="number"
        value={input.initialAmount.toString()}
        onChange={(e) => onInputChange('initialAmount', parseFloat(e.target.value) || 0)}
      />
      
      {mode !== CalculationMode.AdditionalContribution && (
        <FormInput
          label="Additional Contribution ($)"
          id="monthlyContribution"
          type="number"
          value={input.monthlyContribution.toString()}
          onChange={(e) => onInputChange('monthlyContribution', parseFloat(e.target.value) || 0)}
        />
      )}

       <FormSelect
        label="Contribution Frequency"
        id="contributionFrequency"
        value={input.contributionFrequency}
        onChange={(e) => onInputChange('contributionFrequency', e.target.value as ContributionFrequency)}
        options={[
            { value: ContributionFrequency.Monthly, label: 'Monthly' },
            { value: ContributionFrequency.Annually, label: 'Annually' },
        ]}
      />

      {mode !== CalculationMode.InvestmentLength && (
        <FormInput
          label="Years to Grow"
          id="years"
          type="number"
          value={input.years.toString()}
          onChange={(e) => onInputChange('years', parseInt(e.target.value, 10) || 0)}
        />
      )}


       <FormInput
        label="Estimated Interest Rate (%)"
        id="interestRate"
        type="number"
        step="0.1"
        value={input.interestRate.toString()}
        onChange={(e) => onInputChange('interestRate', parseFloat(e.target.value) || 0)}
      />
    </div>
  );
};
