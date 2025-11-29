
export enum ContributionFrequency {
  Monthly = 'Monthly',
  Annually = 'Annually',
}

export enum CalculationMode {
  EndAmount = 'EndAmount',
  AdditionalContribution = 'AdditionalContribution',
  InvestmentLength = 'InvestmentLength',
}

export interface CalculationInput {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  interestRate: number;
  contributionFrequency: ContributionFrequency;
  targetAmount: number;
}

export interface YearlyData {
  year: number;
  startingBalance: number;
  interestEarned: number;
  totalContributions: number;
  endingBalance: number;
}

export interface CalculationResult {
  endBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  yearlyBreakdown: YearlyData[];
  summaryMessage: string;
  calculatedYears?: number;
  calculatedContribution?: number;
}
