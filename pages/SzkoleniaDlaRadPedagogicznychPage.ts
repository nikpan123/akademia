import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class SzkoleniaDlaRadPedagogicznychPage extends BasePage {
    //Lokatory
    readonly clearButton: Locator
    readonly changeViewButton: Locator
    readonly subjectFilter: Locator
    readonly levelFilter: Locator
    readonly topicFilter: Locator
    readonly typeFilter: Locator
    readonly otherFilter: Locator
    readonly szkoleniaDlaRadLinks: Locator
    readonly loadingSzkolenia: Locator
    readonly header: Locator

    constructor(page: Page) {
        super(page)
        this.clearButton = page.getByRole('button', {
            name: 'Wyczyść wyniki wyszukiwania',
        })
        this.changeViewButton = page.locator('.view-switcher')
        this.subjectFilter = page.locator('.filter-item__title:has-text("Tematyka")')
        this.levelFilter = page.locator('.filter-item__title:has-text("Poziom nauczania")')
        this.topicFilter = page.locator('.filter-item__title:has-text("Zagadnienia")')
        this.typeFilter = page.locator('.filter-item__title:has-text("Typy szkoleń")')
        this.otherFilter = page.locator('.filter-item__title:has-text("Inne kategorie")')
        this.szkoleniaDlaRadLinks = page.locator('.education-board-list__items .education-board-product .education-board-product__link')
        this.loadingSzkolenia = page.locator('.education-board-list__items .loading-state')
        this.header = page.getByRole('heading', {
            name: 'Wyszukaj szkolenie',
            level: 1,
        })
    }

    // ============ NAWIGACJA ============

    async otworzSzkoleniaDlaRadPedagogicznych(): Promise<void> {
        await this.otworzStrone(`${this.env.akademia}/szkolenia-dla-rad-pedagogicznych`)
    }

    async otworzLosoweSzkolenieDlaRad(): Promise<string> {
        let nazwaSzkolenia = ''

        await this.page.waitForLoadState('networkidle')
        await this.loadingSzkolenia.waitFor({ state: 'hidden' })

        // Pobierz wszystkie linki szkoleń
        const wszystkieLinki = this.szkoleniaDlaRadLinks
        const liczbaSzkolen = await wszystkieLinki.count()

        if (liczbaSzkolen === 0) {
            throw new Error('Brak szkoleń dla rad pedagogicznych na liście – sprawdź ładowanie.')
        }

        // Wybierz losowy indeks (0 do liczbaSzkolen-1)
        const losowyIndeks = Math.floor(Math.random() * liczbaSzkolen)
        console.log(`Wybrano szkolenie na indeksie: ${losowyIndeks} (z ${liczbaSzkolen} dostępnych)`)

        // Pobierz losowy link i jego nazwę
        const losowyLink = wszystkieLinki.nth(losowyIndeks)
        await losowyLink.waitFor({ state: 'visible' })
        nazwaSzkolenia = await losowyLink.innerText()

        if (nazwaSzkolenia === '') {
            throw new Error('Nie udało się pobrać nazwy losowego szkolenia.')
        }

        // Kliknij w link
        await losowyLink.click()

        return nazwaSzkolenia
    }
}
