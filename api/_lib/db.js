import { PrismaClient } from '@prisma/client'

/**
 * Reuses a single PrismaClient across warm serverless function invocations to avoid
 * exhausting the connection pool. Requires DATABASE_URL to be set — see .env.example.
 */
const globalForPrisma = globalThis
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
