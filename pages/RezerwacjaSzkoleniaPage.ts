import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class RezerwacjaSzkoleniaPage extends BasePage {
    // Lokatory formularza
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

    // Komunikaty
    readonly errorAlert: Locator
    readonly validationErrors: Locator

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

        // Przycisk submit
        this.submitButton = page.getByRole('button', { name: 'Rezerwuję' })

        // Komunikaty błędów
        this.errorAlert = page.locator('.error-alert')
        this.validationErrors = page.locator('.validation-error, .error-message')
    }

    // ============ WYPEŁNIANIE FORMULARZA ============

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

    // ============ WERYFIKACJE ============

    async sprawdzCzyMiejscowoscWybrana(): Promise<boolean> {
        const value = await this.placeSelect.inputValue()
        return value !== '' && value !== '64' // 64 to może być default, sprawdź!
    }

    async pobierzLicznikZnakow(): Promise<string> {
        return await this.symbolCounter.innerText()
    }

    // ============ METODA KOMPLEKSOWA ============

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
