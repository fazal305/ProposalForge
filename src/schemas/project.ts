import { z } from 'zod'

export const projectSchema = z.object({
  clientId: z.string().min(1, 'Select a client'),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  problemStatement: z.string().optional(),
  proposedSolution: z.string().optional(),
  category: z.string().optional(),
  techStack: z.string().optional(),
  estimatedTimeline: z.string().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']),
  notes: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
