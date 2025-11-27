// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    analyze: true,
    transpile: [
      'vuetify',
      'v-phone-input',
    ],
  },
  modules: [
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
    'vuetify-nuxt-module',
  ],
  plugins: [
    '@/plugins/VPhoneInput'
  ],
  runtimeConfig: {
    authSecret: '123',
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    influxDB: {
      url: process.env.INFLUX_DB_URL,
      token: process.env.INFLUX_DB_TOKEN,
      org: process.env.INFLUX_DB_ORG,
      bucket: process.env.INFLUX_DB_BUCKET,
    }
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      defaults: {
        VTextField: {
          density: 'comfortable'
        },
        VNumberInput: {
          density: 'comfortable'
        },
        VSelect: {
          density: 'comfortable'
        },
      },
      theme: {
        defaultTheme: 'dark'
      },
      icons: {
        defaultSet: 'mdi',
      },
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
    baseURL: process.env.NODE_ENV === 'development' ? 'http://172.29.121.50:3000/api/auth' : 'https://pipecrm.ru/api/auth',
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: process.env.NODE_ENV === 'development' ? 'password' : 'yandex',
      addDefaultCallbackUrl: true
    },
    sessionRefresh: {
      enablePeriodically: 60 * 1000,
      enableOnWindowFocus: true,
    }
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  }
})
