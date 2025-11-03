import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData, DaneZamowieniaBezLogowania, DaneZamowieniaZLogowaniem } from '../testData/akademia.data'

const generateTestData = (): DaneZamowieniaBezLogowania => ({
    email: `test${Date.now()}@test.pl`,
    phone: '123456789',
    name: 'Jan',
    surname: 'Testowy',
    address: 'Testowa',
    number: '12',
    postalCode: '12-123',
    city: 'Testowo',
})

const assertSuccessPage = async (page: any) => {
    await expect(page).toHaveURL(/success/)
    await expect(page.getByText('Potwierdzenie')).toBeVisible()
    await expect(page.getByText(akademiaTestData.gwoAccount)).toBeVisible()
    await expect(page.getByText(akademiaTestData.adres)).toBeVisible()
    await expect(page.getByText('Dziękujemy za złożenie zamówienia!')).toBeVisible()
}

test.describe('Szkolenia dla nauczycieli', () => {
    test.beforeEach(async ({ szkoleniaDlaNauczycieliPage }) => {
        await szkoleniaDlaNauczycieliPage.otworzSzkoleniaDlaNauczycieli()
        await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
    })

    test.describe('Nawigacja', () => {
        test('Przejście do koszyka', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.kliknijKoszyk()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/koszyk/)
        })

        test('Przycisk zmiany widoku', async ({ szkoleniaDlaNauczycieliPage }) => {
            await expect(szkoleniaDlaNauczycieliPage.changeViewButton).toBeVisible()
        })

        test('Przejście na stronę kontaktu', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaKontakt()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/kontakt/)
        })

        test('Przejście na szczegóły spotkania', async ({ szkoleniaDlaNauczycieliPage }) => {
            const nazwaSzkolenia = await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()

            expect(nazwaSzkolenia).not.toBe('')
            await expect(szkoleniaDlaNauczycieliPage.page.locator('h1')).toContainText(nazwaSzkolenia)
        })

        test('Powrót na listę szkoleń', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.wrocNaListeSzkolen()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
        })

        test('Przejście na szczegóły losowego learningu', async ({ szkoleniaDlaNauczycieliPage }) => {
            const nazwaKursu = await szkoleniaDlaNauczycieliPage.otworzLosowyKursElearningowy()

            expect(nazwaKursu).not.toBe('')
            await expect(szkoleniaDlaNauczycieliPage.page.locator('h1')).toContainText(nazwaKursu)
        })
    })

    test.describe('Stopka', () => {
        test('Sprawdzenie adresu', async ({ szkoleniaDlaNauczycieliPage }) => {
            await expect(szkoleniaDlaNauczycieliPage.adres).toBeVisible()
            const expectedMessage = await szkoleniaDlaNauczycieliPage.adres.innerText()
            expect(expectedMessage).toContain(akademiaTestData.adresWStopce)
        })

        test('Przejście na politykę prywatności', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaPolitykePrywatnosci()

            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/polityka-prywatnosci/)
            await expect(
                szkoleniaDlaNauczycieliPage.page.getByRole('heading', {
                    name: 'Polityka Prywatności',
                    level: 1,
                })
            ).toBeVisible()
        })

        test('Przejście na regulamin szkoleń', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaRegulaminSzkolen()

            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/regulamin/)
            await expect(
                szkoleniaDlaNauczycieliPage.page.getByRole('heading', {
                    name: 'Regulaminy',
                    level: 1,
                })
            ).toBeVisible()
        })

        test('Przejście na stronę GWO', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaGwo()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/https:\/\/gwo\.pl\/?/)
        })

        test('Przejście na facebook', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaFacebook()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/https:\/\/pl-pl\.facebook\.com\/GdanskieWydawnictwoOswiatowe\/?/)
        })
    })

    test.describe('Proces zamówienia', () => {
        test.beforeEach(async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
        })

        test('Zamówienie bez logowania', async ({ szkoleniaDlaNauczycieliPage }) => {
            const mojeDane = generateTestData()
            await szkoleniaDlaNauczycieliPage.przejdzPrzezProcesZamowieniaBezLogowania(mojeDane)

            await assertSuccessPage(szkoleniaDlaNauczycieliPage.page)
        })

        test('Zamówienie z zalogowaniem', async ({ szkoleniaDlaNauczycieliPage }) => {
            const mojeDane: DaneZamowieniaZLogowaniem = {
                phone: '123456789',
                name: 'Jan',
                surname: 'Testowy',
                address: 'Testowa',
                number: '12',
                postalCode: '12-123',
                city: 'Testowo',
            }

            await szkoleniaDlaNauczycieliPage.przejdzPrzezProcesZamowieniaZLogowaniem(mojeDane)

            await assertSuccessPage(szkoleniaDlaNauczycieliPage.page)
        })
    })

    test.describe('Proces zamówienia - walidacja', () => {
        test('Próba kontynuacji z pustym koszykiem', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.kliknijKoszyk()
            await expect(szkoleniaDlaNauczycieliPage.nextButton).not.toBeVisible()
            await szkoleniaDlaNauczycieliPage.wrocNaListeSzkolen()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
        })

        test.describe('Testy wymagające szkolenia w koszyku', () => {
            test.beforeEach(async ({ szkoleniaDlaNauczycieliPage }) => {
                await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
                await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            })

            test('Walidacja odbiorcy faktury', async ({ szkoleniaDlaNauczycieliPage }) => {
                const errorAlert = await szkoleniaDlaNauczycieliPage.szkolenieBezOdbiorcyFaktury()
                await expect(errorAlert).toBeVisible()
                await expect(errorAlert).toContainText('Wybierz, na kogo ma być złożone zamówienie.')
                await expect(errorAlert.locator('img[alt="error"]')).toBeVisible()
                await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/dane-zamowienia/)
            })

            test('Usunięcie szkolenia z koszyka', async ({ szkoleniaDlaNauczycieliPage }) => {
                await szkoleniaDlaNauczycieliPage.usuniecieSzkoleniaZKoszyka()

                await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
            })

            test('Walidacja pustego formularza', async ({ szkoleniaDlaNauczycieliPage }) => {
                const oczekiwaneKomunikaty = [
                    'Wpisz poprawny e-mail.',
                    'Wpisz poprawny numer telefonu.',
                    'Wpisz imię.',
                    'Wpisz nazwisko.',
                    'Wpisz nazwę ulicy.',
                    'Wpisz numer.',
                    'Wpisz kod pocztowy.',
                    'Wpisz miejscowość.',
                ]

                await szkoleniaDlaNauczycieliPage.handleCartSelectionWithoutLogin()
                await szkoleniaDlaNauczycieliPage.zatwierdzFormularzZamowienia()

                for (const komunikat of oczekiwaneKomunikaty) {
                    await expect(
                        szkoleniaDlaNauczycieliPage.page.getByText(komunikat, { exact: true }),
                        `Błąd walidacji "${komunikat}" nie jest widoczny`
                    ).toBeVisible()
                }

                await expect(szkoleniaDlaNauczycieliPage.paymentErrorMessage, 'Błąd "Wybierz formę płatności." nie jest widoczny').toBeVisible()

                await expect(
                    szkoleniaDlaNauczycieliPage.validationErrors,
                    `Liczba błędów nie zgadza się. Oczekiwano ${oczekiwaneKomunikaty.length}`
                ).toHaveCount(oczekiwaneKomunikaty.length)

                await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/podsumowanie/)
            })

            test('Walidacja akceptacji regulaminów', async ({ szkoleniaDlaNauczycieliPage }) => {
                const mojeDane = generateTestData()

                await szkoleniaDlaNauczycieliPage.handleCartSelectionWithoutLogin()
                await szkoleniaDlaNauczycieliPage.fillOrderDetails(mojeDane, true)
                await szkoleniaDlaNauczycieliPage.page.waitForURL(/podsumowanie/)
                await szkoleniaDlaNauczycieliPage.orderAndPaymentButton.click()
                await szkoleniaDlaNauczycieliPage.regulationsErrorFrame.first().waitFor({ state: 'visible', timeout: 7500 })
                await expect(szkoleniaDlaNauczycieliPage.regulationsErrorFrame, 'Oczekiwano dwóch kontenerów regulaminów z ramką błędu').toHaveCount(2)

                await expect(
                    szkoleniaDlaNauczycieliPage.regulationsErrorAlert,
                    'Nie pojawił się komunikat "Zaakceptuj regulaminy. Wyraź wymagane zgody."'
                ).toBeVisible()

                await expect(szkoleniaDlaNauczycieliPage.page).not.toHaveURL(/sukces/)
            })
        })
    })
})
