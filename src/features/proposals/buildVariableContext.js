import { formatCurrency } from '@/lib/pricing'
export function buildVariableContext(proposal, project, client, developer) {
  return {
    client: {
      name: client?.name ?? '',
      company: client?.company ?? null,
      email: client?.email ?? null,
      phone: client?.phone ?? null,
      address: client?.address ?? null,
    },
    project: {
      name: project?.name ?? '',
      description: project?.description ?? null,
      category: project?.category ?? null,
      timeline: project?.estimatedTimeline ?? null,
    },
    developer: {
      name: developer.businessName || developer.name,
      email: developer.email,
      phone: developer.phone,
      website: developer.portfolioUrl,
      github: developer.githubUrl,
      linkedin: developer.linkedinUrl,
    },
    proposal: {
      number: proposal.number,
      date: new Date(proposal.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      validUntil: proposal.validUntil
        ? new Date(proposal.validUntil).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      currency: proposal.currency,
      subtotal: formatCurrency(proposal.subtotal, proposal.currency),
      discount: formatCurrency(proposal.discount, proposal.currency),
      tax: formatCurrency(proposal.tax, proposal.currency),
      total: formatCurrency(proposal.total, proposal.currency),
    },
  }
}
