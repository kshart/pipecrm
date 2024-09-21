import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '~/lib/prisma'
import type { AuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import YandexProvider from 'next-auth/providers/yandex'

interface CredentialsModule {
  default: typeof Credentials
}
interface YandexProviderModule {
  default: typeof YandexProvider
}

const providers = [
  (YandexProvider as unknown as YandexProviderModule).default({
    clientId: String(process.env.YANDEX_CLIENT_ID),
    clientSecret: String(process.env.YANDEX_CLIENT_SECRET),
    // authorization: { params: { scope: "login:info+login:email+login:avatar" } }
  })
] as AuthOptions['providers']

if (process.env.NODE_ENV === 'development') {
  providers.push(
    (Credentials as unknown as CredentialsModule).default({
      id: 'password',
      name: 'Password',
      credentials: {
        username: {
          label: 'Username'
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      authorize: async () => {
        return {
          id: 'test',
          name: 'Kshart',
          email: 'kshart@yandex.ru',
          image: 'https://avatars.yandex.net/get-yapic/23134/enc-01aad189a1d20e0d2440bf552847721c20d6fa4e581d699e083721a522e5e84f/islands-200'
        }
      },
    })
  )
}
export default NuxtAuthHandler({
  providers,
  secret: useRuntimeConfig().authSecret,
  adapter: PrismaAdapter(prisma),
  session: process.env.NODE_ENV === 'development' ? {
    strategy: 'jwt',
    maxAge: 3000,
  } : undefined,
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/'
  },
  // events: {
  //   async signIn (message: unknown) {
  //     console.log('signIn', message)
  //   },
  //   async signOut (message: unknown) {
  //     console.log('signOut', message)
  //   },
  //   async createUser (message: unknown) {
  //     console.log('createUser', message)
  //   },
  //   async updateUser (message: unknown) {
  //     console.log('updateUser', message)
  //   },
  //   async linkAccount (message: unknown) {
  //     console.log('linkAccount', message)
  //   },
  //   async session (message: unknown) {
  //     console.log('session', message)
  //   },
  // }
})
