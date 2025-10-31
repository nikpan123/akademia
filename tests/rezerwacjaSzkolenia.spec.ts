import { test, expect } from '../fixtures/akademiaFixtures'
import { RezerwacjaSzkoleniaPage } from '../pages/RezerwacjaSzkoleniaPage'
import { rezerwacjaTestData } from '../testData/rezerwacja.data'

test.describe('Rezerwacja szkolenia dla rad pedagogicznych', () => {
    test.beforeEach(async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.otworzStrone(rezerwacjaTestData.urlSzkolenia)
    })

    test('Rezerwacja - podstawowe dane', async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
            miejscowosc: 'Warszawa',
            data: rezerwacjaTestData.generateFutureDate(30),
            godzina: '14:00',
            liczbaOsob: 25,
        })

        await expect(rezerwacjaSzkoleniaPage.page).toHaveURL(/rezerwacja/)
    })

    test('Rezerwacja - z uwagami', async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.wypelnijFormularzRezerwacji({
            miejscowosc: 'Gdańsk',
            data: '2025-12-01',
            godzina: '10:30',
            liczbaOsob: 30,
            uwagi: 'Proszę o salę z klimatyzacją',
        })

        const licznikZnakow = await rezerwacjaSzkoleniaPage.pobierzLicznikZnakow()
        expect(parseInt(licznikZnakow)).toBeGreaterThan(0)

        await rezerwacjaSzkoleniaPage.kliknijRezerwuje()
    })

    test('Weryfikacja Tom Select - miejscowość', async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.wybierzMiejscowosc('Kraków')

        // Sprawdź czy wybrano
        const isSelected = await rezerwacjaSzkoleniaPage.sprawdzCzyMiejscowoscWybrana()
        expect(isSelected).toBe(true)

        // Sprawdź wizualnie
        const selectedText = await rezerwacjaSzkoleniaPage.page.locator('.ts-control .item').textContent()
        expect(selectedText).toContain('Kraków')
    })

    test('Walidacja - puste pola', async ({ rezerwacjaSzkoleniaPage }) => {
        const oczekiwaneKomunikaty = ['Wybierz miejscowość', 'Wybierz datę', 'Wybierz godzinę', 'Wpisz liczbę osób']

        // Kliknij bez wypełniania
        await rezerwacjaSzkoleniaPage.kliknijRezerwuje()

        for (const komunikat of oczekiwaneKomunikaty) {
            await expect(rezerwacjaSzkoleniaPage.page.getByText(komunikat, { exact: true }), `Błąd walidacji "${komunikat}" nie jest widoczny`).toBeVisible()
        }

        await expect(rezerwacjaSzkoleniaPage.validationErrors, `Liczba błędów nie zgadza się. Oczekiwano ${oczekiwaneKomunikaty.length}`).toHaveCount(
            oczekiwaneKomunikaty.length
        )
    })

    test('Rozwinięcie sekcji uwagi', async ({ rezerwacjaSzkoleniaPage }) => {
        // Na starcie textarea powinna być ukryta
        await expect(rezerwacjaSzkoleniaPage.messageArea).toHaveClass(/hidden/)

        await rezerwacjaSzkoleniaPage.commentCheckbox.check()

        // Textarea powinna się pojawić
        await expect(rezerwacjaSzkoleniaPage.messageArea).not.toHaveClass(/hidden/)
        await expect(rezerwacjaSzkoleniaPage.messageTextarea).toBeVisible()
    })

    test('Licznik znaków w uwagach', async ({ rezerwacjaSzkoleniaPage }) => {
        await rezerwacjaSzkoleniaPage.commentCheckbox.check()
        await rezerwacjaSzkoleniaPage.messageArea.waitFor({ state: 'visible' })

        const testText = 'Test'
        await rezerwacjaSzkoleniaPage.messageTextarea.fill(testText)

        const count = await rezerwacjaSzkoleniaPage.pobierzLicznikZnakow()
        expect(count).toBe(testText.length.toString())
    })

    test('Próba wybrania przeszłej daty', async ({ rezerwacjaSzkoleniaPage }) => {
        const oczekiwanyKomunikat = 'Data szkolenia nie może być przeszła.'

        await rezerwacjaSzkoleniaPage.zarezerwujSzkolenie({
            miejscowosc: 'Warszawa',
            data: rezerwacjaTestData.generatePastDate(30),
            godzina: '14:00',
            liczbaOsob: 25,
        })

        await expect(
            rezerwacjaSzkoleniaPage.page.getByText(oczekiwanyKomunikat, { exact: true }),
            `Błąd walidacji "${oczekiwanyKomunikat}" nie jest widoczny`
        ).toBeVisible()
    })
})
