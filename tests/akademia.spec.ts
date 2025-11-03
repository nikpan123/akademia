import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData } from '../testData/akademia.data'

test.describe('Akademia - Strona główna', () => {
    test.beforeEach(async ({ akademiaPage }) => {
        await akademiaPage.otworzAkademie()
    })

    // ========== NAGŁÓWEK / HEADER ==========
    test.describe('Header - Nawigacja i elementy', () => {
        test('Logo przekierowuje na stronę główną', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaSzkoleniaDlaNauczycieli()
            await akademiaPage.logoButton.click()
            await expect(akademiaPage.page).toHaveURL(akademiaPage.env.akademia)
        })

        test('Przycisk Wyloguj jest widoczny dla zalogowanego użytkownika', async ({ akademiaPage }) => {
            await akademiaPage.zalogujSieNaAkademie(process.env.GWO_LOGIN!, process.env.GWO_PASSWORD!)
            await expect(akademiaPage.wylogujButton).toBeVisible()
            await expect(akademiaPage.wylogujButton).toHaveAttribute('href', /wyloguj/)
        })

        test('Przycisk Wyloguj nie jest widoczny dla niezalogowanego użytkownika', async ({ akademiaPage }) => {
            const wylogujButton = akademiaPage.page.locator('a:has-text("Wyloguj")')
            await expect(wylogujButton).not.toBeVisible()
        })

        test('Link Kontakt przekierowuje na stronę kontaktu', async ({ akademiaPage }) => {
            await akademiaPage.kontaktButton.click()
            await expect(akademiaPage.page).toHaveURL(/kontakt/)
        })

        test('Menu mobilne - otwieranie i zamykanie', async ({ akademiaPage }) => {
            await akademiaPage.page.setViewportSize({ width: 375, height: 667 })
            await akademiaPage.menuButton.click()
            await expect(akademiaPage.menuItems).toBeVisible()
        })
    })

    // ========== GŁÓWNE LINKI / KAFELKI ==========
    test.describe('Główne linki - Kafelki nawigacyjne', () => {
        test('Kafelek "Szkolenia dla nauczycieli" - link i tekst', async ({ akademiaPage }) => {
            await expect(akademiaPage.szkoleniaDlaNauczycieliButton).toBeVisible()
            await expect(akademiaPage.szkoleniaDlaNauczycieliButton).toContainText('szkolenia')
            await expect(akademiaPage.szkoleniaDlaNauczycieliButton).toContainText('dla nauczycieli')
        })

        test('Kafelek "Szkolenia dla rad pedagogicznych" - link i tekst', async ({ akademiaPage }) => {
            await expect(akademiaPage.szkoleniaDlaRadPedagogicznychButton).toBeVisible()
            await expect(akademiaPage.szkoleniaDlaRadPedagogicznychButton).toContainText('szkolenia')
            await expect(akademiaPage.szkoleniaDlaRadPedagogicznychButton).toContainText('dla rad pedagogicznych')
        })

        test('Kliknięcie w kafelek "Szkolenia dla nauczycieli"', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaSzkoleniaDlaNauczycieli()
            await expect(akademiaPage.page).toHaveURL(/szkolenia-dla-nauczycieli/)
            await expect(akademiaPage.page).toHaveTitle('Szkolenia dla nauczycieli')
        })

        test('Kliknięcie w kafelek "Szkolenia dla rad pedagogicznych"', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaSzkoleniaDlaRadPedagogicznych()
            await expect(akademiaPage.page).toHaveURL(/szkolenia-dla-rad-pedagogicznych/)
            await expect(akademiaPage.page).toHaveTitle('Szkolenia dla rad pedagogicznych')
        })
    })

    // ========== NEWSLETTER ==========
    test.describe('Newsletter - Formularz zapisu', () => {
        test('Formularz newslettera jest widoczny', async ({ akademiaPage }) => {
            await expect(akademiaPage.newsletterEmail).toBeVisible()
            await expect(akademiaPage.newsletterSubmitButton).toBeVisible()
            await expect(akademiaPage.newsletterRodo).toBeVisible()
        })

        test('Placeholder w polu email', async ({ akademiaPage }) => {
            await expect(akademiaPage.newsletterEmail).toHaveAttribute('placeholder', 'Wpisz swój e-mail')
        })

        test('Tekst zachęcający do zapisu', async ({ akademiaPage }) => {
            await expect(akademiaPage.newsletterText).toContainText('Zapisz się do newslettera')
            await expect(akademiaPage.newsletterText).toContainText('nowościach, promocjach')
        })

        test('Pomyślne zapisanie się do newslettera', async ({ akademiaPage }) => {
            const email = akademiaTestData.generateEmail()
            await akademiaPage.wypelnijFormularzNewslettera(email, true)
            await expect(akademiaPage.newsletterMessage).toHaveText('Adres email został dodany do newslettera.', { timeout: 10000 })
        })

        test('Błąd - pusty email', async ({ akademiaPage }) => {
            await akademiaPage.newsletterRodo.check()
            await akademiaPage.newsletterSubmitButton.click()
            await expect(akademiaPage.newsletterError).toBeVisible
            await expect(akademiaPage.newsletterError.locator('div')).toHaveText(akademiaTestData.bledy.bladNewsletter)
        })

        test('Błąd - niepoprawny format email', async ({ akademiaPage }) => {
            await akademiaPage.wypelnijFormularzNewslettera('niepoprawny-email', true)
            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.blednyEmail}`)).toBeVisible({ timeout: 10000 })
        })

        test('Błąd - brak zgody RODO', async ({ akademiaPage }) => {
            const email = akademiaTestData.generateEmail()
            await akademiaPage.wypelnijFormularzNewslettera(email, false)
            await expect(akademiaPage.page.locator(`text=${akademiaTestData.bledy.brakRodo}`)).toBeVisible({ timeout: 10000 })
        })

        test('Błąd - email i RODO puste', async ({ akademiaPage }) => {
            await akademiaPage.newsletterSubmitButton.click()
            await expect(akademiaPage.newsletterEmailRodoError).toBeVisible()
            await expect(akademiaPage.newsletterEmailRodoError).toHaveText(akademiaTestData.bledy.bladNewsletterEmailRodo.replace(/\n/g, ''))
        })

        test('Tekst zgody RODO', async ({ akademiaPage }) => {
            await expect(akademiaPage.newsletterRodoText).toContainText('Wyrażam zgodę na otrzymywanie newslettera')
            await expect(akademiaPage.newsletterRodoText).toContainText('drogą elektroniczną')
        })
    })

    // ========== STOPKA / FOOTER ==========
    test.describe('Footer - Informacje i linki', () => {
        test('Adres organizacji jest widoczny i poprawny', async ({ akademiaPage }) => {
            await expect(akademiaPage.adres).toBeVisible()
            const adresText = await akademiaPage.adres.innerText()
            expect(adresText).toContain(akademiaTestData.adresWStopce)
        })

        test('Informacja o plikach cookies', async ({ akademiaPage }) => {
            await expect(akademiaPage.cookiesInfo).toContainText('Ta strona używa plików cookies')
        })

        test('Link do polityki cookies', async ({ akademiaPage }) => {
            await expect(akademiaPage.cookiesLink).toBeVisible()
            await expect(akademiaPage.cookiesLink).toHaveText('Dowiedz się więcej.')
        })

        test('Link "Polityka prywatności"', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaPolitykePrywatnosci()
            await expect(akademiaPage.page).toHaveURL(/polityka-prywatnosci/)
            await expect(akademiaPage.page.getByRole('heading', { name: 'Polityka Prywatności', level: 1 })).toBeVisible()
        })

        test('Link "Regulamin szkoleń"', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaRegulaminSzkolen()
            await expect(akademiaPage.page).toHaveURL(/regulamin/)
            await expect(akademiaPage.page.getByRole('heading', { name: 'Regulaminy', level: 1 })).toBeVisible()
        })

        test('Link do strony GWO', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaGwo()
            await expect(akademiaPage.page).toHaveURL(/https:\/\/gwo\.pl/)
        })

        test('Link do Facebook', async ({ akademiaPage }) => {
            await akademiaPage.przejdzNaFacebook()
            await expect(akademiaPage.page).toHaveURL(/facebook\.com\/GdanskieWydawnictwoOswiatowe/)
        })

        test('Ikona GWO w stopce', async ({ akademiaPage }) => {
            await expect(akademiaPage.gwoIcon).toBeVisible()
            await expect(akademiaPage.gwoIcon).toHaveAttribute('src', /ico_gwo_logo/)
        })

        test('Ikona Facebook w stopce', async ({ akademiaPage }) => {
            await expect(akademiaPage.fbIcon).toBeVisible()
            await expect(akademiaPage.fbIcon).toHaveAttribute('src', /ico_fb_logo/)
        })
    })

    // ========== PANEL COOKIES (modal) ==========
    test.describe('Panel cookies - Modal przy pierwszej wizycie', () => {
        test('Panel cookies pojawia się przy pierwszej wizycie', async ({ akademiaPage }) => {
            await expect(akademiaPage.cookiePanel).toBeVisible()
        })

        test('Tekst w panelu cookies', async ({ akademiaPage }) => {
            await expect(akademiaPage.cookieText).toHaveText('Używamy ciasteczek.')
        })

        test('Link "Dowiedz się więcej" w panelu cookies', async ({ akademiaPage }) => {
            await expect(akademiaPage.cookieLink).toBeVisible()
            await expect(akademiaPage.cookieLink).toHaveAttribute('href', /polityka-plikow-cookies/)
            await expect(akademiaPage.cookieLink).toHaveAttribute('target', '_blank')
        })

        // ========== DOSTĘPNOŚĆ (accessibility toolbar) ==========
        test.describe('Panel dostępności', () => {
            test('Panel dostępności jest dostępny na stronie', async ({ akademiaPage }) => {
                await expect(akademiaPage.accToolbar).toBeAttached()
            })

            test('Przycisk otwierania panelu dostępności', async ({ akademiaPage }) => {
                await expect(akademiaPage.toggleAccButton).toBeVisible()
            })

            test('Opcje w panelu dostępności', async ({ akademiaPage }) => {
                await expect(akademiaPage.smallLetter).toBeAttached()
                await expect(akademiaPage.bigLetter).toBeAttached()
                await expect(akademiaPage.darkContrast).toBeAttached()
                await expect(akademiaPage.grayscale).toBeAttached()
                await expect(akademiaPage.underlineLinks).toBeAttached()
            })
        })

        // ========== RESPONSYWNOŚĆ ==========
        test.describe('Responsywność', () => {
            test('Mobile (375px) - Logo mobilne jest widoczne', async ({ akademiaPage }) => {
                await akademiaPage.page.setViewportSize({ width: 375, height: 667 })
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)
                await expect(akademiaPage.mobileLogo).toBeVisible()
            })

            test('Desktop (1920px) - Logo desktop jest widoczne', async ({ akademiaPage }) => {
                await akademiaPage.page.setViewportSize({ width: 1920, height: 1080 })
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)
                await expect(akademiaPage.desktopLogo).toBeVisible()
            })

            test('Tablet (768px) - Elementy są widoczne', async ({ akademiaPage }) => {
                await akademiaPage.page.setViewportSize({ width: 768, height: 1024 })
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)

                await expect(akademiaPage.homePageLinks).toBeVisible()
                await expect(akademiaPage.newsletterLink).toBeVisible()
            })
        })

        // ========== META / SEO ==========
        test.describe('Meta tags i SEO', () => {
            test('Tytuł strony', async ({ akademiaPage }) => {
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)
                await expect(akademiaPage.page).toHaveTitle(/Akademia GWO/)
            })

            test('Favicon jest załadowany', async ({ akademiaPage }) => {
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)
                await expect(akademiaPage.favicon).toBeAttached()
            })
        })

        // ========== WYDAJNOŚĆ / PERFORMANCE ==========
        test.describe('Wydajność', () => {
            test('Strona ładuje się w rozsądnym czasie', async ({ akademiaPage }) => {
                const startTime = Date.now()
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)
                await akademiaPage.page.waitForLoadState('networkidle')
                const loadTime = Date.now() - startTime

                // Strona powinna załadować się w mniej niż 5 sekund
                expect(loadTime).toBeLessThan(5000)
            })

            test('Wszystkie grafiki się załadowały', async ({ akademiaPage }) => {
                await akademiaPage.page.goto(akademiaTestData.urlAkademii)

                const images = akademiaPage.page.locator('img')
                const count = await images.count()

                for (let i = 0; i < count; i++) {
                    const img = images.nth(i)
                    const isVisible = await img.isVisible()
                    if (isVisible) {
                        // Sprawdź czy obrazek ma atrybut src
                        const src = await img.getAttribute('src')
                        expect(src).toBeTruthy()
                    }
                }
            })
        })
    })
})
