
export const formatCurrency = (value: number, minimumFractionDigits = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
};
