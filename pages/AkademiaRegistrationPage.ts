import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import { getRandomTeachingSubject } from '../utils/generators'
import { zaznaczLosowePoziomyNauczania, zaznaczLosowyCheckbox } from '../utils/formHelpers'

export class AkademiaRegistrationPage extends BasePage {
    // Lokatory na stronie Akademii
    readonly zalogujButton: Locator

    // Lokatory na stronie Moje GWO
    readonly submitButton: Locator
    readonly accountButton: Locator

    // Lokatory na stronie rejestracji
    readonly registrationEmailInput: Locator
    readonly registrationPasswordInput: Locator
    readonly registrationTeacher: Locator
    readonly registrationStudent: Locator
    readonly registrationOther: Locator
    readonly registrationHeadTeacher: Locator
    readonly registrationParent: Locator
    readonly registrationAcceptRegulation: Locator
    readonly registrationButton: Locator
    readonly registrationSuccessMessage: Locator
    readonly registrationFailMessage: Locator

    // Formularz nauczyciela
    readonly registrationDropdown: Locator
    readonly registrationSchoolLevel: Locator
    readonly registrationSchoolLevels: Locator
    readonly registrationSimpleSchoolLevels: Locator

    constructor(page: Page) {
        super(page)

        // Przyciski na akademii
        this.zalogujButton = this.page.locator('a:has-text("Zaloguj"), button:has-text("Zaloguj")').first()

        // Formularz na moje.gwodev.pl
        this.submitButton = this.page.getByTestId('send')
        this.accountButton = this.page.getByTestId('registerAccount')

        // Formularz rejestracji
        this.registrationEmailInput = this.page.getByTestId('email').getByRole('textbox')
        this.registrationPasswordInput = this.page.getByTestId('password').getByRole('textbox')
        this.registrationTeacher = this.page.getByRole('checkbox', {
            name: 'nauczycielem',
        })
        this.registrationStudent = this.page.getByRole('checkbox', {
            name: 'uczniem',
        })
        this.registrationOther = this.page.getByRole('checkbox', {
            name: 'kimś innym',
        })
        this.registrationHeadTeacher = this.page.getByRole('checkbox', {
            name: 'dyrektorem',
        })
        this.registrationParent = this.page.getByRole('checkbox', {
            name: 'rodzicem',
        })
        this.registrationAcceptRegulation = this.page.getByRole('checkbox', {
            name: '* Akceptuję regulamin serwisu.',
        })
        this.registrationButton = this.page.getByTestId('submit')
        this.registrationSuccessMessage = this.page.getByTestId('successfullyRegisteredPanel')
        this.registrationFailMessage = this.page.getByTestId('errorPanel')

        // Formularz nauczyciela
        this.registrationDropdown = this.page.getByTestId('subject').getByLabel('')
        this.registrationSimpleSchoolLevels = this.page.getByTestId('simpleSchoolLevel')
        this.registrationSchoolLevel = this.registrationSimpleSchoolLevels.first()
        this.registrationSchoolLevels = this.page.getByTestId('schoolLevel')
    }

    // ============ POMOCNICZE METODY ============
    async zaznaczLosowePoziomyNauczania(minCount: number = 1, maxCount: number = 3): Promise<void> {
        await zaznaczLosowePoziomyNauczania(this.registrationSchoolLevels, minCount, maxCount)
    }

    async zaznaczLosowyPoziomNauczania(): Promise<void> {
        await zaznaczLosowyCheckbox(this.registrationSimpleSchoolLevels)
    }

    async przejdźDoRejestracji(): Promise<void> {
        await this.kliknijZaloguj()
        await this.czekajNaStroneMojeGwo()
        await this.kliknijNieMamKonta()
    }

    async kliknijZaloguj(): Promise<void> {
        await this.zalogujButton.click()
    }

    async czekajNaStroneMojeGwo(): Promise<void> {
        await this.page.waitForURL(new RegExp(`${this.env.moje}.*`), {
            timeout: 15000,
        })
        await this.waitForLoadState()
    }

    async kliknijNieMamKonta(): Promise<void> {
        await this.accountButton.waitFor({ state: 'visible', timeout: 5000 })
        await this.accountButton.click()
        await this.page.waitForURL(/.*\/rejestracja.*/, { timeout: 10000 })
    }

    // ============ WSPÓLNA LOGIKA REJESTRACJI ============
    /**
     * Prywatna metoda do wykonania rejestracji z parametrami.
     * @param email - Email (opcjonalny dla testów błędów)
     * @param password - Hasło (opcjonalne)
     * @param rolaLocator - Locator roli do zaznaczenia
     * @param zaznaczPoziomy - Czy zaznaczyć poziomy nauczania (domyślnie tak dla nauczyciela/dyrektora)
     * @param subject - Opcjonalny przedmiot
     * @param akceptujRegulamin - Czy zaakceptować regulamin (domyślnie tak)
     * @param oczekiwanyWynik - 'success' lub 'fail'
     * @param wybierzPrzedmiot - Czy wybrać przedmiot (domyślnie tak dla ról wymagających)
     */

    private async wykonajRejestracje(
        email?: string,
        password?: string,
        rolaLocator?: Locator,
        zaznaczPoziomy: boolean = true,
        subject?: string,
        akceptujRegulamin: boolean = true,
        oczekiwanyWynik: 'success' | 'fail' = 'success',
        wybierzPrzedmiot: boolean = true
    ): Promise<void> {
        await this.przejdźDoRejestracji()
        if (email) await this.registrationEmailInput.fill(email)
        if (password) await this.registrationPasswordInput.fill(password)
        if (rolaLocator) await rolaLocator.check()
        if (akceptujRegulamin) await this.registrationAcceptRegulation.check()

        // Wybór przedmiotu: zawsze dla nauczyciela
        const requiresSubject = rolaLocator && rolaLocator === this.registrationTeacher
        if (requiresSubject && wybierzPrzedmiot) {
            await this.registrationDropdown.waitFor({ state: 'visible' }) // Upewnij się, że dropdown jest dostępny po check roli
            await this.registrationDropdown.click()
            const teachingSubject = subject || getRandomTeachingSubject()
            await this.page.getByRole('option', { name: teachingSubject, exact: true }).click()
        }

        // Zaznaczanie poziomów nauczania: dostosowane do roli
        if (zaznaczPoziomy) {
            if (rolaLocator === this.registrationStudent || rolaLocator === this.registrationParent) {
                await this.zaznaczLosowePoziomyNauczania(1, 3) // Multiple dla ucznia/rodzica
            } else {
                await this.zaznaczLosowyPoziomNauczania() // Single dla nauczyciela/dyrektora
            }
        }

        await this.registrationButton.click()

        const message = oczekiwanyWynik === 'success' ? this.registrationSuccessMessage : this.registrationFailMessage
        await message.waitFor({ state: 'visible', timeout: 15000 })
    }

    // ============ REJESTRACJA - UPROSZCZONE METODY ============
    async zarejestrujJakoNauczyciel(login: string, password: string, subject?: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationTeacher, true, subject, true, 'success', true)
    }

    async zarejestrujJakoUczeń(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationStudent, true)
    }

    async zarejestrujJakoInny(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationOther, false)
    }

    async zarejestrujJakoDyrektor(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationHeadTeacher, true)
    }

    async zarejestrujJakoRodzic(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationParent, true)
    }

    // ============ TESTY BŁĘDÓW ============
    async zarejestrujBezLoginu(password: string, subject?: string): Promise<void> {
        await this.wykonajRejestracje(undefined, password, this.registrationTeacher, true, subject, true, 'fail')
    }

    async zarejestrujBezHasla(login: string, subject?: string): Promise<void> {
        await this.wykonajRejestracje(login, undefined, this.registrationTeacher, true, subject, true, 'fail')
    }

    async zarejestrujBezFunkcji(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, undefined, false, undefined, true, 'fail')
    }

    async zarejestrujBezRegulaminu(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationOther, false, undefined, false, 'fail')
    }

    async zarejestrujJakoNauczycielBezPrzedmiotu(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationTeacher, true, undefined, true, 'fail', false)
    }

    async zarejestrujJakoNauczycielBezPoziomu(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationTeacher, false, undefined, true, 'fail', true)
    }

    async zarejestrujJakoDyrektorBezPoziomu(login: string, password: string): Promise<void> {
        await this.wykonajRejestracje(login, password, this.registrationHeadTeacher, false, undefined, true, 'fail', true)
    }
}
