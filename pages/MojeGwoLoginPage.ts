import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class MojeGwoLoginPage extends BasePage {
    // Lokatory formularza logowania
    readonly loginInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator
    readonly passwordButton: Locator
    readonly accountButton: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        super(page)

        // Formularz logowania
        this.loginInput = page.locator('input[name="username"], input[name="login"], #username, #login')
        this.passwordInput = page.locator('input[type="password"]')
        this.submitButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Zaloguj")')

        // Dodatkowe linki
        this.passwordButton = page.getByTestId('forgottenPassword')
        this.accountButton = page.getByTestId('registerAccount')

        // Komunikaty
        this.errorMessage = page.locator('text=Podany login bądź hasło są niepoprawne.')
    }

    // ============ PODSTAWOWE AKCJE ============

    async czekajNaStroneLogowania(): Promise<void> {
        await this.page.waitForURL(`**${this.env.moje}**`, { timeout: 15000 })
        await this.waitForLoadState()
    }

    async wypelnijFormularz(login: string, password: string): Promise<void> {
        await this.loginInput.waitFor({ state: 'visible' })
        await this.loginInput.fill(login)
        await this.passwordInput.fill(password)
    }

    async kliknijZalogujSie(): Promise<void> {
        await this.submitButton.click()
    }

    // ============ DODATKOWE AKCJE ============

    async kliknijNiePamietamHasla(): Promise<void> {
        await this.passwordButton.click()
        await this.page.waitForURL('**/przypomnienie-hasla**', {
            timeout: 10000,
        })
    }

    async kliknijNieMamKonta(): Promise<void> {
        await this.accountButton.click()
        await this.page.waitForURL('**/rejestracja**', { timeout: 10000 })
    }
}
