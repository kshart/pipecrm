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
  css: ['@/assets/scss/main.scss'],
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    authRootOrigin: process.env.AUTH_ROOT_ORIGIN,
    redis: {
      host: process.env.REDIS_DB_HOST,
      port: Number(process.env.REDIS_DB_PORT),
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
    },
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
    server: {
      allowedHosts: ['pipecrm.ru', '.pipecrm.ru'],
    },
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
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#FF5300',
              secondary: '#4e4746',

              background: '#fff',
              surface: '#efeae8',
              success: '#00AB6F',
              warning: '#FF9700',
              error: '#f00',
              info: '#6ba2fd',
            },
          },
          dark: {
            dark: true,
            colors: {
              primary: '#FF5300',
              secondary: '#bab3b3',

              background: '#131010',
              surface: '#2c2827',
              success: '#00AB6F',
              warning: '#FF9700',
              error: '#f00',
              info: '#6ba2fd',
            },
          },
        },
      },
      icons: {
        defaultSet: 'mdi',
      },
    },
  },
})
