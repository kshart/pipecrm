// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
    'vuetify-nuxt-module',
  ],
  plugins: [
    '@/plugins/VPhoneInput',
  ],
  devtools: { enabled: true },
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
    },
    s3: {
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    }
  },
  build: {
    analyze: true,
    transpile: [
      'vuetify',
      'v-phone-input',
    ],
  },
  compatibilityDate: '2024-04-03',

  nitro: {
    experimental: {
      websocket: true,
    },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          experimentalMinChunkSize: 1000000,
        },
      },
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
    originEnvKey: process.env.AUTH_ORIGIN,
    baseURL: process.env.AUTH_ORIGIN + '/api/auth',
    provider: {
      type: 'authjs',
      trustHost: false,
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: {
      enablePeriodically: 60 * 1000,
      enableOnWindowFocus: true,
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: {
      defaults: {
        VTextField: {
          density: 'comfortable',
        },
        VNumberInput: {
          density: 'comfortable',
        },
        VSelect: {
          density: 'comfortable',
        },
      },
      theme: {
        defaultTheme: 'dark',
      },
      icons: {
        defaultSet: 'mdi',
      },
    },
  },
})
