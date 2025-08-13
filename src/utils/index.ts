export const formatPrice = (
  amount: number | string,
  opts?: { currency?: string; locale?: string; maximumFractionDigits?: number }
) => {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  const currency = (opts?.currency || 'BAM').toUpperCase() === 'KM' ? 'BAM' : (opts?.currency || 'BAM');
  const locale = opts?.locale || 'bs-BA';
  const maximumFractionDigits = typeof opts?.maximumFractionDigits === 'number' ? opts.maximumFractionDigits : 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,                 // ISO: BAM
      currencyDisplay: 'narrowSymbol', // u bs-BA daje “KM”
      maximumFractionDigits,
    }).format(value);
  } catch {
    // Fallback – nikad ne ruši build
    return `${Math.round(value)} KM`;
  }
};
