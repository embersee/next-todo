import type { GetServerSideProps, GetServerSidePropsContext } from 'next'

import { nextAuthOptions } from './auth'
import { unstable_getServerSession } from 'next-auth'

export const requireAuth =
  (func: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    const session = await unstable_getServerSession(
      ctx.req,
      ctx.res,
      nextAuthOptions
    )

    if (!session) {
      return {
        redirect: {
          destination: '/sign-in', // login path
          permanent: false,
        },
      }
    }

    return await func(ctx)
  }
