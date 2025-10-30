import { test, expect } from '../fixtures/akademiaFixtures'
import { AkademiaPage } from '../pages/AkademiaPage'
import { akademiaTestData } from '../testData/akademia.data'

test.describe('Akademia', () => {
    test.beforeEach(async ({ akademiaPage }) => {
        await akademiaPage.otworzAkademie()
    })

    test.describe('Nawigacja - Główne sekcje', () => {
        const navigationTests = [
            {
                name: 'Szkolenia dla nauczycieli',
                method: (p: AkademiaPage) => p.przejdzNaSzkoleniaDlaNauczycieli(),
                url: /szkolenia-dla-nauczycieli/,
                title: 'Szkolenia dla nauczycieli',
            },
            {
                name: 'Szkolenia dla rad pedagogicznych',
                method: (p: AkademiaPage) => p.przejdzNaSzkoleniaDlaRadPedagogicznych(),
                url: /szkolenia-dla-rad-pedagogicznych/,
                title: 'Szkolenia dla rad pedagogicznych',
            },
        ]

        for (const navTest of navigationTests) {
            test(navTest.name, async ({ akademiaPage }) => {
                await navTest.method(akademiaPage)
                await expect(akademiaPage.page).toHaveURL(navTest.url)
                await expect(akademiaPage.page).toHaveTitle(navTest.title)
            })
        }

        test('O Akademii - weryfikacja treści i pobieranie PDF', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaOAkademii()

            // Weryfikacja nagłówka i treści
            await expect(akademiaPage.oAkademiiHeading).toBeVisible()
            const tekstStrony = await akademiaPage.oAkademiiTekst.innerText()
            expect(tekstStrony).toContain(akademiaTestData.oAkademiiTekst)

            // Weryfikacja pobierania PDF
            await expect(akademiaPage.pobierzButton).toBeVisible()
            await akademiaPage.pobierzButton.click()
            expect(akademiaPage.page.url()).toContain('.pdf')
        })
    })

    test.describe('Newsletter - Zapisanie się', () => {
        test('Pomyślne dodanie emaila', async ({ akademiaPage }) => {
            const email = akademiaTestData.generateEmail()
            await akademiaPage.wypelnijFormularzNewslettera(email, true)

            await expect(akademiaPage.newsletterMessage).toHaveText('Adres email został dodany do newslettera.', { timeout: 10000 })
        })

        test('Błąd walidacji - niepoprawny format email', async ({ akademiaPage }) => {
            const bladnyEmail = akademiaTestData.generateBadEmail()
            await akademiaPage.wypelnijFormularzNewslettera(bladnyEmail, true)

            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.blednyEmail}`)).toBeVisible({ timeout: 10000 })
        })

        test('Błąd walidacji - brak zgody RODO', async ({ akademiaPage }) => {
            const email = akademiaTestData.generateEmail()
            await akademiaPage.wypelnijFormularzNewslettera(email, false)

            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.brakRodo}`)).toBeVisible({ timeout: 10000 })
        })

        test('Błąd walidacji - niepoprawny email oraz brak zgody RODO', async ({ akademiaPage }) => {
            const bladnyEmail = akademiaTestData.generateBadEmail()
            await akademiaPage.wypelnijFormularzNewslettera(bladnyEmail, false)

            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.blednyEmail}`)).toBeVisible({ timeout: 10000 })
            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.brakRodo}`)).toBeVisible({ timeout: 10000 })
        })
    })

    test.describe('Stopka - Informacje i linki', () => {
        test('Weryfikacja adresu organizacji', async ({ akademiaPage }) => {
            await expect(akademiaPage.adres).toBeVisible()

            const adresText = await akademiaPage.adres.innerText()
            expect(adresText).toContain(akademiaTestData.adresWStopce)
        })

        test('Link - Polityka prywatności', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaPolitykePrywatnosci()

            await expect(akademiaPage.page).toHaveURL(/polityka-prywatnosci/)
            await expect(
                akademiaPage.page.getByRole('heading', {
                    name: 'Polityka Prywatności',
                    level: 1,
                })
            ).toBeVisible()
        })

        test('Link - Regulamin szkoleń', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaRegulaminSzkolen()

            await expect(akademiaPage.page).toHaveURL(/regulamin/)
            await expect(
                akademiaPage.page.getByRole('heading', {
                    name: 'Regulaminy',
                    level: 1,
                })
            ).toBeVisible()
        })

        test.describe('Stopka - Linki zewnętrzne', () => {
            const externalLinks = [
                { name: 'GWO', method: (p: AkademiaPage) => p.przejdzNaGwo(), url: /gwo\.pl/ },
                { name: 'Facebook', method: (p: AkademiaPage) => p.przejdzNaFacebook(), url: /facebook\.com/ },
            ]

            for (const link of externalLinks) {
                test(link.name, async ({ akademiaPage }) => {
                    await link.method(akademiaPage)
                    await expect(akademiaPage.page).toHaveURL(link.url)
                })
            }
        })
    })
})
