import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class AkademiaLoginPage extends BasePage {
    // Lokatory na stronie Akademii
    readonly zalogujButton: Locator

    // Lokatory na stronie Moje GWO
    readonly loginInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator
    readonly passwordButton: Locator
    readonly accountButton: Locator
    readonly errorMessage: Locator

    constructor(page: Page) {
        super(page)

        // Przyciski na akademii
        this.zalogujButton = this.page.locator('a:has-text("Zaloguj"), button:has-text("Zaloguj")').first()

        // Formularz na moje.gwodev.pl
        this.loginInput = this.page.getByTestId('login').getByRole('textbox')
        this.passwordInput = this.page.getByTestId('password').getByRole('textbox')
        this.submitButton = this.page.getByTestId('send')
        this.passwordButton = this.page.getByTestId('forgottenPassword')
        this.accountButton = this.page.getByTestId('registerAccount')
        this.errorMessage = this.page.getByTestId('errorPanel')
    }

    // ============ LOGOWANIE - PODSTAWOWE AKCJE ============

    async kliknijZaloguj(): Promise<void> {
        await this.zalogujButton.click()
    }

    async czekajNaStroneMojeGwo(): Promise<void> {
        await this.page.waitForURL(new RegExp(`${this.env.moje}.*`), {
            timeout: 15000,
        })
        await this.waitForLoadState()
    }

    /**
     * Wypełnij formularz logowania danymi użytkownika.
     * @param login - Login użytkownika
     * @param password - Hasło użytkownika
     */
    async wypelnijFormularzLogowania(login: string, password: string): Promise<void> {
        await this.loginInput.waitFor({ state: 'visible', timeout: 5000 })
        await this.loginInput.fill(login)
        await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 })
        await this.passwordInput.fill(password)
    }

    async kliknijZalogujSie(): Promise<void> {
        await this.submitButton.waitFor({ state: 'visible', timeout: 5000 })
        await this.submitButton.click()
    }

    async czekajNaPowrotNaAkademie(): Promise<void> {
        await this.page.waitForURL(new RegExp(`${this.env.akademia}.*`), {
            timeout: 30000,
        })
        await this.waitForLoadState()
    }

    // ============ LOGOWANIE - FLOW KOMPLETNY ============

    /**
     * Wykonaj kompletny proces logowania na Akademię przez Moje GWO.
     * @param login - Login użytkownika
     * @param password - Hasło użytkownika
     */
    async zalogujSieNaAkademie(login: string, password: string): Promise<void> {
        await this.kliknijZaloguj()
        await this.czekajNaStroneMojeGwo()
        await this.wypelnijFormularzLogowania(login, password)
        await this.kliknijZalogujSie()
        await this.czekajNaPowrotNaAkademie()
    }

    // ============ DODATKOWE AKCJE NA STRONIE LOGOWANIA ============

    async kliknijNiePamietamHasla(): Promise<void> {
        await this.passwordButton.waitFor({ state: 'visible', timeout: 5000 })
        await this.passwordButton.click()
        await this.page.waitForURL(/.*\/przypomnienie-hasla.*/, {
            timeout: 10000,
        })
    }

    async kliknijNieMamKonta(): Promise<void> {
        await this.accountButton.waitFor({ state: 'visible', timeout: 5000 })
        await this.accountButton.click()
        await this.page.waitForURL(/.*\/rejestracja.*/, { timeout: 10000 })
    }

    async sprawdzBladLogowania(): Promise<void> {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 10000 })
    }
}
