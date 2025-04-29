import { z } from "zod"

export const loginSchema = z.object({
  userId: z.string().min(1, "L'identifiant est requis")
})

export type LoginType = z.infer<typeof loginSchema>
