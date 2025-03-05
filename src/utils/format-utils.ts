/**
 * Formats a number with commas as thousands separators
 * For large numbers, uses abbreviations (K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc)
 */
export function formatNumber(num: number): string {
  if (num === 0) return "0";

  // Define suffixes for large numbers
  const suffixes = [
    "",
    "K",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
  ];

  // Determine the appropriate suffix and scaling factor
  const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
  const scaledNum = num / Math.pow(10, magnitude * 3);

  // Cap at the highest suffix we have
  const suffixIndex = Math.min(magnitude, suffixes.length - 1);

  // Format the number with 1 decimal place if it's not a whole number
  let formatted: string;
  if (scaledNum === Math.floor(scaledNum)) {
    formatted = scaledNum.toString();
  } else {
    // Limit to 2 decimal places for readability
    formatted = scaledNum.toFixed(2);
    // Remove trailing zeros
    formatted = formatted.replace(/\.?0+$/, "");
  }

  return formatted + suffixes[suffixIndex];
}

/**
 * Formats a cost to show if it's affordable
 */
export function formatCost(cost: number, available: number): string {
  const formatted = formatNumber(cost);
  return available >= cost
    ? formatted
    : `<span class="text-red-500">${formatted}</span>`;
}
