import { test, expect } from '../fixtures/akademiaFixtures'
import { KontaktPage } from '../pages/KontaktPage'

test.describe('Formularz Kontaktowy', () => {
    test.beforeEach(async ({ kontaktPage }) => {
        await kontaktPage.otworzKontakt()
    })

    test('wypełnij i wyślij formularz kontaktowy - test pozytywny', async ({ page }) => {
        const formularz = new KontaktPage(page)

        const dane = {
            imieNazwisko: 'Jan Kowalski',
            powiat: 'Warszawa',
            email: 'jan.kowalski@example.com',
            telefon: '123456789',
            poziomNauczania: 'primary-school',
            funkcjaWSzkole: 'director',
            typSzkolenia: 'paid-course',
            temat: 'Pytanie o szkolenie',
            tresc: 'Chciałbym dowiedzieć się więcej o dostępnych szkoleniach dla nauczycieli.',
        }

        await formularz.wypelnijFormularzKontaktowy(dane)

        expect(await formularz.sprawdzCzyPowiatWybrany()).toBeTruthy()
        const licznik = await formularz.pobierzLicznikZnakow()
        expect(licznik).toContain('73')

        await formularz.wyslijFormularz()
        await expect(page).toHaveURL(/potwierdzenie/)

        await expect(formularz.successMessage).toBeVisible()
        expect(await formularz.pobierzTekstKomunikatuSukcesu()).toContain('Dziękujemy za wysłanie wiadomości.')

        await expect(formularz.successContactMessage).toBeVisible()
        expect(await formularz.pobierzTekstKomunikatuKontaktowego()).toContain('Wkrótce skontaktujemy się z Tobą poprzez podany adres e-mail.')

        await expect(formularz.returnToHomeLink).toBeVisible()
        expect(await formularz.returnToHomeLink.getAttribute('href')).toBe('/')

        await formularz.kliknijPowrotDoStronyGlownej()
        await expect(page).toHaveURL(/\/$/)
        expect(await formularz.sprawdzCzyPrzekierowanoNaStroneGlowna()).toBeTruthy()
    })

    test('wypełnij formularz z opcjonalnymi polami - test częściowy', async ({ page }) => {
        const formularz = new KontaktPage(page)

        const daneCzesciowe = {
            imieNazwisko: 'Anna Nowak',
            powiat: 'Kraków',
            email: 'anna.nowak@example.com',
            // telefon pominięty
            poziomNauczania: 'high-school',
            // funkcjaWSzkole pominięta
            typSzkolenia: 'e-learning',
            temat: 'Zapytanie o kurs online',
            tresc: 'Krótka wiadomość testowa.',
            zaznaczKontaktTelefonczny: true,
        }

        await formularz.wypelnijFormularzKontaktowy(daneCzesciowe)

        await expect(formularz.phoneInput).toHaveValue('')
        await expect(formularz.schoolFunctionSelect).toHaveValue('')

        await expect(formularz.emailInput).toHaveValue(daneCzesciowe.email)
        await expect(formularz.messageTextarea).toHaveValue(daneCzesciowe.tresc)

        // Nie wysyłamy, tylko sprawdzamy
    })

    test('weryfikacja błędu - brak wypełnienia wymaganych pól', async ({ page }) => {
        const formularz = new KontaktPage(page)

        await formularz.wyslijFormularz()

        await expect(formularz.errorAlert).toBeVisible()
    })
})
