
import { CalculationInput, CalculationResult, YearlyData, ContributionFrequency, CalculationMode } from '../types';
import { formatCurrency } from '../utils/formatters';

const solveForEndBalance = (input: CalculationInput): CalculationResult => {
    const { initialAmount, monthlyContribution, years, interestRate, contributionFrequency } = input;

    const yearlyBreakdown: YearlyData[] = [];
    let currentBalance = initialAmount;
    let totalPrincipal = initialAmount;
    
    const annualInterestRate = interestRate / 100;

    if (contributionFrequency === ContributionFrequency.Monthly) {
        const months = years * 12;
        const monthlyInterestRate = annualInterestRate / 12;
        let yearlyInterestEarned = 0;
        let yearlyContributions = 0;
        let balanceAtStartOfYear = initialAmount;

        for (let month = 1; month <= months; month++) {
            const interestForMonth = currentBalance * monthlyInterestRate;
            currentBalance += interestForMonth;
            yearlyInterestEarned += interestForMonth;

            currentBalance += monthlyContribution;
            totalPrincipal += monthlyContribution;
            yearlyContributions += monthlyContribution;

            if (month % 12 === 0 || month === months) {
                const year = Math.ceil(month / 12);
                yearlyBreakdown.push({
                    year: year,
                    startingBalance: balanceAtStartOfYear,
                    totalContributions: totalPrincipal,
                    interestEarned: yearlyInterestEarned,
                    endingBalance: currentBalance,
                });
                balanceAtStartOfYear = currentBalance;
                yearlyInterestEarned = 0;
                yearlyContributions = 0;
            }
        }
    } else { // Annually
        let balanceAtStartOfYear = initialAmount;
        for (let year = 1; year <= years; year++) {
            const annualContribution = monthlyContribution * 12;
            currentBalance += annualContribution;
            totalPrincipal += annualContribution;

            const interestForYear = currentBalance * annualInterestRate;
            currentBalance += interestForYear;

            yearlyBreakdown.push({
                year: year,
                startingBalance: balanceAtStartOfYear,
                totalContributions: totalPrincipal,
                interestEarned: interestForYear,
                endingBalance: currentBalance,
            });
            balanceAtStartOfYear = currentBalance;
        }
    }
    
    const totalInterest = currentBalance - totalPrincipal;
    const summaryMessage = `After ${years} years, your investment is projected to be ${formatCurrency(currentBalance)}.`;

    return {
      endBalance: currentBalance,
      totalPrincipal,
      totalInterest,
      yearlyBreakdown,
      summaryMessage,
    };
};

const solveForContribution = (input: CalculationInput): CalculationResult => {
    const { initialAmount, years, interestRate, contributionFrequency, targetAmount } = input;
    const annualRate = interestRate / 100;
    
    if (targetAmount <= initialAmount) {
       throw new Error("Target amount must be greater than initial amount.");
    }
    
    let n, r;
    if (contributionFrequency === ContributionFrequency.Monthly) {
        n = years * 12;
        r = annualRate / 12;
    } else {
        n = years;
        r = annualRate;
    }

    if (r === 0) { // Handle zero interest rate case
      const requiredPrincipal = targetAmount - initialAmount;
      const pmt = requiredPrincipal / n;
       const newInputs = { ...input, monthlyContribution: contributionFrequency === ContributionFrequency.Monthly ? pmt : pmt / 12 };
       const result = solveForEndBalance(newInputs);
       return {
            ...result,
            calculatedContribution: pmt,
            summaryMessage: `To reach ${formatCurrency(targetAmount)}, you need to contribute ${formatCurrency(pmt)} per ${contributionFrequency === 'Monthly' ? 'month' : 'year'}.`
       }
    }

    const futureValueFactor = Math.pow(1 + r, n);
    const pmt = (targetAmount - initialAmount * futureValueFactor) / ((futureValueFactor - 1) / r);

    if (pmt <= 0) {
        throw new Error("Target is achievable without further contributions or inputs are invalid.");
    }

    const finalMonthlyContribution = contributionFrequency === ContributionFrequency.Monthly ? pmt : pmt / 12;
    const result = solveForEndBalance({ ...input, monthlyContribution: finalMonthlyContribution });
    return {
        ...result,
        calculatedContribution: pmt,
        summaryMessage: `To reach ${formatCurrency(targetAmount)}, you need to contribute ${formatCurrency(pmt)} per ${contributionFrequency === 'Monthly' ? 'month' : 'year'}.`
    };
};

const solveForLength = (input: CalculationInput): CalculationResult => {
    const { initialAmount, monthlyContribution, interestRate, contributionFrequency, targetAmount } = input;

    if (targetAmount <= initialAmount) {
        throw new Error("Target amount must be greater than initial amount.");
    }
    
    const annualRate = interestRate / 100;
    let r, pmt;
    if (contributionFrequency === ContributionFrequency.Monthly) {
        r = annualRate / 12;
        pmt = monthlyContribution;
    } else {
        r = annualRate;
        pmt = monthlyContribution * 12;
    }

    if (r === 0) {
      if (pmt <= 0) throw new Error("Contributions must be positive if interest rate is zero.");
      const n = (targetAmount - initialAmount) / pmt;
      const years = contributionFrequency === 'Monthly' ? n / 12 : n;
      const result = solveForEndBalance({ ...input, years });
      return {
          ...result,
          calculatedYears: years,
          summaryMessage: `It will take approximately ${years.toFixed(1)} years to reach ${formatCurrency(targetAmount)}.`
      };
    }

    // If interest earned on initial amount alone outpaces contributions needed
    if (initialAmount * r >= pmt && targetAmount > initialAmount) {
        if (pmt <= 0 && interestRate > 0) {
            // Growth from initial amount only
            const n = Math.log(targetAmount / initialAmount) / Math.log(1 + r);
            const years = contributionFrequency === 'Monthly' ? n / 12 : n;
            const result = solveForEndBalance({ ...input, years });
             return {
                ...result,
                calculatedYears: years,
                summaryMessage: `It will take approximately ${years.toFixed(1)} years to reach ${formatCurrency(targetAmount)} with no additional contributions.`
            };
        }
    }

    const numerator = Math.log((targetAmount * r + pmt) / (initialAmount * r + pmt));
    const denominator = Math.log(1 + r);
    const n = numerator / denominator;

    if (n < 0 || !isFinite(n)) {
        throw new Error("Cannot reach target with these contributions and interest rate.");
    }

    const years = contributionFrequency === ContributionFrequency.Monthly ? n / 12 : n;
    const result = solveForEndBalance({ ...input, years });
    return {
        ...result,
        calculatedYears: years,
        summaryMessage: `It will take approximately ${years.toFixed(1)} years to reach ${formatCurrency(targetAmount)}.`
    };
}


export const useInvestmentCalculator = () => {
    const calculate = (input: CalculationInput, mode: CalculationMode): CalculationResult => {
        switch(mode) {
            case CalculationMode.EndAmount:
                return solveForEndBalance(input);
            case CalculationMode.AdditionalContribution:
                return solveForContribution(input);
            case CalculationMode.InvestmentLength:
                return solveForLength(input);
            default:
                throw new Error("Invalid calculation mode");
        }
    };

  return { calculate };
};
