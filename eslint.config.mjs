import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  rules: {
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error']
      }
    ],

    'vue/multi-word-component-names': 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }
    ],

    'vue/no-mutating-props': 'error',
    'vue/no-v-html': 'error'
  }
})
