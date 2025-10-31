import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class RezerwacjaSzkoleniaPage extends BasePage {
    // Lokatory formularza rezerwacji (istniejące)
    readonly courseModeSelect: Locator
    readonly schoolLevelSelect: Locator

    // Tom Select - miejscowość
    readonly placeTomSelectControl: Locator
    readonly placeDropdownInput: Locator
    readonly placeDropdown: Locator
    readonly placeSelect: Locator

    // Data i godzina
    readonly dateInput: Locator
    readonly hoursInput: Locator
    readonly quantityInput: Locator

    // Uwagi
    readonly commentCheckbox: Locator
    readonly messageTextarea: Locator
    readonly messageArea: Locator
    readonly symbolCounter: Locator

    // Przyciski
    readonly submitButton: Locator
    readonly nextButton: Locator

    // Komunikaty
    readonly errorAlert: Locator
    readonly validationErrors: Locator

    // Nowe lokatory dla formularza adresowego (reservation-cart-address)
    readonly backToListLink: Locator
    readonly backToReservationLink: Locator
    readonly addressSubmitButton: Locator

    // Dane osoby kontaktowej
    readonly contactFirstNameInput: Locator
    readonly contactLastNameInput: Locator
    readonly contactEmailInput: Locator
    readonly contactPhoneInput: Locator

    // Dane do faktury
    readonly billingCompanyInput: Locator
    readonly billingNipInput: Locator
    readonly billingStreetInput: Locator
    readonly billingStreetNumberInput: Locator
    readonly billingPostcodeInput: Locator
    readonly billingCityInput: Locator
    readonly taxFreeYesRadio: Locator
    readonly taxFreeNoRadio: Locator

    // Dane płatnika (pierwszy, zakładamy jeden)
    readonly sameAsBillingCheckbox: Locator
    readonly payerCompanyInput: Locator
    readonly payerStreetInput: Locator
    readonly payerStreetNumberInput: Locator
    readonly payerPostcodeInput: Locator
    readonly payerCityInput: Locator
    readonly addPayerButton: Locator

    constructor(page: Page) {
        super(page)

        // Rodzaj i poziom (często preselected)
        this.courseModeSelect = page.locator('#closed_course_add_to_cart_courseMode')
        this.schoolLevelSelect = page.locator('#closed_course_add_to_cart_schoolLevel')

        // Tom Select - miejscowość (używamy precyzyjnych selektorów)
        this.placeTomSelectControl = page.locator('#closed_course_add_to_cart_place-ts-control')
        this.placeDropdownInput = page.locator('.ts-dropdown .dropdown-input')
        this.placeDropdown = page.locator('.ts-dropdown')
        this.placeSelect = page.locator('#closed_course_add_to_cart_place')

        // Data, godzina, liczba osób
        this.dateInput = page.locator('#closed_course_add_to_cart_date')
        this.hoursInput = page.locator('#closed_course_add_to_cart_hours')
        this.quantityInput = page.locator('#closed_course_add_to_cart_quantity')

        // Uwagi
        this.commentCheckbox = page.getByText('Dodaj uwagi:')
        this.messageTextarea = page.locator('#closed_course_add_to_cart_message')
        this.messageArea = page.locator('[data-personal-order-form-target="messageArea"]')
        this.symbolCounter = page.locator('[data-personal-order-form-target="symbolCounter"]')

        // Przycisk submit (rezerwacja)
        this.submitButton = page.getByRole('button', { name: 'Rezerwuję' })

        // Komunikaty błędów
        this.errorAlert = page.locator('.error-alert')
        this.validationErrors = page.locator('.validation-error, .error-message')
        // Formularz adresowy

        this.nextButton = page.getByRole('button', { name: 'Dalej' })
        this.backToListLink = page.locator('a.btn.btn-transparent:has-text("Wróć do listy szkoleń")')
        this.backToReservationLink = page.locator('a[href="/rezerwacja"]')
        this.addressSubmitButton = page.locator('#reservation_cart_address_submit')

        // Dane osoby kontaktowej
        this.contactFirstNameInput = page.locator('#reservation_cart_address_customer_firstName')
        this.contactLastNameInput = page.locator('#reservation_cart_address_customer_lastName')
        this.contactEmailInput = page.locator('#reservation_cart_address_customer_email')
        this.contactPhoneInput = page.locator('#reservation_cart_address_customer_phone')

        // Dane do faktury
        this.billingCompanyInput = page.locator('#reservation_cart_address_billingAddress_company')
        this.billingNipInput = page.locator('#reservation_cart_address_billingAddress_nip')
        this.billingStreetInput = page.locator('#reservation_cart_address_billingAddress_street')
        this.billingStreetNumberInput = page.locator('#reservation_cart_address_billingAddress_streetNumber')
        this.billingPostcodeInput = page.locator('#reservation_cart_address_billingAddress_postcode')
        this.billingCityInput = page.locator('#reservation_cart_address_billingAddress_city')
        this.taxFreeYesRadio = page.getByText('TAK', { exact: true })
        this.taxFreeNoRadio = page.getByText('NIE', { exact: true })

        // Dane płatnika (pierwszy)
        this.sameAsBillingCheckbox = page.getByText('Dane takie same jak nabywcy')
        this.payerCompanyInput = page.locator('#reservation_cart_address_payersAddress_0_company')
        this.payerStreetInput = page.locator('#reservation_cart_address_payersAddress_0_street')
        this.payerStreetNumberInput = page.locator('#reservation_cart_address_payersAddress_0_streetNumber')
        this.payerPostcodeInput = page.locator('#reservation_cart_address_payersAddress_0_postcode')
        this.payerCityInput = page.locator('#reservation_cart_address_payersAddress_0_city')
        this.addPayerButton = page.locator('#reservation_cart_address_payersAddress_add')
    }

    // ============ WYPEŁNIANIE FORMULARZA REZERWACJI (istniejące metody) ============

    async wybierzRodzajSzkolenia(rodzaj: string): Promise<void> {
        // Tylko jeśli nie jest już wybrany
        const currentValue = await this.courseModeSelect.inputValue()
        if (currentValue !== rodzaj) {
            await this.courseModeSelect.selectOption(rodzaj)
        }
    }

    async wybierzPoziomSzkoly(poziom: string): Promise<void> {
        // Tylko jeśli nie jest już wybrany
        const currentValue = await this.schoolLevelSelect.inputValue()
        if (currentValue !== poziom) {
            await this.schoolLevelSelect.selectOption(poziom)
        }
    }

    async wybierzMiejscowosc(miejscowosc: string): Promise<void> {
        // Tom Select - dokładnie jak w formularzu kontaktowym
        await this.placeTomSelectControl.click()
        await this.placeDropdown.waitFor({ state: 'visible' })
        await this.placeDropdownInput.fill(miejscowosc)
        await this.page.waitForTimeout(2000) // Czekaj na API
        await this.page.locator('.ts-dropdown-content .option').first().click()
    }

    async wypelnijDate(data: string): Promise<void> {
        // Format: YYYY-MM-DD (np. '2025-12-15')
        await this.dateInput.fill(data)
    }

    async wypelnijGodzine(godzina: string): Promise<void> {
        // Format: HH:MM (np. '14:30')
        await this.hoursInput.fill(godzina)
    }

    async wypelnijLiczbeOsob(liczba: string | number): Promise<void> {
        await this.quantityInput.fill(liczba.toString())
    }

    async dodajUwagi(uwagi: string): Promise<void> {
        // Zaznacz checkbox "Dodaj uwagi"
        await this.commentCheckbox.check()

        // Poczekaj aż textarea się pojawi (ma klasę .hidden na starcie)
        await this.messageArea.waitFor({ state: 'visible' })

        // Wpisz uwagi
        await this.messageTextarea.fill(uwagi)
    }

    async kliknijRezerwuje(): Promise<void> {
        await this.submitButton.click()
    }

    // ============ NOWE METODY DLA FORMULARZA ADRESOWEGO ============

    async wypelnijDaneKontaktowe(dane: { imie: string; nazwisko: string; email: string; telefon: string }): Promise<void> {
        await this.contactFirstNameInput.fill(dane.imie)
        await this.contactLastNameInput.fill(dane.nazwisko)
        await this.contactEmailInput.fill(dane.email)
        await this.contactPhoneInput.fill(dane.telefon)
    }

    async wypelnijDaneFaktury(dane: {
        nazwa: string
        nip: string
        ulica: string
        nrBudynku: string
        kodPocztowy: string
        miejscowosc: string
        zwolnienieVat: boolean
    }): Promise<void> {
        await this.billingCompanyInput.fill(dane.nazwa)
        await this.billingNipInput.fill(dane.nip)
        await this.billingStreetInput.fill(dane.ulica)
        await this.billingStreetNumberInput.fill(dane.nrBudynku)
        await this.billingPostcodeInput.fill(dane.kodPocztowy)
        await this.billingCityInput.fill(dane.miejscowosc)

        // Wybierz radio dla zwolnienia z VAT
        if (dane.zwolnienieVat) {
            await this.taxFreeYesRadio.check()
        } else {
            await this.taxFreeNoRadio.check()
        }
    }

    async wypelnijDanePlatnika(dane: {
        sameAsBilling: boolean
        nazwa?: string
        ulica?: string
        nrBudynku?: string
        kodPocztowy?: string
        miejscowosc?: string
    }): Promise<void> {
        // Zaznacz lub odznacz checkbox "Dane takie same jak nabywcy"
        if (dane.sameAsBilling) {
            await this.sameAsBillingCheckbox.check()
        } else {
            await this.sameAsBillingCheckbox.uncheck()
            // Poczekaj na pojawienie się pól (dynamicznie)
            await this.page.waitForSelector('#reservation_cart_address_payersAddress_0_company', { state: 'visible' })

            if (dane.nazwa) await this.payerCompanyInput.fill(dane.nazwa)
            if (dane.ulica) await this.payerStreetInput.fill(dane.ulica)
            if (dane.nrBudynku) await this.payerStreetNumberInput.fill(dane.nrBudynku)
            if (dane.kodPocztowy) await this.payerPostcodeInput.fill(dane.kodPocztowy)
            if (dane.miejscowosc) await this.payerCityInput.fill(dane.miejscowosc)
        }
    }

    async dodajKolejnegoPlatnika(): Promise<void> {
        await this.addPayerButton.click()
        // Tutaj można dodać logikę dla nowych pól, jeśli potrzeba (np. payersAddress[1]...)
    }

    async wyslijFormularzAdresowy(): Promise<void> {
        await this.addressSubmitButton.click()
    }

    async kliknijPowrotDoListySzkolen(): Promise<void> {
        await this.backToListLink.click()
    }

    async kliknijPowrotDoRezerwacji(): Promise<void> {
        await this.backToReservationLink.click()
    }

    async kliknijDalej(): Promise<void> {
        await this.nextButton.click()
    }

    // ============ WERYFIKACJE ============

    async sprawdzCzyMiejscowoscWybrana(): Promise<boolean> {
        const value = await this.placeSelect.inputValue()
        return value !== '' && value !== '64' // 64 to może być default, sprawdź!
    }

    async pobierzLicznikZnakow(): Promise<string> {
        return await this.symbolCounter.innerText()
    }

    async pobierzNumerRezerwacji(): Promise<string> {
        // Z URL: /rezerwacja/123
        const url = this.page.url()
        const match = url.match(/\/rezerwacja\/(\d+)/)
        return match ? match[1] : ''
    }

    async pobierzNumerRezerwacjiZKomunikatu(): Promise<string> {
        const currentUrl = this.page.url()
        const urlNumber = new URL(currentUrl).pathname.split('/')[2]
        return urlNumber
    }

    async sprawdzCzyNaStroniePotwierdzeniaRezerwacji(): Promise<boolean> {
        return this.page.url().includes('/potwierdzenie/')
    }

    // ============ METODA KOMPLEKSOWA DLA FORMULARZA ADRESOWEGO ============

    async wypelnijFormularzAdresowy(dane: {
        kontakt: { imie: string; nazwisko: string; email: string; telefon: string }
        faktura: {
            nazwa: string
            nip: string
            ulica: string
            nrBudynku: string
            kodPocztowy: string
            miejscowosc: string
            zwolnienieVat: boolean
        }
        platnik: {
            sameAsBilling: boolean
            nazwa?: string
            ulica?: string
            nrBudynku?: string
            kodPocztowy?: string
            miejscowosc?: string
        }
    }): Promise<void> {
        await this.page.waitForTimeout(500)
        await this.wypelnijDaneKontaktowe(dane.kontakt)
        await this.page.waitForTimeout(500)
        await this.wypelnijDaneFaktury(dane.faktura)
        await this.page.waitForTimeout(500)
        await this.wypelnijDanePlatnika(dane.platnik)
        await this.page.waitForTimeout(500)
    }

    async zakonczRezerwacje(daneAdresowe: {
        kontakt: { imie: string; nazwisko: string; email: string; telefon: string }
        faktura: {
            nazwa: string
            nip: string
            ulica: string
            nrBudynku: string
            kodPocztowy: string
            miejscowosc: string
            zwolnienieVat: boolean
        }
        platnik: {
            sameAsBilling: boolean
            nazwa?: string
            ulica?: string
            nrBudynku?: string
            kodPocztowy?: string
            miejscowosc?: string
        }
    }): Promise<void> {
        await this.kliknijDalej()
        await this.page.waitForTimeout(500)
        await this.wyslijFormularzAdresowy()
        await this.page.waitForTimeout(500)
        await this.wypelnijFormularzAdresowy(daneAdresowe)
        await this.page.waitForTimeout(500)
        await this.wyslijFormularzAdresowy()
        await this.page.waitForTimeout(500)
    }

    // ============ METODA KOMPLEKSOWA DLA REZERWACJI (istniejąca) ============

    async wypelnijFormularzRezerwacji(dane: {
        rodzajSzkolenia?: string // Opcjonalne, często preselected
        poziomSzkoly?: string // Opcjonalne, często preselected
        miejscowosc: string
        data: string // Format: YYYY-MM-DD
        godzina: string // Format: HH:MM
        liczbaOsob: number
        uwagi?: string
    }): Promise<void> {
        // Rodzaj i poziom (jeśli podane)
        if (dane.rodzajSzkolenia) {
            await this.wybierzRodzajSzkolenia(dane.rodzajSzkolenia)
        }

        if (dane.poziomSzkoly) {
            await this.wybierzPoziomSzkoly(dane.poziomSzkoly)
        }

        // Miejscowość (wymagane)
        await this.wybierzMiejscowosc(dane.miejscowosc)

        // Data i godzina (wymagane)
        await this.wypelnijDate(dane.data)
        await this.wypelnijGodzine(dane.godzina)

        // Liczba osób (wymagane)
        await this.wypelnijLiczbeOsob(dane.liczbaOsob)

        // Uwagi (opcjonalne)
        if (dane.uwagi) {
            await this.dodajUwagi(dane.uwagi)
        }
    }

    async zarezerwujSzkolenie(dane: {
        rodzajSzkolenia?: string
        poziomSzkoly?: string
        miejscowosc: string
        data: string
        godzina: string
        liczbaOsob: number
        uwagi?: string
    }): Promise<void> {
        await this.wypelnijFormularzRezerwacji(dane)
        await this.kliknijRezerwuje()
    }
}
