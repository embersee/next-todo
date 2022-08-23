import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { nextAuthOptions } from '../utils/auth'
import { prisma } from '../utils/prisma'
import { unstable_getServerSession } from 'next-auth'

export async function createContext(ctx: trpcNext.CreateNextContextOptions) {
  const { req, res } = ctx
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  return { req, res, prisma, session }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
