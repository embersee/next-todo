import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { AppRouter } from '../server/route/app.router'
import { Layout } from '../components/Layout'
import { SessionProvider } from 'next-auth/react'
import { httpBatchLink } from '@trpc/client/links/httpBatchLink'
import { loggerLink } from '@trpc/client/links/loggerLink'
import superjson from 'superjson'
import { withTRPC } from '@trpc/next'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout title=''>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const url = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
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
  ssr: true,
})(MyApp)
