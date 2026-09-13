// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,

    include: [
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts'
    ],

    exclude: [
      'node_modules/**',
      '.nuxt/**',
      '.output/**',
      'tests/e2e/**'
    ],

    environment: 'node',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'app/components/**/*.vue',
        'app/composables/**/*.ts',
        'app/stores/**/*.ts',
        'app/utils/**/*.ts'
      ],
      exclude: [
        '**/*.d.ts',
        '**/index.ts'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 70
      }
    }
  }
})
