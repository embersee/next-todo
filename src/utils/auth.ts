import Credentials from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'
import { createUserSchema } from '../schema/user.schema'
import { prisma } from './prisma'
import { verify } from 'argon2'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
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

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        }
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
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id
      }

      return session
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/',
    newUser: '/sign-up',
  },
}
