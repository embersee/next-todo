import '../styles/globals.css'

import { ReactElement, ReactNode } from 'react'

import type { AppProps } from 'next/app'
import { AppRouter } from '../server/route/app.router'
import { NextPage } from 'next'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import superjson from 'superjson'
import { withTRPC } from '@trpc/next'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout
}

//rollback to next@12.2 if error here
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <SessionProvider session={session}>
      <Toaster />
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://next-todo-silk-one.vercel.app/api/trpc`
      : 'http://localhost:3000/api/trpc'

    const links = [
      loggerLink(),
      httpBatchLink({
        maxBatchSize: 10,
        url,
      }),
    ]

    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 60,
          },
        },
      },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          }
        }
        return {}
      },
      links,
      transformer: superjson,
    }
  },
  ssr: false,
})(MyApp)
