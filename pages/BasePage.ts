import { Page, Locator } from '@playwright/test'
import { getEnvironment } from '../config/environments'

export class BasePage {
    readonly page: Page
    readonly env = getEnvironment()

    readonly favicon: Locator

    // Header
    readonly kontaktLink: Locator
    readonly desktopLogo: Locator

    // Lokatory cookies - publiczne, żeby były dostępne w klasach dziedziczących
    readonly cookiePanel: Locator
    readonly cookieText: Locator
    readonly cookieLink: Locator
    readonly cookiesModal: Locator
    readonly cookiesAcceptButton: Locator

    // Stopka
    readonly adres: Locator
    readonly cookiesInfo: Locator
    readonly cookiesLink: Locator
    readonly politykaPrywatnosciButton: Locator
    readonly regulaminSzkolenButton: Locator
    readonly gwoButton: Locator
    readonly facebookButton: Locator
    readonly gwoIcon: Locator
    readonly fbIcon: Locator

    // Lokatory logowania - wspólne dla Akademii
    readonly zalogujButton: Locator
    readonly loginInput: Locator
    readonly passwordInput: Locator
    readonly submitButton: Locator
    readonly passwordButton: Locator
    readonly accountButton: Locator
    readonly errorMessage: Locator

    //Panel dostępności
    readonly accToolbar: Locator
    readonly toggleAccButton: Locator
    readonly smallLetter: Locator
    readonly bigLetter: Locator
    readonly darkContrast: Locator
    readonly grayscale: Locator
    readonly underlineLinks: Locator

    // Mobile menu
    readonly menuButton: Locator
    readonly menuItems: Locator
    readonly mobileLogo: Locator

    constructor(page: Page) {
        this.page = page

        this.favicon = page.locator('link[rel="icon"]')

        // Header
        this.kontaktLink = page.getByRole('link', { name: 'Kontakt' })
        this.desktopLogo = page.locator('.head__logo:not(.logo__mobile)').first()

        // Inicjalizacja lokatorów cookies w konstruktorze
        this.cookiePanel = page.locator('.cookie-panel')
        this.cookieText = page.locator('.cookie-panel__text')
        this.cookieLink = page.locator('.cookie-panel__link')
        this.cookiesModal = page.locator('text=Dbamy o Twoją prywatność')
        this.cookiesAcceptButton = page.locator('button:has-text("Akceptuję i przechodzę do Serwisu")')

        // Stopka
        this.adres = page.locator('.footer__powered-text')
        this.cookiesInfo = page.locator('.footer__powered-text')
        this.cookiesLink = page.locator('.footer__powered-text a[href*="polityka-plikow-cookies"]')
        this.politykaPrywatnosciButton = page.getByRole('link', {
            name: 'Polityka prywatności',
        })
        this.regulaminSzkolenButton = page.getByRole('link', {
            name: 'Regulamin szkoleń',
        })
        this.gwoButton = page.locator('a[href="https://gwo.pl/"]')
        this.facebookButton = page.locator('a[href="https://pl-pl.facebook.com/GdanskieWydawnictwoOswiatowe"]')
        this.gwoIcon = page.locator('.footer__socials a[href*="gwo.pl"] img')
        this.fbIcon = page.locator('.footer__socials a[href*="facebook"] img')

        // Lokatory logowania
        this.zalogujButton = page.locator('a:has-text("Zaloguj"), button:has-text("Zaloguj")').first()
        this.loginInput = page.getByTestId('login').getByRole('textbox')
        this.passwordInput = page.getByTestId('password').getByRole('textbox')
        this.submitButton = page.getByTestId('send')
        this.passwordButton = page.getByTestId('forgottenPassword')
        this.accountButton = page.getByTestId('registerAccount')
        this.errorMessage = page.getByTestId('errorPanel')

        // Panel dostępności
        this.accToolbar = page.locator('#b-acc-toolbarWrap')
        this.toggleAccButton = page.locator('[title="Opcje dostępności"]')
        this.smallLetter = page.locator('.small-letter')
        this.bigLetter = page.locator('.big-letter')
        this.darkContrast = page.locator('.b-acc-dark-btn')
        this.grayscale = page.locator('.b-acc-grayscale')
        this.underlineLinks = page.locator('.b-acc-toggle-underline')

        // Mobile menu
        this.menuButton = page.getByRole('banner').getByRole('button')
        this.menuItems = page.locator('.menu-links__items').first()
        this.mobileLogo = page.locator('.logo__mobile')
    }

    // ============ COOKIES ============

    async akceptujCookiesJesliWidoczne(): Promise<void> {
        try {
            if (await this.cookiesModal.isVisible({ timeout: 3000 })) {
                await this.cookiesAcceptButton.click()
                await this.cookiesModal.waitFor({
                    state: 'hidden',
                    timeout: 5000,
                })
            }
        } catch {
            // Modal nie pojawił się - OK, kontynuuj
        }
    }

    // ============ NAWIGACJA ============

    async otworzStrone(url: string): Promise<void> {
        await this.page.goto(url)
        await this.akceptujCookiesJesliWidoczne()
    }

    async otworzAkademie(): Promise<void> {
        await this.otworzStrone(this.env.akademia)
    }

    async przejdzNaPolitykePrywatnosci(): Promise<void> {
        await this.politykaPrywatnosciButton.click()
        await this.page.waitForURL('**/polityka-prywatnosci**')
    }

    async przejdzNaRegulaminSzkolen(): Promise<void> {
        await this.regulaminSzkolenButton.click()
        await this.page.waitForURL('**/regulaminy**')
    }

    async przejdzNaKontakt(): Promise<void> {
        await this.kontaktLink.click()
        await this.page.waitForURL('**/kontakt**')
    }

    async przejdzNaGwo(): Promise<void> {
        await this.gwoButton.click()
        await this.page.waitForLoadState('networkidle')
    }

    async przejdzNaFacebook(): Promise<void> {
        await this.facebookButton.click()
        await this.page.waitForLoadState('networkidle')
    }

    // ============ LOGOWANIE ============

    async kliknijZaloguj(): Promise<void> {
        await this.zalogujButton.click()
    }

    async czekajNaStroneMojeGwo(): Promise<void> {
        await this.page.waitForURL(new RegExp(`${this.env.moje}.*`), {
            timeout: 15000,
        })
        await this.waitForLoadState()
    }

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

    async zalogujSieNaAkademie(login: string, password: string): Promise<void> {
        await this.kliknijZaloguj()
        await this.czekajNaStroneMojeGwo()
        await this.wypelnijFormularzLogowania(login, password)
        await this.kliknijZalogujSie()
        await this.czekajNaPowrotNaAkademie()
    }

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

    // ============ UTILITY ============

    async waitForLoadState(): Promise<void> {
        await this.page.waitForLoadState('networkidle')
    }
}
