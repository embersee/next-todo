import { authRouter } from './auth.router'
import { boardRouter } from './board.router'
import { createRouter } from '../context'
import superjson from 'superjson'
import { userRouter } from './user.router'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('users.', userRouter)
  .merge('board.', boardRouter)
  .merge('auth.', authRouter)

export type AppRouter = typeof appRouter
