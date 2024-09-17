// @ts-check
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': 'warn',
      'quotes': ['error', 'single'],
    }
  }
])
