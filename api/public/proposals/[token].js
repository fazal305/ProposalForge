import { prisma } from '../../_lib/db.js'
import { sendError, sendServerError } from '../../_lib/errors.js'

/**
 * Public, unauthenticated read for the client-facing proposal view. Looks up by the
 * random `publicToken`, never by the internal `id`, so a share link cannot be used to
 * enumerate or guess other proposals' database ids.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')
  const token = req.query.token
  if (!token) return sendError(res, 400, 'Missing token')
  try {
    const proposal = await prisma.proposal.findUnique({
      where: {
        publicToken: token,
      },
      include: {
        sections: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        scopeItems: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        milestones: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        pricingItems: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        paymentSchedules: {
          orderBy: {
            orderIndex: 'asc',
          },
        },
        project: {
          include: {
            client: true,
          },
        },
      },
    })
    if (!proposal) return sendError(res, 404, 'Proposal not found')
    if (proposal.status === 'SENT') {
      await prisma.proposal.update({
        where: {
          id: proposal.id,
        },
        data: {
          status: 'VIEWED',
          viewedAt: new Date(),
        },
      })
      await prisma.proposalView.create({
        data: {
          proposalId: proposal.id,
        },
      })
    }
    res.status(200).json(proposal)
  } catch (error) {
    sendServerError(res, error)
  }
}
