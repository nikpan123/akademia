import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class AkademiaPage extends BasePage {
    // Główne sekcje
    readonly szkoleniaDlaNauczycieliButton: Locator
    readonly szkoleniaDlaRadPedagogicznychButton: Locator
    readonly oAkademiiButton: Locator

    // O akademii
    readonly oAkademiiTekst: Locator
    readonly oAkademiiHeading: Locator
    readonly pobierzButton: Locator

    // Newsletter
    readonly newsletterEmail: Locator
    readonly newsletterSubmitButton: Locator
    readonly newsletterRodo: Locator
    readonly newsletterMessage: Locator

    constructor(page: Page) {
        super(page)

        // Główne przyciski
        this.szkoleniaDlaNauczycieliButton = page.getByText('szkolenia dla nauczycieli')
        this.szkoleniaDlaRadPedagogicznychButton = page.getByText('szkolenia dla rad pedagogicznych')
        this.oAkademiiButton = page.getByRole('link', { name: 'O Akademii' })

        // O Akademii
        this.oAkademiiTekst = page.locator('.page-description__description')
        this.oAkademiiHeading = page.getByRole('heading', {
            name: 'O Akademii',
            level: 2,
        })
        this.pobierzButton = page.getByRole('button', { name: 'Pobierz' })

        // Newsletter
        this.newsletterEmail = page.locator('#newsletter_form_email')
        this.newsletterSubmitButton = page.getByText('Zapisuję się')
        this.newsletterRodo = page.locator('body > main > div.home-page.container > div.newsletter-link > form > div.checkbox > div > div > label > span')
        this.newsletterMessage = page.locator('small.--color-green')
    }

    // ============ NAWIGACJA ============

    async przejdzNaSzkoleniaDlaNauczycieli(): Promise<void> {
        await this.szkoleniaDlaNauczycieliButton.click()
        await this.page.waitForURL('**/szkolenia-dla-nauczycieli**')
    }

    async przejdzNaSzkoleniaDlaRadPedagogicznych(): Promise<void> {
        await this.szkoleniaDlaRadPedagogicznychButton.click()
        await this.page.waitForURL('**/szkolenia-dla-rad-pedagogicznych**')
    }

    async przejdzNaOAkademii(): Promise<void> {
        await this.szkoleniaDlaRadPedagogicznychButton.click()
        await this.oAkademiiButton.click()
        await this.page.waitForURL('**/o-akademii**')
    }

    // ============ NEWSLETTER ============

    async wypelnijFormularzNewslettera(email: string, zaznaczRodo: boolean = true): Promise<void> {
        await this.newsletterEmail.fill(email)
        if (zaznaczRodo) {
            await this.newsletterRodo.check()
        }
        await this.newsletterSubmitButton.click()
    }
}
