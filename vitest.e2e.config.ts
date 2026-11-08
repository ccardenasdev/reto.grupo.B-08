import { config } from 'dotenv'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

// El proyecto está en OneDrive: la clave secreta se guarda fuera para que no se sincronice.
config({ path: join(homedir(), '.carsystem', '.env.test.local') })

export default defineConfig({
  test: {
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 60_000,
    hookTimeout: 180_000,
    fileParallelism: false,
  },
})
