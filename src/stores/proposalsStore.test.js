import { beforeEach, describe, expect, it } from 'vitest'
import { useProposalsStore } from './proposalsStore'
function makeProposal() {
  return useProposalsStore.getState().createProposal(
    {
      projectId: 'proj_1',
      templateId: 'tpl_1',
      currency: 'USD',
      pricingMode: 'FIXED',
      sections: [
        {
          sectionKey: 'cover',
          title: 'Cover',
          contentMd: 'Hello {{client.name}}',
          orderIndex: 0,
        },
      ],
    },
    'Q-1000',
  )
}
beforeEach(() => {
  localStorage.clear()
  useProposalsStore.setState({
    proposals: [],
  })
})
describe('createProposal', () => {
  it('starts as a draft with a public token and zero totals', () => {
    const p = makeProposal()
    expect(p.status).toBe('DRAFT')
    expect(p.publicToken).toMatch(/^pt_/)
    expect(p.total).toBe(0)
  })
})
describe('pricing recalculation', () => {
  it('recomputes totals whenever a pricing item changes', () => {
    const p = makeProposal()
    useProposalsStore.getState().addPricingItem(p.id, {
      name: 'Website',
      description: null,
      quantity: 2,
      unitPrice: 100,
    })
    const updated = useProposalsStore.getState().getProposal(p.id)
    expect(updated.subtotal).toBe(200)
    expect(updated.total).toBe(200)
  })
})
describe('duplicateProposal', () => {
  it('creates an independent draft copy without mutating the original', () => {
    const original = makeProposal()
    useProposalsStore.getState().addPricingItem(original.id, {
      name: 'Website',
      description: null,
      quantity: 1,
      unitPrice: 500,
    })
    useProposalsStore.getState().sendProposal(original.id)
    const copy = useProposalsStore.getState().duplicateProposal(original.id, 'Q-1001')
    const originalBefore = useProposalsStore.getState().getProposal(original.id)
    expect(copy.status).toBe('DRAFT')
    expect(copy.id).not.toBe(original.id)
    expect(copy.pricingItems[0].id).not.toBe(originalBefore.pricingItems[0].id)
    expect(copy.pricingItems[0].name).toBe('Website')

    // mutating the copy must not affect the original
    useProposalsStore.getState().updatePricingItem(copy.id, copy.pricingItems[0].id, {
      unitPrice: 999,
    })
    const originalAfter = useProposalsStore.getState().getProposal(original.id)
    expect(originalAfter.pricingItems[0].unitPrice).toBe(500)
  })
})
describe('sendProposal / status transitions', () => {
  it('freezes an immutable version snapshot on send', () => {
    const p = makeProposal()
    useProposalsStore.getState().sendProposal(p.id)
    const sent = useProposalsStore.getState().getProposal(p.id)
    expect(sent.status).toBe('SENT')
    expect(sent.currentVersion).toBe(1)
    expect(sent.versions).toHaveLength(1)
  })
  it('editing a sent proposal does not rewrite the frozen version snapshot', () => {
    const p = makeProposal()
    useProposalsStore.getState().sendProposal(p.id)
    const versionBefore = useProposalsStore.getState().getProposal(p.id).versions[0]
    useProposalsStore.getState().updateSection(p.id, p.sections[0].id, 'Edited after sending')
    const versionAfter = useProposalsStore.getState().getProposal(p.id).versions[0]
    expect(versionAfter).toEqual(versionBefore)
  })
  it('marks a sent proposal as viewed when the client opens it', () => {
    const p = makeProposal()
    useProposalsStore.getState().sendProposal(p.id)
    useProposalsStore.getState().markViewed(p.id)
    expect(useProposalsStore.getState().getProposal(p.id).status).toBe('VIEWED')
  })
  it('records a client approval and updates status', () => {
    const p = makeProposal()
    useProposalsStore.getState().sendProposal(p.id)
    useProposalsStore.getState().recordApproval(p.id, 'APPROVED', 'Jordan Blake', 'Looks great')
    const approved = useProposalsStore.getState().getProposal(p.id)
    expect(approved.status).toBe('APPROVED')
    expect(approved.approvals[0]).toMatchObject({
      decision: 'APPROVED',
      clientName: 'Jordan Blake',
      comment: 'Looks great',
    })
  })
})
