import { AppRouter } from '../server/route/app.router'
import { createReactQueryHooks } from '@trpc/react'

export const trpc = createReactQueryHooks<AppRouter>() //approuter as generic
