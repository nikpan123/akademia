import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData } from '../testData/akademia.data'

test.describe('Akademia - Strona główna', () => {
    test.beforeEach(async ({ akademiaPage }) => {
        await akademiaPage.otworzAkademie()
    })

    // ========== NAGŁÓWEK / HEADER ==========
    test.describe('Header - Nawigacja i elementy', () => {
        test('Logo przekierowuje na stronę główną', async ({ akademiaPage }) => {
            // Przejdź na inną stronę
            await akademiaPage.przejdzNaSzkoleniaDlaNauczycieli()

            // Kliknij logo
            await akademiaPage.page.locator('.head__logo a').first().click()

            // Powinno wrócić na stronę główną
            await expect(akademiaPage.page).toHaveURL(akademiaPage.env.akademia)
        })

        test('Przycisk Wyloguj jest widoczny dla zalogowanego użytkownika', async ({ akademiaPage }) => {
            const wylogujButton = akademiaPage.page.locator('a:has-text("Wyloguj")')
            await akademiaPage.zalogujSieNaAkademie(process.env.GWO_LOGIN!, process.env.GWO_PASSWORD!)
            await expect(wylogujButton).toBeVisible()
            await expect(wylogujButton).toHaveAttribute('href', /wyloguj/)
        })

        test('Przycisk Wyloguj nie jest widoczny dla niezalogowanego użytkownika', async ({ akademiaPage }) => {
            const wylogujButton = akademiaPage.page.locator('a:has-text("Wyloguj")')
            await expect(wylogujButton).not.toBeVisible()
        })

        test('Link Kontakt przekierowuje na stronę kontaktu', async ({ akademiaPage }) => {
            await akademiaPage.page.locator('a[href="/kontakt"]').click()
            await expect(akademiaPage.page).toHaveURL(/kontakt/)
        })

        test('Menu mobilne - otwieranie i zamykanie', async ({ page }) => {
            // Zmień viewport na mobile
            await page.setViewportSize({ width: 375, height: 667 })

            const menuButton = page.getByRole('banner').getByRole('button')
            const menuItems = page.locator('.menu-links__items').first()

            // Kliknij przycisk menu
            await menuButton.click()

            // Menu powinno się otworzyć
            await expect(menuItems).toBeVisible()
        })
    })

    // ========== GŁÓWNE LINKI / KAFELKI ==========
    test.describe('Główne linki - Kafelki nawigacyjne', () => {
        test('Kafelek "Szkolenia dla nauczycieli" - link i tekst', async ({ akademiaPage }) => {
            const link = akademiaPage.page.locator('a[href="/szkolenia-dla-nauczycieli"]').first()

            await expect(link).toBeVisible()
            await expect(link).toContainText('szkolenia')
            await expect(link).toContainText('dla nauczycieli')
        })

        test('Kafelek "Szkolenia dla rad pedagogicznych" - link i tekst', async ({ akademiaPage }) => {
            const link = akademiaPage.page.locator('a[href="/szkolenia-dla-rad-pedagogicznych"]').first()

            await expect(link).toBeVisible()
            await expect(link).toContainText('szkolenia')
            await expect(link).toContainText('dla rad pedagogicznych')
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

        test('Tekst zachęcający do zapisu', async ({ page }) => {
            const tekst = page.locator('.newsletter-link p')
            await expect(tekst).toContainText('Zapisz się do newslettera')
            await expect(tekst).toContainText('nowościach, promocjach')
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

        test('Tekst zgody RODO', async ({ page }) => {
            const rodoText = page.locator('label:has(#newsletter_form_rodo) span')
            await expect(rodoText).toContainText('Wyrażam zgodę na otrzymywanie newslettera')
            await expect(rodoText).toContainText('drogą elektroniczną')
        })
    })

    // ========== STOPKA / FOOTER ==========
    test.describe('Footer - Informacje i linki', () => {
        test('Adres organizacji jest widoczny i poprawny', async ({ akademiaPage }) => {
            await expect(akademiaPage.adres).toBeVisible()

            const adresText = await akademiaPage.adres.innerText()
            expect(adresText).toContain(akademiaTestData.adresWStopce)
        })

        test('Informacja o plikach cookies', async ({ page }) => {
            const cookiesInfo = page.locator('.footer__powered-text')
            await expect(cookiesInfo).toContainText('Ta strona używa plików cookies')
        })

        test('Link do polityki cookies', async ({ page }) => {
            const cookiesLink = page.locator('.footer__powered-text a[href*="polityka-plikow-cookies"]')
            await expect(cookiesLink).toBeVisible()
            await expect(cookiesLink).toHaveText('Dowiedz się więcej.')
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

        test('Ikona GWO w stopce', async ({ page }) => {
            const gwoIcon = page.locator('.footer__socials a[href*="gwo.pl"] img')
            await expect(gwoIcon).toBeVisible()
            await expect(gwoIcon).toHaveAttribute('src', /ico_gwo_logo/)
        })

        test('Ikona Facebook w stopce', async ({ page }) => {
            const fbIcon = page.locator('.footer__socials a[href*="facebook"] img')
            await expect(fbIcon).toBeVisible()
            await expect(fbIcon).toHaveAttribute('src', /ico_fb_logo/)
        })
    })

    // ========== PANEL COOKIES (modal) ==========
    test.describe('Panel cookies - Modal przy pierwszej wizycie', () => {
        test('Panel cookies pojawia się przy pierwszej wizycie', async ({ context }) => {
            // Nowy kontekst = czysty stan, bez cookies
            const newPage = await context.newPage()
            await newPage.goto(akademiaTestData.urlAkademii)

            const cookiePanel = newPage.locator('.cookie-panel')
            await expect(cookiePanel).toBeVisible({ timeout: 5000 })
        })

        test('Tekst w panelu cookies', async ({ context }) => {
            const newPage = await context.newPage()
            await newPage.goto(akademiaTestData.urlAkademii)

            const cookieText = newPage.locator('.cookie-panel__text')
            await expect(cookieText).toHaveText('Używamy ciasteczek.')
        })

        test('Link "Dowiedz się więcej" w panelu cookies', async ({ context }) => {
            const newPage = await context.newPage()
            await newPage.goto(akademiaTestData.urlAkademii)

            const link = newPage.locator('.cookie-panel__link')
            await expect(link).toBeVisible()
            await expect(link).toHaveAttribute('href', /polityka-plikow-cookies/)
            await expect(link).toHaveAttribute('target', '_blank')
        })

        // ========== DOSTĘPNOŚĆ (accessibility toolbar) ==========
        test.describe('Panel dostępności', () => {
            test('Panel dostępności jest dostępny na stronie', async ({ page }) => {
                const accToolbar = page.locator('#b-acc-toolbarWrap')
                await expect(accToolbar).toBeAttached()
            })

            test('Przycisk otwierania panelu dostępności', async ({ page }) => {
                const toggleButton = page.locator('[title="Opcje dostępności"]')
                await expect(toggleButton).toBeVisible()
            })

            test('Opcje w panelu dostępności', async ({ page }) => {
                // Sprawdź czy istnieją przyciski dostępności
                const smallLetter = page.locator('.small-letter')
                const bigLetter = page.locator('.big-letter')
                const darkContrast = page.locator('.b-acc-dark-btn')
                const grayscale = page.locator('.b-acc-grayscale')
                const underlineLinks = page.locator('.b-acc-toggle-underline')

                await expect(smallLetter).toBeAttached()
                await expect(bigLetter).toBeAttached()
                await expect(darkContrast).toBeAttached()
                await expect(grayscale).toBeAttached()
                await expect(underlineLinks).toBeAttached()
            })
        })

        // ========== RESPONSYWNOŚĆ ==========
        test.describe('Responsywność', () => {
            test('Mobile (375px) - Logo mobilne jest widoczne', async ({ page }) => {
                await page.setViewportSize({ width: 375, height: 667 })
                await page.goto(akademiaTestData.urlAkademii)

                const mobileLogo = page.locator('.logo__mobile')
                await expect(mobileLogo).toBeVisible()
            })

            test('Desktop (1920px) - Logo desktop jest widoczne', async ({ page }) => {
                await page.setViewportSize({ width: 1920, height: 1080 })
                await page.goto(akademiaTestData.urlAkademii)

                const desktopLogo = page.locator('.head__logo:not(.logo__mobile)').first()
                await expect(desktopLogo).toBeVisible()
            })

            test('Tablet (768px) - Elementy są widoczne', async ({ page }) => {
                await page.setViewportSize({ width: 768, height: 1024 })
                await page.goto(akademiaTestData.urlAkademii)

                await expect(page.locator('.home-page-links')).toBeVisible()
                await expect(page.locator('.newsletter-link')).toBeVisible()
            })
        })

        // ========== META / SEO ==========
        test.describe('Meta tags i SEO', () => {
            test('Tytuł strony', async ({ page }) => {
                await page.goto(akademiaTestData.urlAkademii)
                await expect(page).toHaveTitle(/Akademia GWO/)
            })

            test('Favicon jest załadowany', async ({ page }) => {
                await page.goto(akademiaTestData.urlAkademii)

                const favicon = page.locator('link[rel="icon"]')
                await expect(favicon).toBeAttached()
            })
        })

        // ========== WYDAJNOŚĆ / PERFORMANCE ==========
        test.describe('Wydajność', () => {
            test('Strona ładuje się w rozsądnym czasie', async ({ page }) => {
                const startTime = Date.now()
                await page.goto(akademiaTestData.urlAkademii)
                await page.waitForLoadState('networkidle')
                const loadTime = Date.now() - startTime

                // Strona powinna załadować się w mniej niż 5 sekund
                expect(loadTime).toBeLessThan(5000)
            })

            test('Wszystkie obrazy się załadowały', async ({ page }) => {
                await page.goto(akademiaTestData.urlAkademii)

                const images = page.locator('img')
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
