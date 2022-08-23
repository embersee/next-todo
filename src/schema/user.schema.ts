import * as z from 'zod'

export const createUserSchema = z.object({
  username: z.string(),
  password: z.string(),
})

export const signUpSchema = createUserSchema.extend({
  email: z.string().email(),
})

export type SignIn = z.infer<typeof createUserSchema>
export type SignUp = z.infer<typeof signUpSchema>

// export type CreateUserInput = z.TypeOf<typeof createUserSchema>
