export type ProposalStatus =
  | 'DRAFT'
  | 'SENT'
  | 'VIEWED'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'ARCHIVED'

export const PROPOSAL_STATUS_LABEL: Record<ProposalStatus, string> = {
  DRAFT: 'Draft',
  SENT: 'Sent',
  VIEWED: 'Viewed',
  CHANGES_REQUESTED: 'Changes Requested',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  ARCHIVED: 'Archived',
}

export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED'
export type SectionType = 'STATIC' | 'DYNAMIC'
export type ApprovalDecision = 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
export type PricingMode = 'HOURLY' | 'FIXED'

export interface Client {
  id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  createdAt: string
}

export interface Project {
  id: string
  clientId: string
  name: string
  description: string | null
  problemStatement: string | null
  proposedSolution: string | null
  category: string | null
  techStack: string[]
  estimatedTimeline: string | null
  budget: number | null
  status: ProjectStatus
  notes: string | null
  createdAt: string
}

export interface TemplateSection {
  id: string
  templateId: string
  key: string
  title: string
  type: SectionType
  contentMd: string
  orderIndex: number
  enabled: boolean
}

export interface ProposalTemplate {
  id: string
  name: string
  description: string | null
  theme: ProposalTheme
  isDefault: boolean
  sections: TemplateSection[]
}

export interface ProposalTheme {
  primaryColor: string
  secondaryColor: string
  fontHeading: string
  fontBody: string
  spacing: 'compact' | 'comfortable' | 'spacious'
  radius: 'sharp' | 'soft' | 'round'
  headerStyle: 'centered' | 'left-aligned' | 'split'
  logoUrl?: string | null
}

export interface ScopeItem {
  id: string
  groupTitle: string
  title: string
  description: string | null
  quantity: number
  unit: string
  unitPrice: number | null
  notes: string | null
  included: boolean
  orderIndex: number
}

export interface Milestone {
  id: string
  name: string
  description: string | null
  startDate: string | null
  endDate: string | null
  durationLabel: string | null
  paymentPercent: number | null
  orderIndex: number
}

export interface PricingItem {
  id: string
  name: string
  description: string | null
  quantity: number
  unitPrice: number
  orderIndex: number
}

export interface PaymentScheduleItem {
  id: string
  label: string
  percent: number
  amount: number
  dueOn: string | null
  orderIndex: number
}

export interface ProposalSection {
  id: string
  sectionKey: string
  title: string
  contentMd: string
  orderIndex: number
}

export interface Proposal {
  id: string
  projectId: string
  templateId: string
  number: string
  status: ProposalStatus
  publicToken: string
  currency: string
  pricingMode: PricingMode
  estimatedHours: number | null
  discountType: 'FLAT' | 'PERCENT'
  discountValue: number
  taxRatePercent: number
  subtotal: number
  discount: number
  tax: number
  total: number
  validUntil: string | null
  currentVersion: number
  createdAt: string
  updatedAt: string
  sentAt: string | null
  viewedAt: string | null
  sections: ProposalSection[]
  scopeItems: ScopeItem[]
  milestones: Milestone[]
  pricingItems: PricingItem[]
  paymentSchedules: PaymentScheduleItem[]
  activity: ActivityLogEntry[]
  approvals: ProposalApprovalRecord[]
  views: { id: string; viewedAt: string }[]
  versions: { versionNumber: number; snapshotJson: unknown; createdAt: string }[]
}

export interface ActivityLogEntry {
  id: string
  type: string
  message: string
  createdAt: string
}

export interface ProposalApprovalRecord {
  id: string
  decision: ApprovalDecision
  clientName: string
  comment: string | null
  decidedAt: string
}

export interface AiQuoteSuggestionItem {
  name: string
  description: string
  estimatedPrice: number
}

export interface AiQuoteSuggestion {
  items: AiQuoteSuggestionItem[]
}
