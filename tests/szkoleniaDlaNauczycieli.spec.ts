import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData, DaneZamowieniaBezLogowania, DaneZamowieniaZLogowaniem } from '../testData/akademia.data'

const TEST_CONFIG = {
    MAX_RETRIES: 3,
    TIMEOUT: 10000,
    WAIT_FOR_ANIMATION: 300,
}

const generateTestData = (): DaneZamowieniaBezLogowania => ({
    email: `test.${Date.now()}.${Math.random().toString(36).substring(7)}@test.pl`,
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
            await szkoleniaDlaNauczycieliPage.szkoleniaButton.first().waitFor({
                state: 'visible',
                timeout: 10000,
            })

            const nazwaSzkolenia = await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            expect(nazwaSzkolenia).not.toBe('')
            expect(nazwaSzkolenia.length).toBeGreaterThan(3)
            await szkoleniaDlaNauczycieliPage.page.waitForLoadState('networkidle')
            const h1 = szkoleniaDlaNauczycieliPage.page.locator('h1')
            await h1.waitFor({ state: 'visible', timeout: 5000 })
            const h1Text = await h1.textContent()
            expect(h1Text).toContain(nazwaSzkolenia)
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

    test.describe('Proces zamówienia z retry mechanism', () => {
        test.beforeEach(async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.otworzSzkoleniaDlaNauczycieli()
            await expect(szkoleniaDlaNauczycieliPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
        })

        test('Zamówienie bez logowania - stabilna wersja', async ({ szkoleniaDlaNauczycieliPage }) => {
            let nazwaSzkolenia = ''
            for (let attempt = 0; attempt < TEST_CONFIG.MAX_RETRIES; attempt++) {
                try {
                    nazwaSzkolenia = await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
                    if (nazwaSzkolenia) break
                } catch (error) {
                    if (attempt === TEST_CONFIG.MAX_RETRIES - 1) throw error
                    await szkoleniaDlaNauczycieliPage.page.reload()
                }
            }

            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()

            const mojeDane = generateTestData()
            await szkoleniaDlaNauczycieliPage.przejdzPrzezProcesZamowieniaBezLogowania(mojeDane)

            await assertSuccessPage(szkoleniaDlaNauczycieliPage.page)
        })
    })

    test.describe('Edge cases i scenariusze graniczne', () => {
        test('Próba dodania szkolenia bez dostępnych terminów', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()

            const liczbaTerminow = await szkoleniaDlaNauczycieliPage.radioButton.count()

            if (liczbaTerminow === 0) {
                await expect(szkoleniaDlaNauczycieliPage.orderButton).toBeDisabled()
                // Lub oczekuj komunikatu o braku terminów
                await expect(szkoleniaDlaNauczycieliPage.page.locator('text=Brak dostępnych terminów')).toBeVisible()
            }
        })

        test('Walidacja formatu kodu pocztowego', async ({ szkoleniaDlaNauczycieliPage }) => {
            await szkoleniaDlaNauczycieliPage.przejdzNaSzczegolySzkolenia()
            await szkoleniaDlaNauczycieliPage.dodajSzkolenieDoKoszyka()
            await szkoleniaDlaNauczycieliPage.handleCartSelectionWithoutLogin()

            // Test nieprawidłowych formatów
            const invalidPostalCodes = ['123', '12345', 'AB-CDE', '12-12a']

            for (const postalCode of invalidPostalCodes) {
                await szkoleniaDlaNauczycieliPage.page.fill('#cart_address_billingAddress_postcode', postalCode)
                await szkoleniaDlaNauczycieliPage.nextButton.click()

                await expect(szkoleniaDlaNauczycieliPage.page.locator('text=Wpisany kod pocztowy nie jest prawidłowy.')).toBeVisible()
            }
        })
    })
})
