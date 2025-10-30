import { test as setup } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Załaduj zmienne z .env
dotenv.config()

const authFile = path.join(__dirname, '../.auth/user.json')

setup('authenticate to GitLab', async ({ page }) => {
    // Przejdź do strony logowania GitLab
    await page.goto('https://gitlab.gwo.pl/users/sign_in')

    // Wypełnij formularz logowania
    await page.locator('#user_login').fill(process.env.GITLAB_EMAIL!)
    await page.locator('#user_password').fill(process.env.GITLAB_PASSWORD!)

    // Kliknij "Sign in"
    await page.locator('button[type="submit"]').click()

    // Poczekaj aż logowanie się zakończy
    await page.waitForURL('**/gitlab.gwo.pl/**')

    // Opcjonalnie: sprawdź czy jesteś zalogowany
    // await expect(page.locator('selector-dla-zalogowanego-usera')).toBeVisible();

    // Zapisz stan sesji (cookies, localStorage, itp.)
    await page.context().storageState({ path: authFile })

    console.log('✓ Sesja GitLab zapisana!')
})
