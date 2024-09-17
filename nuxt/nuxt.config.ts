// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  prisma: {
    autoSetupPrisma: true,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@prisma/nuxt',
    '@sidebase/nuxt-auth',
    'vuetify-nuxt-module',
  ],
  runtimeConfig: {
    authSecret: '123',
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      /* vuetify options */
    }
  },
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    // baseURL: 'https://oauth.чточто.рф/api/auth',
    baseURL: 'http://192.168.0.6:3000/api/auth',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'yandex',
      addDefaultCallbackUrl: true
    },
    sessionRefresh: {
      enablePeriodically: 60 * 1000,
      enableOnWindowFocus: true,
    }
  },
})
