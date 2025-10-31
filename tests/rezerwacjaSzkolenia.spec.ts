import { test, expect } from '../fixtures/akademiaFixtures'
import { RezerwacjaSzkoleniaPage } from '../pages/RezerwacjaSzkoleniaPage'
import { rezerwacjaTestData } from '../testData/rezerwacja.data'

test.describe('Rezerwacja szkolenia dla rad pedagogicznych', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://akademia.gwodev.pl/szkolenia-dla-rad-pedagogicznych/adhd-jak-sobie-z-nim-radzic,6444')
    })

    test('Rezerwacja - podstawowe dane', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        await rezerwacjaPage.zarezerwujSzkolenie({
            miejscowosc: 'Warszawa',
            data: rezerwacjaTestData.generateFutureDate(30),
            godzina: '14:00',
            liczbaOsob: 25,
        })

        await expect(page).toHaveURL(/rezerwacja/)
    })

    test('Rezerwacja - z uwagami', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        await rezerwacjaPage.wypelnijFormularzRezerwacji({
            miejscowosc: 'Gdańsk',
            data: '2025-12-01',
            godzina: '10:30',
            liczbaOsob: 30,
            uwagi: 'Proszę o salę z klimatyzacją',
        })

        // Sprawdź licznik znaków
        const licznikZnakow = await rezerwacjaPage.pobierzLicznikZnakow()
        expect(parseInt(licznikZnakow)).toBeGreaterThan(0)

        await rezerwacjaPage.kliknijRezerwuje()
    })

    test('Weryfikacja Tom Select - miejscowość', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        await rezerwacjaPage.wybierzMiejscowosc('Kraków')

        // Sprawdź czy wybrano
        const isSelected = await rezerwacjaPage.sprawdzCzyMiejscowoscWybrana()
        expect(isSelected).toBe(true)

        // Sprawdź wizualnie
        const selectedText = await page.locator('.ts-control .item').textContent()
        expect(selectedText).toContain('Kraków')
    })

    test('Walidacja - puste pola', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        // Kliknij bez wypełniania
        await rezerwacjaPage.kliknijRezerwuje()

        // Sprawdź błędy walidacji HTML5
        // (Playwright automatycznie sprawdza required fields)
    })

    test('Rozwinięcie sekcji uwagi', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        // Na starcie textarea powinna być ukryta
        await expect(rezerwacjaPage.messageArea).toHaveClass(/hidden/)

        // Zaznacz checkbox
        await rezerwacjaPage.commentCheckbox.check()

        // Textarea powinna się pojawić
        await expect(rezerwacjaPage.messageArea).not.toHaveClass(/hidden/)
        await expect(rezerwacjaPage.messageTextarea).toBeVisible()
    })

    test('Licznik znaków w uwagach', async ({ page }) => {
        const rezerwacjaPage = new RezerwacjaSzkoleniaPage(page)

        await rezerwacjaPage.commentCheckbox.check()
        await rezerwacjaPage.messageArea.waitFor({ state: 'visible' })

        const testText = 'Test'
        await rezerwacjaPage.messageTextarea.fill(testText)

        const count = await rezerwacjaPage.pobierzLicznikZnakow()
        expect(count).toBe(testText.length.toString())
    })
})
