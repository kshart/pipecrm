import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: [
    'prisma/generated',
  ],
})
  .override('nuxt/vue/rules', {
    rules: {
      'vue/attribute-hyphenation': ['error', 'never'],
      'vue/v-on-event-hyphenation': ['error', 'never'],
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],
    },
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/unified-signatures': ['error', { ignoreDifferentlyNamedParameters: true }],
      '@typescript-eslint/no-unused-vars': ['error', {
        args: 'none',
        ignoreRestSiblings: true,
        vars: 'all',
        varsIgnorePattern: '^_',
      }],
    },
  })
  .override('nuxt/stylistic', {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        importAttributes: 'always-multiline',
        dynamicImports: 'always-multiline',
        enums: 'always-multiline',
        generics: 'always-multiline',
        tuples: 'always-multiline',
      }],
    },
  })
