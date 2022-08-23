import { Context } from './createContext'
import { router } from '@trpc/server'
import superjson from 'superjson'

export function createRouter() {
  return router<Context>().transformer(superjson)
}
