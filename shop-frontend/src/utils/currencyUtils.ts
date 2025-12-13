/**
 * Utility functions for currency formatting
 */

/**
 * Formats a number as currency (VND or USD)
 * @param amount - The amount in VND
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | string | undefined | null
): string => {
  const currency = localStorage.getItem("currency") || "VND";
  const rate = Number(process.env.REACT_APP_USD_RATE || 24000);
  const numAmount = Number(amount || 0);

  if (currency === "USD") {
    const usdAmount = numAmount / rate;
    // Format with 2 decimal places for USD
    return `$${usdAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  // Format VND without decimals
  return `${numAmount.toLocaleString("vi-VN")} ₫`;
};

/**
 * Gets the current currency setting
 */
export const getCurrency = (): "VND" | "USD" => {
  return (localStorage.getItem("currency") || "VND") as "VND" | "USD";
};

/**
 * Gets the USD conversion rate
 */
export const getUSDRate = (): number => {
  return Number(process.env.REACT_APP_USD_RATE || 24000);
};

/**
 * Converts VND to USD
 */
export const vndToUSD = (vnd: number): number => {
  const rate = getUSDRate();
  return vnd / rate;
};

/**
 * Converts USD to VND
 */
export const usdToVND = (usd: number): number => {
  const rate = getUSDRate();
  return usd * rate;
};
