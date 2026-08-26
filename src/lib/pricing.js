/**
 * Pure pricing/payment-schedule math. No UI, no state — the pricing builder and the
 * proposal preview both derive their displayed totals from these functions, so a
 * total is never independently typed in by a user; it is always computed.
 */

/** Rounds to 2 decimal places using cent-safe integer math to avoid float drift. */
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
export function lineItemTotal(item) {
  return round2(item.quantity * item.unitPrice)
}
export function calcSubtotal(items) {
  return round2(items.reduce((sum, item) => sum + lineItemTotal(item), 0))
}
export function calcDiscountAmount(subtotal, discount) {
  if (!discount || discount.value <= 0) return 0
  const amount = discount.type === 'PERCENT' ? subtotal * (discount.value / 100) : discount.value
  return round2(Math.min(amount, subtotal))
}
/** Tax is calculated on the post-discount amount. */
export function calcTaxAmount(subtotal, discountAmount, tax) {
  if (!tax || tax.ratePercent <= 0) return 0
  return round2((subtotal - discountAmount) * (tax.ratePercent / 100))
}
export function calcTotals(items, discount, tax) {
  const subtotal = calcSubtotal(items)
  const discountAmount = calcDiscountAmount(subtotal, discount)
  const taxAmount = calcTaxAmount(subtotal, discountAmount, tax)
  const total = round2(subtotal - discountAmount + taxAmount)
  return {
    subtotal,
    discount: discountAmount,
    tax: taxAmount,
    total,
  }
}
/**
 * Distributes `total` across schedule entries by percentage. The last entry absorbs
 * any rounding remainder so the sum of amounts always equals `total` exactly.
 */
export function calcPaymentSchedule(total, entries) {
  if (entries.length === 0) return []
  const withAmounts = entries.map((entry) => ({
    ...entry,
    amount: round2(total * (entry.percent / 100)),
  }))
  const allocated = round2(withAmounts.slice(0, -1).reduce((sum, e) => sum + e.amount, 0))
  const last = withAmounts[withAmounts.length - 1]
  withAmounts[withAmounts.length - 1] = {
    ...last,
    amount: round2(total - allocated),
  }
  return withAmounts
}
export function paymentSchedulePercentTotal(entries) {
  return round2(entries.reduce((sum, e) => sum + e.percent, 0))
}
export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(amount)
}
