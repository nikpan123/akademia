import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData, DaneZamowieniaBezLogowania, DaneZamowieniaZLogowaniem } from '../testData/akademia.data'

test.describe('Szkolenia dla nauczycieli', () => {
    test.beforeEach(async ({ szkoleniaDlaNauczycieliPage }) => {
        await szkoleniaDlaNauczycieliPage.otworzSzkoleniaDlaNauczycieli()
        await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*\/szkolenia-dla-nauczycieli.*/)
    })

    test.describe('Nawigacja', () => {
        test('Koszyk', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.kliknijKoszyk()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*\/koszyk.*/)
        })

        test('Zmiana widoku', async ({ szkoleniaDlaNauczycieliPage }) => {
            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.changeViewButton).toBeVisible()
        })

        test('Kontakt', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaKontakt()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*\/kontakt.*/)
        })

        test('Szczegóły szkolenia - nawigacja do szczegółów', async ({ szkoleniaDlaNauczycieliPage }) => {
            const nazwaSzkolenia = await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            expect(nazwaSzkolenia).not.toBe('')

            // Asercje
            const tytulNaStronie = szkoleniaDlaNauczycieliPage.page.locator('h1')
            await expect(tytulNaStronie).toContainText(nazwaSzkolenia)
        })

        test('Powrót do listy szkoleń', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.wrocNaListeSzkolen()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*\/szkolenia-dla-nauczycieli.*/)
        })

        test('Kursy e-learningowe - nawigacja do szczegółów', async ({ szkoleniaDlaNauczycieliPage }) => {
            const nazwaKursu = await szkoleniaDlaNauczycieliPage.otworzLosowyKursElearningowy()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page.locator('h1')).toContainText(nazwaKursu)
            await expect(nazwaKursu).not.toBe('')
        })
    })

    test.describe('Stopka', () => {
        test('Weryfikacja adresu', async ({ szkoleniaDlaNauczycieliPage }) => {
            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.adres).toBeVisible({ timeout: 3000 })
            const expectedMessage = await szkoleniaDlaNauczycieliPage.adres.innerText()
            expect(expectedMessage).toContain(akademiaTestData.adresWStopce)
        })

        test('Przejście na politykę prywatności', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaPolitykePrywatnosci()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*polityka-prywatnosci.*/)
            await expect(
                szkoleniaDlaNauczycieliPage.page.getByRole('heading', {
                    name: 'Polityka Prywatności',
                    level: 1,
                })
            ).toBeVisible()
        })

        test('Przejście na regulamin szkoleń', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaRegulaminSzkolen()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/.*regulamin.*/)
            await expect(
                szkoleniaDlaNauczycieliPage.page.getByRole('heading', {
                    name: 'Regulaminy',
                    level: 1,
                })
            ).toBeVisible()
        })

        test('Przejście na GWO', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaGwo()
            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/https:\/\/gwo\.pl\/?/)
        })

        test('Przejście na Facebook', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaFacebook()
            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/https:\/\/pl-pl\.facebook\.com\/GdanskieWydawnictwoOswiatowe\/?/)
        })
    })

    test.describe('Proces zamówienia', () => {
        test('Zamówienie bez logowania', async ({ szkoleniaDlaNauczycieliPage }) => {
            const mojeDane: DaneZamowieniaBezLogowania = {
                email: 'test@test56465465.pl',
                phone: '123456789',
                name: 'Jan',
                surname: 'Testowy',
                address: 'Testowa',
                number: '12',
                postalCode: '12-123',
                city: 'Testowo',
            }

            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.przejdzPrzezProcesZamowieniaBezLogowania(mojeDane)

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/success/)
            await expect(szkoleniaDlaNauczycieliPage.page.getByText('Potwierdzenie')).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText(akademiaTestData.gwoAccount)).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText(akademiaTestData.adres)).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText('Dziękujemy za złożenie zamówienia!')).toBeVisible()
        })

        test('Zamówienie z logowaniem', async ({ szkoleniaDlaNauczycieliPage }) => {
            const mojeDane: DaneZamowieniaZLogowaniem = {
                phone: '123456789',
                name: 'Jan',
                surname: 'Testowy',
                address: 'Testowa',
                number: '12',
                postalCode: '12-123',
                city: 'Testowo',
            }

            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.przejdzPrzezProcesZamowieniaZLogowaniem(mojeDane)

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/success/)
            await expect(szkoleniaDlaNauczycieliPage.page.getByText('Potwierdzenie')).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText(akademiaTestData.gwoAccount)).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText(akademiaTestData.adres)).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page.getByText('Dziękujemy za złożenie zamówienia!')).toBeVisible()
        })
    })

    test.describe('Proces zamówienia - negatywne ścieżki', () => {
        test('Brak możliwości przejscia dalej z pustym koszykiem', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.kliknijKoszyk()

            await expect(szkoleniaDlaNauczycieliPage.nextButton).not.toBeVisible()

            await szkoleniaDlaNauczycieliPage.wrocNaListeSzkolen()

            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
        })

        test('Zamówienie bez wyboru odbiorcy faktury', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            const errorAlert = await szkoleniaDlaNauczycieliPage.szkolenieBezOdbiorcyFaktury()

            // Asercje
            await expect(errorAlert).toBeVisible({ timeout: 5000 })
            await expect(errorAlert).toContainText('Wybierz, na kogo ma być złożone zamówienie.')
            await expect(errorAlert.locator('img[alt="error"]')).toBeVisible()
            await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/dane-zamowienia/)
        })

        test('Usunięcie Szkolenie z koszyka', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.usuniecieSzkoleniaZKoszyka()

            // Asercje
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
        })

        test('Walidacja wszystkich pól formularza: Pusty formularz', async ({ szkoleniaDlaNauczycieliPage }) => {
            const oczekiwaneKomunikatyWalidacyjneDanych: string[] = [
                'Wpisz poprawny e-mail.',
                'Wpisz poprawny numer telefonu.',
                'Wpisz imię.',
                'Wpisz nazwisko.',
                'Wpisz nazwę ulicy.',
                'Wpisz numer.',
                'Wpisz kod pocztowy.',
                'Wpisz miejscowość.',
            ]

            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.handleCartSelectionWithoutLogin()
            await szkoleniaDlaNauczycieliPage.zatwierdzFormularzZamowienia()
            await szkoleniaDlaNauczycieliPage.page.waitForSelector('[data-testid="validation-error"]', { state: 'visible' })

            for (const komunikat of oczekiwaneKomunikatyWalidacyjneDanych) {
                await expect(
                    szkoleniaDlaNauczycieliPage.page.getByText(komunikat, { exact: true }),
                    `Błąd walidacji danych: "${komunikat}" nie jest widoczny!`
                ).toBeVisible()
            }

            //  Asercje
            await expect(szkoleniaDlaNauczycieliPage.paymentErrorMessage, `Błąd "Wybierz formę płatności." nie jest widoczny!`).toBeVisible()
            const LICZBA_POL_DANYCH = oczekiwaneKomunikatyWalidacyjneDanych.length
            await expect(szkoleniaDlaNauczycieliPage.validationErrors, `Liczba błędów danych nie zgadza się. Oczekiwano ${LICZBA_POL_DANYCH}.`).toHaveCount(
                LICZBA_POL_DANYCH,
                { timeout: 5000 }
            )
            await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/podsumowanie/)
        })

        test('Walidacja checkboxów', async ({ szkoleniaDlaNauczycieliPage }) => {
            const mojeDane: DaneZamowieniaBezLogowania = {
                email: 'test@test56465465.pl',
                phone: '123456789',
                name: 'Jan',
                surname: 'Testowy',
                address: 'Testowa',
                number: '12',
                postalCode: '12-123',
                city: 'Testowo',
            }

            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.handleCartSelectionWithoutLogin()
            await szkoleniaDlaNauczycieliPage.fillOrderDetails(mojeDane, true)
            await szkoleniaDlaNauczycieliPage.page.waitForURL(/podsumowanie/)
            await szkoleniaDlaNauczycieliPage.orderAndPaymentButton.click()

            // Asercje
            await expect(
                szkoleniaDlaNauczycieliPage.regulationsErrorFrame,
                'Oczekiwano, że dwa kontenery regulaminów otrzymają ramkę błędu (.error).'
            ).toHaveCount(2, { timeout: 10000 })

            await expect(
                szkoleniaDlaNauczycieliPage.regulationsErrorAlert,
                'Nie pojawił się boczny komunikat "Zaakceptuj regulaminy. Wyraź wymagane zgody."'
            ).toBeVisible()

            await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/sukces/)
        })
    })
})
