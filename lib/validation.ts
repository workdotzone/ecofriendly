/** Shared lead-form validation (used by the browser forms and re-checked by /api/leads). */

/** Accepts "9876543210", "+91 98765 43210", "098765-43210" → returns "9876543210", or "" if invalid. */
export function normalizeIndianMobile(input: unknown) {
  if (typeof input !== "string") return "";
  let digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : "";
}

export function cleanText(input: unknown, max = 200) {
  if (typeof input !== "string") return "";
  // Strip control characters, collapse whitespace, cap length.
  return input.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
