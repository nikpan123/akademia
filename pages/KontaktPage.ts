import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class KontaktPage extends BasePage {
    // Lokatory formularza
    readonly fullNameInput: Locator
    readonly placeTomSelectControl: Locator
    readonly placeDropdownInput: Locator
    readonly placeDropdown: Locator
    readonly placeSelect: Locator
    readonly emailInput: Locator
    readonly phoneInput: Locator
    readonly schoolLevelSelect: Locator
    readonly schoolFunctionSelect: Locator
    readonly courseTypeSelect: Locator
    readonly subjectInput: Locator
    readonly messageTextarea: Locator
    readonly symbolCounter: Locator
    readonly acceptCookiesButton: Locator = this.page.getByRole('button', { name: 'Akceptuję i przechodzę do Serwisu' })

    // Lokatory dla checkboxów RODO
    readonly rodoDataCheckbox: Locator
    readonly rodoSalesCheckbox: Locator
    readonly contactAgreementCheckbox: Locator

    // Przyciski
    readonly submitButton: Locator

    // Komunikaty
    readonly errorAlert: Locator

    // Lokatory dla strony sukcesu (po wysłaniu formularza)
    readonly successMessage: Locator
    readonly successContactMessage: Locator
    readonly returnToHomeLink: Locator

    constructor(page: Page) {
        super(page)

        // Imię i nazwisko
        this.fullNameInput = page.locator('#contact_form_fullName')

        // Tom Select - powiat
        this.placeTomSelectControl = page.locator('#contact_form_county-ts-control')
        this.placeDropdownInput = page.locator('.ts-dropdown .dropdown-input')
        this.placeDropdown = page.locator('.ts-dropdown')
        this.placeSelect = page.locator('#contact_form_county')

        // E-mail
        this.emailInput = page.locator('#contact_form_email')

        // Telefon
        this.phoneInput = page.locator('#contact_form_phone')

        // Poziom nauczania
        this.schoolLevelSelect = page.locator('#contact_form_schoolLevel')

        // Funkcja w szkole
        this.schoolFunctionSelect = page.locator('#contact_form_schoolFunction')

        // Typ szkolenia
        this.courseTypeSelect = page.locator('#contact_form_courseType')

        // Temat wiadomości
        this.subjectInput = page.locator('#contact_form_subject')

        // Treść wiadomości
        this.messageTextarea = page.locator('#contact_form_message')
        this.symbolCounter = page.locator('[data-contact-target="symbolCounter"]')

        // Checkboxy RODO
        this.rodoDataCheckbox = page.locator('span').filter({ hasText: 'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia mi' })
        this.rodoSalesCheckbox = page.locator('span').filter({ hasText: 'Jeżeli moje pytanie dotyczyć' })
        this.contactAgreementCheckbox = page.locator('#contact_form_contactAgreement')

        // Przycisk submit
        this.submitButton = page.getByRole('button', { name: 'Wyślij' })

        // Komunikaty błędów
        this.errorAlert = page.locator('.error-alert')

        // Strona sukcesu
        this.successMessage = page.locator('.cart-module__stand-alone .heading strong', { hasText: 'Dziękujemy za wysłanie wiadomości.' })
        this.successContactMessage = page.locator('.cart-module__stand-alone .heading', {
            hasText: 'Wkrótce skontaktujemy się z Tobą poprzez podany adres e-mail.',
        })
        this.returnToHomeLink = page.getByRole('link', { name: 'Wróć do strony głównej' })
    }

    // ============ WYPEŁNIANIE FORMULARZA ============

    async akceptujCookies(): Promise<void> {
        await this.acceptCookiesButton.click()
    }
    async otworzKontakt(): Promise<void> {
        await this.otworzStrone(`${this.env.akademia}/kontakt`)
        await this.page.waitForLoadState('networkidle')
    }

    async wypelnijImieNazwisko(imieNazwisko: string): Promise<void> {
        await this.fullNameInput.fill(imieNazwisko)
    }

    async wybierzPowiat(powiat: string): Promise<void> {
        await this.placeTomSelectControl.click()
        await this.placeDropdown.waitFor({ state: 'visible' })
        await this.placeDropdownInput.fill(powiat)
        await this.page.waitForTimeout(2000)
        await this.page.locator('.ts-dropdown-content .option').first().click()
    }

    async wypelnijEmail(email: string): Promise<void> {
        await this.emailInput.fill(email)
    }

    async wypelnijTelefon(telefon: string): Promise<void> {
        if (telefon) {
            await this.phoneInput.fill(telefon)
        }
    }

    async wybierzPoziomNauczania(poziom: string): Promise<void> {
        const currentValue = await this.schoolLevelSelect.inputValue()
        if (currentValue !== poziom) {
            await this.schoolLevelSelect.selectOption(poziom)
        }
    }

    async wybierzFunkcjeWSzkole(funkcja: string): Promise<void> {
        if (funkcja) {
            const currentValue = await this.schoolFunctionSelect.inputValue()
            if (currentValue !== funkcja) {
                await this.schoolFunctionSelect.selectOption(funkcja)
            }
        }
    }

    async wybierzTypSzkolenia(typ: string): Promise<void> {
        const currentValue = await this.courseTypeSelect.inputValue()
        if (currentValue !== typ) {
            await this.courseTypeSelect.selectOption(typ)
        }
    }

    async wypelnijTemat(temat: string): Promise<void> {
        await this.subjectInput.fill(temat)
    }

    async wypelnijTresc(tresc: string): Promise<void> {
        await this.messageTextarea.fill(tresc)
    }

    async wyslijFormularz(): Promise<void> {
        await this.submitButton.click()
    }

    // ============ METODY DLA CHECKBOXÓW RODO ============

    async zaznaczZgodeNaPrzetwarzanieDanych(): Promise<void> {
        if (!(await this.rodoDataCheckbox.isChecked())) {
            await this.rodoDataCheckbox.check()
        }
    }

    async zaznaczZgodeNaInformacjeHandlowe(): Promise<void> {
        if (!(await this.rodoSalesCheckbox.isChecked())) {
            await this.rodoSalesCheckbox.check()
        }
    }

    async zaznaczZgodeNaKontaktTelefoniczny(zaznacz: boolean = true): Promise<void> {
        if (zaznacz) {
            if (!(await this.contactAgreementCheckbox.isChecked())) {
                await this.contactAgreementCheckbox.check()
            }
        } else {
            if (await this.contactAgreementCheckbox.isChecked()) {
                await this.contactAgreementCheckbox.uncheck()
            }
        }
    }

    // ============ METODY DLA STRONY SUKCESU ============

    async sprawdzCzyStronaSukcesuWidoczna(): Promise<boolean> {
        return await this.successMessage.isVisible()
    }

    async pobierzTekstKomunikatuSukcesu(): Promise<string> {
        return await this.successMessage.innerText()
    }

    async pobierzTekstKomunikatuKontaktowego(): Promise<string> {
        return await this.successContactMessage.innerText()
    }

    async kliknijPowrotDoStronyGlownej(): Promise<void> {
        await this.returnToHomeLink.click()
    }

    async sprawdzCzyPrzekierowanoNaStroneGlowna(): Promise<boolean> {
        return this.page.url().includes('/')
    }

    // ============ WERYFIKACJE ============

    async sprawdzCzyPowiatWybrany(): Promise<boolean> {
        const value = await this.placeSelect.inputValue()
        return value !== '' && value !== 'Wybierz powiat'
    }

    async pobierzLicznikZnakow(): Promise<string> {
        return await this.symbolCounter.innerText()
    }

    // ============ METODA KOMPLEKSOWA ============

    async wypelnijFormularzKontaktowy(dane: {
        imieNazwisko: string
        powiat: string
        email: string
        telefon?: string
        poziomNauczania: string
        funkcjaWSzkole?: string
        typSzkolenia: string
        temat: string
        tresc: string
        zaznaczKontaktTelefonczny?: boolean
    }): Promise<void> {
        await this.akceptujCookies()
        await this.wybierzPowiat(dane.powiat)
        await this.wypelnijImieNazwisko(dane.imieNazwisko)
        await this.wypelnijEmail(dane.email)
        await this.wybierzPoziomNauczania(dane.poziomNauczania)
        await this.wybierzTypSzkolenia(dane.typSzkolenia)
        await this.wypelnijTemat(dane.temat)
        await this.wypelnijTresc(dane.tresc)

        if (dane.telefon) {
            await this.wypelnijTelefon(dane.telefon)
        }

        if (dane.funkcjaWSzkole) {
            await this.wybierzFunkcjeWSzkole(dane.funkcjaWSzkole)
        }
        await this.page.locator('.rodo-block').waitFor({ state: 'visible' })
        await this.zaznaczZgodeNaPrzetwarzanieDanych()
        await this.zaznaczZgodeNaInformacjeHandlowe()

        if (dane.zaznaczKontaktTelefonczny !== undefined) {
            await this.zaznaczZgodeNaKontaktTelefoniczny(dane.zaznaczKontaktTelefonczny)
        } else {
            await this.zaznaczZgodeNaKontaktTelefoniczny(false)
        }
    }

    async wyslijKontakt(dane: {
        imieNazwisko: string
        powiat: string
        email: string
        telefon?: string
        poziomNauczania: string
        funkcjaWSzkole?: string
        typSzkolenia: string
        temat: string
        tresc: string
        zaznaczKontaktTelefonczny?: boolean
    }): Promise<void> {
        await this.wypelnijFormularzKontaktowy(dane)
        await this.wyslijFormularz()
    }
}
