import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_DEVELOPER_PROFILE } from '@/data/developerProfile'
import { DEFAULT_TERMS, type TermSectionSeed } from '@/data/defaultTerms'

export interface DeveloperProfileState {
  name: string
  businessName: string | null
  title: string
  email: string
  phone: string
  location: string
  portfolioUrl: string
  githubUrl: string
  linkedinUrl: string
  bio: string
  skills: string[]
  experience: string
  logoDataUrl: string | null
  currency: string
  hourlyRate: number
  defaultPricingMode: 'HOURLY' | 'FIXED'
}

interface SettingsStore {
  profile: DeveloperProfileState
  updateProfile: (patch: Partial<DeveloperProfileState>) => void
  terms: TermSectionSeed[]
  updateTerm: (key: string, contentMd: string) => void
  proposalNumberPrefix: string
  nextProposalNumber: number
  nextProposalNumberValue: () => string
  consumeProposalNumber: () => string
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      profile: {
        ...DEFAULT_DEVELOPER_PROFILE,
        businessName: null,
        location: 'Karachi, Pakistan',
        logoDataUrl: null,
        skills: [...DEFAULT_DEVELOPER_PROFILE.skills],
      },
      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      terms: DEFAULT_TERMS,
      updateTerm: (key, contentMd) =>
        set((s) => ({ terms: s.terms.map((t) => (t.key === key ? { ...t, contentMd } : t)) })),

      proposalNumberPrefix: 'Q-',
      nextProposalNumber: 1000,
      nextProposalNumberValue: () => `${get().proposalNumberPrefix}${get().nextProposalNumber}`,
      consumeProposalNumber: () => {
        const value = get().nextProposalNumberValue()
        set((s) => ({ nextProposalNumber: s.nextProposalNumber + 1 }))
        return value
      },
    }),
    { name: 'proposalforge.settings' },
  ),
)
