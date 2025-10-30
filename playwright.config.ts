import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    globalSetup: require.resolve('./global.setup'),
    fullyParallel: true,
    timeout: 120000,
    forbidOnly: !!process.env.CI,
    workers: 1,
    reporter: 'html',
    use: {
        storageState: '.auth/user.json',
        baseURL: 'https://akademia.gwodev.pl',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
})
