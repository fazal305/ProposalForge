import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_DEVELOPER_PROFILE } from '@/data/developerProfile'
import { DEFAULT_TERMS } from '@/data/defaultTerms'
export const useSettingsStore = create()(
  persist(
    (set, get) => ({
      profile: {
        ...DEFAULT_DEVELOPER_PROFILE,
        businessName: null,
        location: 'Karachi, Pakistan',
        logoDataUrl: null,
        skills: [...DEFAULT_DEVELOPER_PROFILE.skills],
      },
      updateProfile: (patch) =>
        set((s) => ({
          profile: {
            ...s.profile,
            ...patch,
          },
        })),
      terms: DEFAULT_TERMS,
      updateTerm: (key, contentMd) =>
        set((s) => ({
          terms: s.terms.map((t) =>
            t.key === key
              ? {
                  ...t,
                  contentMd,
                }
              : t,
          ),
        })),
      proposalNumberPrefix: 'Q-',
      nextProposalNumber: 1000,
      nextProposalNumberValue: () => `${get().proposalNumberPrefix}${get().nextProposalNumber}`,
      consumeProposalNumber: () => {
        const value = get().nextProposalNumberValue()
        set((s) => ({
          nextProposalNumber: s.nextProposalNumber + 1,
        }))
        return value
      },
    }),
    {
      name: 'proposalforge.settings',
    },
  ),
)
