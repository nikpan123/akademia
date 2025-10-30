import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'
import { DaneZamowieniaBezLogowania, DaneZamowieniaZLogowaniem, WspolneDaneZamowienia } from '../testData/akademia.data'

export class SzkoleniaDlaNauczycieliPage extends BasePage {
    // Lokatory nawigacji i list
    readonly koszykButton: Locator
    readonly pierwszyHeading: Locator
    readonly drugiHeading: Locator
    readonly trzeciHeading: Locator
    readonly changeViewButton: Locator
    readonly backButton: Locator
    readonly szkoleniaButton: Locator
    readonly kursyElearningoweLinks: Locator
    readonly loadingElearning: Locator
    readonly loadingSzkolenia: Locator

    // Proces zamówienia
    readonly radioButton: Locator
    readonly orderButton: Locator
    readonly cartWithoutLogin: Locator
    readonly cartWithLogin: Locator
    readonly onMeRadioButton: Locator
    readonly nextButton: Locator
    readonly paymentMethodRadioButton: Locator
    readonly regulationsCheckbox: Locator
    readonly renouncementCheckbox: Locator
    readonly orderAndPaymentButton: Locator
    readonly paymentErrorMessage: Locator
    readonly validationErrors: Locator
    readonly deliveryErrorAlert: Locator

    // Mapa pól formularza (uproszczenie dostępu do inputów)
    private readonly formFields = {
        email: '#cart_address_userEmail',
        phone: '#cart_address_userPhone',
        name: '#cart_address_billingAddress_firstName',
        surname: '#cart_address_billingAddress_lastName',
        address: '#cart_address_billingAddress_street',
        number: '#cart_address_billingAddress_streetNumber',
        postalCode: '#cart_address_billingAddress_postcode',
        city: '#cart_address_billingAddress_city',
    }

    constructor(page: Page) {
        super(page)

        this.koszykButton = page.getByAltText('cart logo')
        this.pierwszyHeading = page.locator('.learnings-list__title:has-text("Szkolenia online")')
        this.drugiHeading = page.locator('.learnings-list__title:has-text("Kursy e-learningowe")')
        this.trzeciHeading = page.getByRole('heading', { name: 'Refundacja szkoleń' })
        this.changeViewButton = page.locator('.view-switcher')
        this.backButton = page.getByRole('link', { name: 'Wróć do listy szkoleń' })

        this.szkoleniaButton = this.pierwszyHeading.locator('~ .learnings-list__items .learnings-list-product .learnings-list-product__link')
        this.kursyElearningoweLinks = this.drugiHeading.locator('~ .learnings-list__items .learnings-list-product .learnings-list-product__link')
        this.loadingElearning = this.drugiHeading.locator('~ .learnings-list__items .loading-state')
        this.loadingSzkolenia = this.pierwszyHeading.locator('~ .learnings-list__items .loading-state')

        this.radioButton = page.locator('label:has(input[type="radio"][name="add_to_cart[courseMeeting]"])')
        this.orderButton = page.locator('#add_to_cart_addToCartSubmit')
        this.cartWithoutLogin = page.getByRole('button', { name: 'Kupuję bez logowania' })
        this.cartWithLogin = page.getByRole('button', { name: 'Loguję się' })
        this.onMeRadioButton = page.locator('label:has-text("na mnie")')
        this.nextButton = page.getByRole('button', { name: 'Dalej' })
        this.paymentMethodRadioButton = page.locator('label:has-text("Przelew na konto GWO")')
        this.regulationsCheckbox = page.getByText('* Akceptuję regulamin:')
        this.renouncementCheckbox = page.getByText('* Wyrażam zgodę na')
        this.orderAndPaymentButton = page.getByRole('button', { name: 'Zamawiam i płacę' })
        this.paymentErrorMessage = page.locator('.cart-module__validation:has-text("Wybierz formę płatności.")')
        this.validationErrors = page.locator('.validation-error, .error-message')
        this.deliveryErrorAlert = page.locator('.error.error-alert.active.right:has-text("Wybierz, na kogo ma być złożone zamówienie.")')
    }

    // ============ NAWIGACJA ============

    async otworzSzkoleniaDlaNauczycieli(): Promise<void> {
        await this.otworzStrone(`${this.env.akademia}/szkolenia-dla-nauczycieli`)
        await this.page.waitForLoadState('networkidle')
    }

    async przejdzNaSzczegolySzkolenia(): Promise<string> {
        try {
            await this.loadingSzkolenia.waitFor({ state: 'hidden', timeout: 10000 })
        } catch {
            console.log('Loading dla szkoleń nie znaleziony lub już ukryty – kontynuuję.')
        }

        const wszystkieLinki = this.szkoleniaButton
        const liczbaSzkolen = await wszystkieLinki.count()

        if (liczbaSzkolen === 0) {
            throw new Error('Brak szkoleń na liście.')
        }

        const losowyIndeks = Math.floor(Math.random() * liczbaSzkolen)
        const losowyLink = wszystkieLinki.nth(losowyIndeks)
        const nazwaSzkolenia = await losowyLink.innerText()

        if (nazwaSzkolenia === '') {
            throw new Error('Nie udało się pobrać nazwy losowego szkolenia.')
        }

        await losowyLink.click()
        return nazwaSzkolenia
    }

    async wrocNaListeSzkolen(): Promise<void> {
        await this.backButton.click()
    }

    async otworzLosowyKursElearningowy(): Promise<string> {
        try {
            await this.loadingElearning.waitFor({ state: 'hidden', timeout: 10000 })
        } catch {
            console.log('Loading dla e-learning nie znaleziony lub już ukryty – kontynuuję.')
        }

        const wszystkieLinki = this.kursyElearningoweLinks
        const liczbaKursow = await wszystkieLinki.count()

        if (liczbaKursow === 0) {
            throw new Error('Brak kursów e-learningowych na liście.')
        }

        const losowyIndeks = Math.floor(Math.random() * liczbaKursow)
        const losowyLink = wszystkieLinki.nth(losowyIndeks)
        const nazwaKursu = await losowyLink.innerText()

        if (nazwaKursu === '') {
            throw new Error('Nie udało się pobrać nazwy losowego kursu.')
        }

        await losowyLink.click()
        return nazwaKursu
    }

    getSzkolenieButton(index: number): Locator {
        return this.szkoleniaButton.nth(index)
    }

    getRadioButtonDlaTerminu(index: number): Locator {
        return this.radioButton.nth(index)
    }

    // ============ ELEMENTY STRONY ============

    async kliknijKoszyk(): Promise<void> {
        await this.koszykButton.click()
    }

    async zmienWidok(): Promise<void> {
        await this.changeViewButton.click()
    }

    // ============ PROCES ZAMÓWIENIA ============

    async dodajSzkolenieDoKoszyka(index: number = 0): Promise<void> {
        const radio = this.getRadioButtonDlaTerminu(index)
        await radio.check()
        await expect(radio).toBeChecked()
        await this.orderButton.click()
    }

    private async fillInputField(selector: string, value: string): Promise<void> {
        const input = this.page.locator(selector)
        await input.fill(value)
        await expect(input).toHaveValue(value)
    }

    private async handleCartSelectionWithoutLogin(): Promise<void> {
        await this.cartWithoutLogin.click()
        await this.onMeRadioButton.check()
        await expect(this.onMeRadioButton).toBeChecked()
        await this.nextButton.click()
    }

    private async handleCartSelectionWithLogin(): Promise<void> {
        await this.cartWithLogin.click()
        await this.zalogujSieNaAkademie(process.env.GWO_LOGIN!, process.env.GWO_PASSWORD!)
        await this.onMeRadioButton.check()
        await expect(this.onMeRadioButton).toBeChecked()
        await this.nextButton.click()
    }

    private async fillOrderDetails(dane: DaneZamowieniaBezLogowania | DaneZamowieniaZLogowaniem, includeEmail: boolean = true): Promise<void> {
        await this.nextButton.click()

        await this.paymentMethodRadioButton.check()
        await expect(this.paymentMethodRadioButton).toBeChecked()

        if (includeEmail && 'email' in dane) {
            await this.fillInputField(this.formFields.email, (dane as DaneZamowieniaBezLogowania).email)
        }
        const commonDane = dane as WspolneDaneZamowienia
        await this.fillInputField(this.formFields.phone, commonDane.phone)
        await this.fillInputField(this.formFields.name, commonDane.name)
        await this.fillInputField(this.formFields.surname, commonDane.surname)
        await this.fillInputField(this.formFields.address, commonDane.address)
        await this.fillInputField(this.formFields.number, commonDane.number)
        await this.fillInputField(this.formFields.postalCode, commonDane.postalCode)
        await this.fillInputField(this.formFields.city, commonDane.city)

        await this.nextButton.click()
    }

    private async handleSummaryAndPayment(): Promise<void> {
        await this.page.waitForURL(/podsumowanie/)
        await this.regulationsCheckbox.check()
        await expect(this.regulationsCheckbox).toBeChecked()
        await this.renouncementCheckbox.check()
        await expect(this.renouncementCheckbox).toBeChecked()
        await this.orderAndPaymentButton.click()
        await this.page.waitForURL(/success/)
    }

    async przejdzPrzezProcesZamowieniaBezLogowania(dane: DaneZamowieniaBezLogowania): Promise<void> {
        await this.handleCartSelectionWithoutLogin()
        await this.fillOrderDetails(dane, true) // Z email
        await this.handleSummaryAndPayment()
    }

    async przejdzPrzezProcesZamowieniaZLogowaniem(dane: DaneZamowieniaZLogowaniem): Promise<void> {
        await this.handleCartSelectionWithLogin()
        await this.fillOrderDetails(dane, false) // Bez email
        await this.handleSummaryAndPayment()
    }

    // ============ NEGATYWNE ŚCIEŻKI ============

    async szkolenieBezOdbiorcyFaktury(): Promise<Locator> {
        await this.cartWithoutLogin.click()
        await this.nextButton.click()
        this.waitForLoadState
        return this.deliveryErrorAlert
    }
}
