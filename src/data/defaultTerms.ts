/**
 * Standard freelance business-term defaults, seeded into a new user's Terms Library.
 * These are reusable starting points, not legal advice — every proposal template
 * surfaces LEGAL_REVIEW_NOTE so the user is reminded to have them reviewed by a
 * qualified professional for their jurisdiction before relying on them with a client.
 */

export const LEGAL_REVIEW_NOTE =
  'These terms are editable business templates, not legal advice. Have them reviewed by a qualified professional for your jurisdiction before relying on them with a client.'

export interface TermSectionSeed {
  key: string
  title: string
  contentMd: string
}

export const DEFAULT_TERMS: TermSectionSeed[] = [
  {
    key: 'payment_terms',
    title: 'Payment Terms',
    contentMd:
      '- 50% of the total project cost is due upfront to begin work.\n' +
      '- The remaining 50% is due upon final delivery, split across milestones as outlined in the Payment Schedule.\n' +
      '- Invoices are due within 7 days of receipt unless otherwise agreed.\n' +
      '- Late payments may pause active work until the balance is settled.',
  },
  {
    key: 'support_period',
    title: 'Post-Launch Support',
    contentMd:
      '- 30 days of bug-fix support are included after final delivery, at no additional cost.\n' +
      '- Support covers defects in delivered functionality, not new features or scope changes.\n' +
      '- Extended support/maintenance plans are available separately by agreement.',
  },
  {
    key: 'communication_policy',
    title: 'Communication',
    contentMd:
      '- Primary communication channel: email, with a weekly progress update during active development.\n' +
      '- Typical response time: within 1 business day.\n' +
      '- Calls/meetings are scheduled by mutual availability.',
  },
  {
    key: 'revision_policy',
    title: 'Revisions',
    contentMd:
      '- Two rounds of revisions are included per milestone, within the agreed scope.\n' +
      '- Revisions outside the original scope are treated as change requests and quoted separately.',
  },
  {
    key: 'intellectual_property',
    title: 'Intellectual Property',
    contentMd:
      '- Full ownership of the final delivered work transfers to the client upon receipt of full payment.\n' +
      '- The developer retains the right to showcase the project in a portfolio unless the client requests otherwise in writing.\n' +
      '- Any pre-existing tools, libraries, or frameworks used remain under their own respective licenses.',
  },
  {
    key: 'cancellation_refunds',
    title: 'Cancellation & Refunds',
    contentMd:
      '- Either party may cancel the engagement with written notice.\n' +
      '- Work completed up to the cancellation date is billable; the upfront deposit is non-refundable once work has begun.\n' +
      '- Unused prepaid milestone amounts for work not yet started are refundable.',
  },
  {
    key: 'client_responsibilities',
    title: 'Client Responsibilities',
    contentMd:
      '- Timely feedback, content, and access (credentials, repositories, third-party accounts) are the client\'s responsibility.\n' +
      '- Delays in providing required materials may extend the delivery timeline accordingly.',
  },
  {
    key: 'third_party_hosting',
    title: 'Third-Party Services, Hosting & Domains',
    contentMd:
      '- Any third-party service, hosting, or domain costs are billed separately unless explicitly included in the pricing.\n' +
      '- Domain and hosting accounts remain in the client\'s name/ownership unless otherwise agreed.',
  },
]
