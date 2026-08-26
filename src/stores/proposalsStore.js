import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, generatePublicToken } from '@/lib/id'
import { calcPaymentSchedule, calcTotals } from '@/lib/pricing'
function recalcTotals(p) {
  const items = p.pricingItems.map((i) => ({
    quantity: i.quantity,
    unitPrice: i.unitPrice,
  }))
  const totals = calcTotals(
    items,
    {
      type: p.discountType,
      value: p.discountValue,
    },
    {
      ratePercent: p.taxRatePercent,
    },
  )
  const paymentSchedules = calcPaymentSchedule(
    totals.total,
    p.paymentSchedules.map((e) => ({
      label: e.label,
      percent: e.percent,
    })),
  ).map((e, index) => ({
    id: p.paymentSchedules[index]?.id ?? generateId('ps_'),
    label: e.label,
    percent: e.percent,
    amount: e.amount,
    dueOn: p.paymentSchedules[index]?.dueOn ?? null,
    orderIndex: index,
  }))
  return {
    ...p,
    ...totals,
    paymentSchedules,
    updatedAt: new Date().toISOString(),
  }
}
function touch(proposals, id, fn) {
  return proposals.map((p) => (p.id === id ? recalcTotals(fn(p)) : p))
}
function logActivity(p, type, message) {
  return {
    ...p,
    activity: [
      {
        id: generateId('act_'),
        type,
        message,
        createdAt: new Date().toISOString(),
      },
      ...p.activity,
    ],
  }
}
export const useProposalsStore = create()(
  persist(
    (set, get) => ({
      proposals: [],
      createProposal: (input, proposalNumber) => {
        const proposal = {
          id: generateId('prop_'),
          projectId: input.projectId,
          templateId: input.templateId,
          number: proposalNumber,
          status: 'DRAFT',
          publicToken: generatePublicToken(),
          currency: input.currency,
          pricingMode: input.pricingMode,
          estimatedHours: null,
          discountType: 'FLAT',
          discountValue: 0,
          taxRatePercent: 0,
          subtotal: 0,
          discount: 0,
          tax: 0,
          total: 0,
          validUntil: null,
          currentVersion: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sentAt: null,
          viewedAt: null,
          sections: input.sections.map((s) => ({
            ...s,
            id: generateId('psec_'),
          })),
          scopeItems: [],
          milestones: [],
          pricingItems: [],
          paymentSchedules: [],
          activity: [
            {
              id: generateId('act_'),
              type: 'created',
              message: 'Proposal created from template',
              createdAt: new Date().toISOString(),
            },
          ],
          approvals: [],
          views: [],
          versions: [],
        }
        set((s) => ({
          proposals: [proposal, ...s.proposals],
        }))
        return proposal
      },
      duplicateProposal: (id, newNumber) => {
        const source = get().proposals.find((p) => p.id === id)
        if (!source) return undefined
        const remapIds = (arr, prefix) =>
          arr.map((item) => ({
            ...item,
            id: generateId(prefix),
          }))
        const copy = {
          ...source,
          id: generateId('prop_'),
          number: newNumber,
          status: 'DRAFT',
          publicToken: generatePublicToken(),
          currentVersion: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sentAt: null,
          viewedAt: null,
          sections: remapIds(source.sections, 'psec_'),
          scopeItems: remapIds(source.scopeItems, 'si_'),
          milestones: remapIds(source.milestones, 'ms_'),
          pricingItems: remapIds(source.pricingItems, 'pi_'),
          paymentSchedules: remapIds(source.paymentSchedules, 'ps_'),
          activity: [
            {
              id: generateId('act_'),
              type: 'duplicated',
              message: `Duplicated from ${source.number}`,
              createdAt: new Date().toISOString(),
            },
          ],
          approvals: [],
          views: [],
          versions: [],
        }
        set((s) => ({
          proposals: [copy, ...s.proposals],
        }))
        return copy
      },
      deleteProposal: (id) =>
        set((s) => ({
          proposals: s.proposals.filter((p) => p.id !== id),
        })),
      getProposal: (id) => get().proposals.find((p) => p.id === id),
      getProposalByPublicToken: (token) => get().proposals.find((p) => p.publicToken === token),
      proposalsForProject: (projectId) => get().proposals.filter((p) => p.projectId === projectId),
      updateProposalFields: (id, patch) =>
        set((s) => ({
          proposals: touch(s.proposals, id, (p) => ({
            ...p,
            ...patch,
          })),
        })),
      updateSection: (proposalId, sectionId, contentMd) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            sections: p.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    contentMd,
                  }
                : sec,
            ),
          })),
        })),
      addScopeItem: (proposalId, item) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            scopeItems: [
              ...p.scopeItems,
              {
                ...item,
                id: generateId('si_'),
                orderIndex: p.scopeItems.length,
              },
            ],
          })),
        })),
      updateScopeItem: (proposalId, itemId, patch) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            scopeItems: p.scopeItems.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    ...patch,
                  }
                : i,
            ),
          })),
        })),
      deleteScopeItem: (proposalId, itemId) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            scopeItems: p.scopeItems.filter((i) => i.id !== itemId),
          })),
        })),
      reorderScopeItems: (proposalId, orderedIds) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => {
            const byId = new Map(p.scopeItems.map((i) => [i.id, i]))
            return {
              ...p,
              scopeItems: orderedIds.map((id, index) => ({
                ...byId.get(id),
                orderIndex: index,
              })),
            }
          }),
        })),
      addMilestone: (proposalId, milestone) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            milestones: [
              ...p.milestones,
              {
                ...milestone,
                id: generateId('ms_'),
                orderIndex: p.milestones.length,
              },
            ],
          })),
        })),
      updateMilestone: (proposalId, milestoneId, patch) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            milestones: p.milestones.map((m) =>
              m.id === milestoneId
                ? {
                    ...m,
                    ...patch,
                  }
                : m,
            ),
          })),
        })),
      deleteMilestone: (proposalId, milestoneId) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            milestones: p.milestones.filter((m) => m.id !== milestoneId),
          })),
        })),
      reorderMilestones: (proposalId, orderedIds) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => {
            const byId = new Map(p.milestones.map((m) => [m.id, m]))
            return {
              ...p,
              milestones: orderedIds.map((id, index) => ({
                ...byId.get(id),
                orderIndex: index,
              })),
            }
          }),
        })),
      addPricingItem: (proposalId, item) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            pricingItems: [
              ...p.pricingItems,
              {
                ...item,
                id: generateId('pi_'),
                orderIndex: p.pricingItems.length,
              },
            ],
          })),
        })),
      updatePricingItem: (proposalId, itemId, patch) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            pricingItems: p.pricingItems.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    ...patch,
                  }
                : i,
            ),
          })),
        })),
      deletePricingItem: (proposalId, itemId) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            pricingItems: p.pricingItems.filter((i) => i.id !== itemId),
          })),
        })),
      setPaymentScheduleEntries: (proposalId, entries) =>
        set((s) => ({
          proposals: touch(s.proposals, proposalId, (p) => ({
            ...p,
            paymentSchedules: entries.map((e, index) => ({
              id: generateId('ps_'),
              label: e.label,
              percent: e.percent,
              amount: 0,
              dueOn: e.dueOn ?? null,
              orderIndex: index,
            })),
          })),
        })),
      sendProposal: (id) =>
        set((s) => ({
          proposals: s.proposals.map((p) => {
            if (p.id !== id) return p
            const versionNumber = p.currentVersion + 1
            const snapshot = {
              ...p,
              versions: undefined,
              activity: undefined,
            }
            const withVersion = {
              ...p,
              status: 'SENT',
              sentAt: new Date().toISOString(),
              currentVersion: versionNumber,
              versions: [
                ...p.versions,
                {
                  versionNumber,
                  snapshotJson: snapshot,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
            return logActivity(withVersion, 'sent', `Sent as version ${versionNumber}`)
          }),
        })),
      markViewed: (id) =>
        set((s) => ({
          proposals: s.proposals.map((p) => {
            if (p.id !== id) return p
            if (p.status !== 'SENT')
              return p.views.length === 0
                ? logActivity(
                    {
                      ...p,
                      views: [
                        {
                          id: generateId('v_'),
                          viewedAt: new Date().toISOString(),
                        },
                        ...p.views,
                      ],
                    },
                    'viewed',
                    'Client opened the proposal',
                  )
                : p
            const withView = {
              ...p,
              status: 'VIEWED',
              viewedAt: new Date().toISOString(),
              views: [
                {
                  id: generateId('v_'),
                  viewedAt: new Date().toISOString(),
                },
                ...p.views,
              ],
            }
            return logActivity(withView, 'viewed', 'Client opened the proposal')
          }),
        })),
      recordApproval: (id, decision, clientName, comment) =>
        set((s) => ({
          proposals: s.proposals.map((p) => {
            if (p.id !== id) return p
            const statusMap = {
              APPROVED: 'APPROVED',
              REJECTED: 'REJECTED',
              CHANGES_REQUESTED: 'CHANGES_REQUESTED',
            }
            const withApproval = {
              ...p,
              status: statusMap[decision],
              approvals: [
                {
                  id: generateId('appr_'),
                  decision,
                  clientName,
                  comment: comment ?? null,
                  decidedAt: new Date().toISOString(),
                },
                ...p.approvals,
              ],
            }
            const label =
              decision === 'APPROVED' ? 'approved' : decision === 'REJECTED' ? 'rejected' : 'requested changes on'
            return logActivity(
              withApproval,
              decision.toLowerCase(),
              `${clientName} ${label} the proposal${comment ? `: "${comment}"` : ''}`,
            )
          }),
        })),
      archiveProposal: (id) =>
        set((s) => ({
          proposals: s.proposals.map((p) =>
            p.id === id
              ? logActivity(
                  {
                    ...p,
                    status: 'ARCHIVED',
                  },
                  'archived',
                  'Proposal archived',
                )
              : p,
          ),
        })),
    }),
    {
      name: 'proposalforge.proposals',
    },
  ),
)
