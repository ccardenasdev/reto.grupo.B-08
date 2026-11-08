import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/db/**/*.test.ts', 'tests/ui/**/*.test.tsx'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
