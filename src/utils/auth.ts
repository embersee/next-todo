import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { createUserSchema } from '../schema/user.schema'
import { prisma } from './prisma'
import { verify } from 'argon2'

export const nextAuthOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials, request) => {
        const creds = await createUserSchema.parseAsync(credentials)

        const user = await prisma.user.findFirst({
          where: { username: creds.username },
        })

        if (!user) {
          return null
        }

        const isValidPassword = await verify(user.password, creds.password)

        if (!isValidPassword) {
          return null
        }

        const result = {
          id: user.id,
          email: user.email,
          name: user.username,
        }

        return result
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }

      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.name = token.name
      }
      return session
    },
  },
  jwt: {
    secret: 'super-secret', //'supersecret' // also in vercel env variables
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/',
    newUser: '/sign-up',
  },
}
