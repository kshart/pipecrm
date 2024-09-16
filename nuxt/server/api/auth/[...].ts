import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '~/lib/prisma'
import YandexProvider from 'next-auth/providers/yandex'

// const user = await prisma.user.findFirst()
// console.log(user)

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/'
  },
  providers: [
    YandexProvider.default({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      // authorization: { params: { scope: "login:info+login:email+login:avatar" } }
    })
  ],
  events: {
    async signIn (message: unknown) {
      console.log('signIn', message)
    },
    async signOut (message: unknown) {
      console.log('signOut', message)
    },
    async createUser (message: unknown) {
      console.log('createUser', message)
    },
    async updateUser (message: unknown) {
      console.log('updateUser', message)
    },
    async linkAccount (message: unknown) {
      console.log('linkAccount', message)
    },
    async session (message: unknown) {
      console.log('session', message)
    },
  }
})
