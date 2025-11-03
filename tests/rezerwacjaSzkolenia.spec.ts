import { test, expect } from '../fixtures/akademiaFixtures'
import { rezerwacjaTestData } from '../testData/rezerwacja.data'

test.describe('Rezerwacja szkolenia - Formularze', () => {
    test.beforeEach(async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.otworzStrone(rezerwacjaTestData.urlSzkolenia)
    })

    // ========== ISTNIEJĄCE TESTY (poprawione) ==========

    test('Rezerwacja - podstawowe dane', async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
            miejscowosc: 'Warszawa',
            data: rezerwacjaTestData.generateFutureDate(30),
            godzina: '14:00',
            liczbaOsob: 25,
        })

        await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/rezerwacja/)
    })

    // ========== NOWE TESTY - WALIDACJA FORMULARZA REZERWACJI ==========

    test.describe('Walidacja - Formularz rezerwacji', () => {
        test('Wszystkie pola puste', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.kliknijRezerwuje()

            const expectedErrors = ['Wybierz miejscowość', 'Wybierz datę', 'Wybierz godzinę', 'Wpisz liczbę osób']

            for (const error of expectedErrors) {
                await expect(rezerwacjaSzkoleniaPage.page.getByText(error, { exact: true })).toBeVisible()
            }
        })

        test('Tylko miejscowość wypełniona', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wybierzMiejscowosc('Warszawa')
            await rezerwacjaSzkoleniaPage.kliknijRezerwuje()

            await expect(rezerwacjaSzkoleniaPage.page.getByText('Wybierz datę')).toBeVisible()
            await expect(rezerwacjaSzkoleniaPage.page.getByText('Wybierz godzinę')).toBeVisible()
        })

        test('Data w przeszłości', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generatePastDate(1),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await expect(rezerwacjaSzkoleniaPage.page.getByText('Data szkolenia nie może być przeszła.')).toBeVisible()
        })

        test('Data dzisiaj - powinna być akceptowana', async ({ rezerwacjaSzkoleniaPage }) => {
            const today = new Date().toISOString().split('T')[0]

            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: today,
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/rezerwacja/)
        })

        test('Liczba osób - wartość ujemna', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wypelnijFormularzRezerwacji({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: -5,
            })

            await rezerwacjaSzkoleniaPage.kliknijRezerwuje()

            await expect(rezerwacjaSzkoleniaPage.page.getByText(/Wpisz liczbę osób/)).toBeVisible()
        })

        test('Liczba osób - zero', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wypelnijLiczbeOsob(0)
            await rezerwacjaSzkoleniaPage.kliknijRezerwuje()

            await expect(rezerwacjaSzkoleniaPage.page.getByText(/Wpisz liczbę osób/)).toBeVisible()
        })
    })
    // ========== WALIDACJA FORMULARZA ADRESOWEGO ==========

    test.describe('Walidacja - Formularz adresowy', () => {
        test.beforeEach(async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await rezerwacjaSzkoleniaPage.kliknijDalej()
        })

        test('Wszystkie pola puste', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wyslijFormularzAdresowy()

            const invalidFields = await rezerwacjaSzkoleniaPage.page.locator(':invalid').count()
            expect(invalidFields).toBeGreaterThan(0)
        })

        test('Niepoprawny email', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wypelnijDaneKontaktowe({
                imie: 'Jan',
                nazwisko: 'Kowalski',
                email: 'niepoprawny-email',
                telefon: '123456789',
            })

            await rezerwacjaSzkoleniaPage.wyslijFormularzAdresowy()

            const emailInvalid = await rezerwacjaSzkoleniaPage.contactEmailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
            expect(emailInvalid).toBe(true)
        })

        test('Niepoprawny NIP - za krótki', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.billingNipInput.fill('123')
            await rezerwacjaSzkoleniaPage.wyslijFormularzAdresowy()

            await expect(rezerwacjaSzkoleniaPage.page.getByText(/Wpisany numer NIP nie jest prawidłowy./)).toBeVisible()
        })

        test('Niepoprawny kod pocztowy', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.billingPostcodeInput.fill('123')
            await rezerwacjaSzkoleniaPage.wyslijFormularzAdresowy()

            await expect(rezerwacjaSzkoleniaPage.page.getByText(/Wpisany kod pocztowy nie jest prawidłowy./)).toBeVisible()
        })

        test('Płatnik - odznacz "takie same" i nie wypełnij pól', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.wypelnijDanePlatnika({
                sameAsBilling: false,
            })

            await rezerwacjaSzkoleniaPage.wyslijFormularzAdresowy()

            const payerInvalidFields = await rezerwacjaSzkoleniaPage.page.locator('#reservation_cart_address_payersAddress_0_company:invalid').count()
            expect(payerInvalidFields).toBeGreaterThan(0)
        })
    })

    // ========== NOWE TESTY - FUNKCJONALNOŚĆ ==========

    test.describe('Funkcjonalność', () => {
        test('Uwagi - licznik znaków max 300', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.commentCheckbox.check()
            await rezerwacjaSzkoleniaPage.messageArea.waitFor({ state: 'visible' })

            const longText = 'A'.repeat(350) // Więcej niż max
            await rezerwacjaSzkoleniaPage.messageTextarea.fill(longText)

            const actualLength = await rezerwacjaSzkoleniaPage.messageTextarea.inputValue()
            expect(actualLength.length).toBeLessThanOrEqual(300)

            const counter = await rezerwacjaSzkoleniaPage.pobierzLicznikZnakow()
            expect(parseInt(counter)).toBeLessThanOrEqual(300)
        })

        test('Nawigacja - powrót do listy szkoleń', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/rezerwacja/)
            await rezerwacjaSzkoleniaPage.kliknijPowrotDoListySzkolen()

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/szkolenia-dla-rad-pedagogicznych/)
        })

        test('Nawigacja - powrót do rezerwacji', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await rezerwacjaSzkoleniaPage.kliknijDalej()
            await rezerwacjaSzkoleniaPage.kliknijPowrotDoRezerwacji()

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/rezerwacja/)
        })
    })

    // ========== NOWE TESTY - PEŁNY FLOW ==========

    test.describe('Pełny flow rezerwacji', () => {
        test('Rezerwacja bez zwolnienia z VAT', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await rezerwacjaSzkoleniaPage.zakonczRezerwacje({
                kontakt: rezerwacjaTestData.daneKontaktowe,
                faktura: {
                    ...rezerwacjaTestData.daneFaktury,
                    zwolnienieVat: false, // NIE
                },
                platnik: {
                    sameAsBilling: true,
                },
            })
            await rezerwacjaSzkoleniaPage.page.waitForLoadState('networkidle')
            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/potwierdzenie/)
        })

        test('Rezerwacja - płatnik z innymi danymi', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await rezerwacjaSzkoleniaPage.zakonczRezerwacje({
                kontakt: rezerwacjaTestData.daneKontaktowe,
                faktura: rezerwacjaTestData.daneFaktury,
                platnik: {
                    sameAsBilling: false,
                    nazwa: 'Inna Firma Sp. z o.o.',
                    ulica: 'Inna',
                    nrBudynku: '99',
                    kodPocztowy: '00-999',
                    miejscowosc: 'Gdańsk',
                },
            })

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/potwierdzenie/, { timeout: 7500 })
        })

        test('Weryfikacja numeru rezerwacji', async ({ rezerwacjaSzkoleniaPage }) => {
            await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
                miejscowosc: 'Warszawa',
                data: rezerwacjaTestData.generateFutureDate(30),
                godzina: '14:00',
                liczbaOsob: 25,
            })

            await rezerwacjaSzkoleniaPage.zakonczRezerwacje({
                kontakt: rezerwacjaTestData.daneKontaktowe,
                faktura: rezerwacjaTestData.daneFaktury,
                platnik: { sameAsBilling: true },
            })

            await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/potwierdzenie/)
            const numerZUrl = await rezerwacjaSzkoleniaPage.pobierzNumerRezerwacji()
            const numerZKomunikatu = await rezerwacjaSzkoleniaPage.pobierzNumerRezerwacjiZKomunikatu()

            expect(numerZUrl).toBe(numerZKomunikatu)
            expect(numerZUrl).not.toBe('')
        })
    })
})
