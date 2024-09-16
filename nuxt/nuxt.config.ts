// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@prisma/nuxt",
    "nuxt-quasar-ui",
    "@sidebase/nuxt-auth",
  ],
  runtimeConfig: {
    authSecret: '123',
  },
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: 'https://oauth.чточто.рф/api/auth',
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
  quasar: {
    components: {
      defaults: {
        // QBtn: {
        //   dense: true,
        //   flat: true,
        // },
        // QInput: {
        //   dense: true
        // }
      }
    }
  }
})
