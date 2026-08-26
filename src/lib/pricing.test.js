import { describe, expect, it } from 'vitest'
import {
  calcDiscountAmount,
  calcPaymentSchedule,
  calcSubtotal,
  calcTaxAmount,
  calcTotals,
  paymentSchedulePercentTotal,
} from './pricing'
describe('calcSubtotal', () => {
  it('sums quantity × unit price across line items', () => {
    expect(
      calcSubtotal([
        {
          quantity: 1,
          unitPrice: 150000,
        },
        {
          quantity: 6,
          unitPrice: 10000,
        },
      ]),
    ).toBe(210000)
  })
  it('returns 0 for no items', () => {
    expect(calcSubtotal([])).toBe(0)
  })
  it('avoids floating point drift', () => {
    expect(
      calcSubtotal([
        {
          quantity: 3,
          unitPrice: 0.1,
        },
      ]),
    ).toBe(0.3)
  })
})
describe('calcDiscountAmount', () => {
  it('applies a flat discount', () => {
    expect(
      calcDiscountAmount(1000, {
        type: 'FLAT',
        value: 150,
      }),
    ).toBe(150)
  })
  it('applies a percent discount', () => {
    expect(
      calcDiscountAmount(1000, {
        type: 'PERCENT',
        value: 10,
      }),
    ).toBe(100)
  })
  it('never discounts more than the subtotal', () => {
    expect(
      calcDiscountAmount(100, {
        type: 'FLAT',
        value: 500,
      }),
    ).toBe(100)
  })
  it('returns 0 when discount is null or non-positive', () => {
    expect(calcDiscountAmount(1000, null)).toBe(0)
    expect(
      calcDiscountAmount(1000, {
        type: 'FLAT',
        value: 0,
      }),
    ).toBe(0)
  })
})
describe('calcTaxAmount', () => {
  it('taxes the post-discount amount, not the subtotal', () => {
    // subtotal 1000, discount 200 -> taxable 800, 10% tax -> 80
    expect(
      calcTaxAmount(1000, 200, {
        ratePercent: 10,
      }),
    ).toBe(80)
  })
  it('returns 0 when tax is null or non-positive', () => {
    expect(calcTaxAmount(1000, 0, null)).toBe(0)
  })
})
describe('calcTotals', () => {
  it('matches the worked example from the brief', () => {
    // 1×150,000 + 1×25,000 + 6×10,000 = 235,000; discount 15,000; tax 11,000 -> total 231,000
    const totals = calcTotals(
      [
        {
          quantity: 1,
          unitPrice: 150000,
        },
        {
          quantity: 1,
          unitPrice: 25000,
        },
        {
          quantity: 6,
          unitPrice: 10000,
        },
      ],
      {
        type: 'FLAT',
        value: 15000,
      },
      {
        ratePercent: 5,
      },
    )
    expect(totals.subtotal).toBe(235000)
    expect(totals.discount).toBe(15000)
    expect(totals.tax).toBe(11000)
    expect(totals.total).toBe(231000)
  })
})
describe('calcPaymentSchedule', () => {
  it('distributes total by percent and sums exactly to the total', () => {
    const entries = calcPaymentSchedule(8250, [
      {
        label: 'Milestone 1',
        percent: 50,
      },
      {
        label: 'Milestone 2',
        percent: 25,
      },
      {
        label: 'Final Delivery',
        percent: 25,
      },
    ])
    expect(entries.map((e) => e.amount)).toEqual([4125, 2062.5, 2062.5])
    expect(entries.reduce((sum, e) => sum + e.amount, 0)).toBe(8250)
  })
  it('absorbs rounding remainder in the last entry so the sum is exact', () => {
    const entries = calcPaymentSchedule(100, [
      {
        label: 'A',
        percent: 33.33,
      },
      {
        label: 'B',
        percent: 33.33,
      },
      {
        label: 'C',
        percent: 33.34,
      },
    ])
    expect(entries.reduce((sum, e) => sum + e.amount, 0)).toBe(100)
  })
  it('returns an empty array for no entries', () => {
    expect(calcPaymentSchedule(1000, [])).toEqual([])
  })
})
describe('paymentSchedulePercentTotal', () => {
  it('sums entry percentages', () => {
    expect(
      paymentSchedulePercentTotal([
        {
          label: 'A',
          percent: 50,
        },
        {
          label: 'B',
          percent: 50,
        },
      ]),
    ).toBe(100)
  })
})
