import { z } from 'zod'
export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})
