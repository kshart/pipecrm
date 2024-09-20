// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  prisma: {
    autoSetupPrisma: true,
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    analyze: true,
  },
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
      icons: false,
    }
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 1000000,
        }
      }
    },
    ssr: {
      external: ['@prisma/client']
    },
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },
  auth: {
    isEnabled: true,
    globalAppMiddleware: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.0.6:3000/api/auth' : 'https://pipecrm.ru/api/auth',
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
