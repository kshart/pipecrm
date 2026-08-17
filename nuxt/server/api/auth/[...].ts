import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@@/lib/prisma'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface CredentialsModule {
  default: typeof CredentialsProvider
}

const providers = [
  (CredentialsProvider as unknown as CredentialsModule).default({
    credentials: {
      username: {
        label: 'Username',
        type: 'text',
      },
      password: {
        label: 'Password',
        type: 'password',
      },
    },
    async authorize(credentials: unknown, req) {
      if (!credentials?.username || !credentials?.password) {
        return null
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials?.username },
        include: {
          accounts: true,
        },
      })

      if (!user || !user.accounts.some(acc => acc.access_token === credentials.password)) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    },
  }),
] as AuthOptions['providers']

const adapter = PrismaAdapter(prisma) as AuthOptions['adapter']

export default NuxtAuthHandler({
  providers,
  secret: useRuntimeConfig().authSecret,
  adapter,
  session: process.env.NODE_ENV === 'development'
    ? {
        strategy: 'jwt',
        maxAge: 3000,
      }
    : undefined,
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/',
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      }
    },
  },
})
