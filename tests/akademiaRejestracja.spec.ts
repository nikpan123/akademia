import { test, expect } from '../fixtures/akademiaFixtures'
import { generateRandomEmail, generateSecurePassword } from '../utils/generators'
import { AkademiaRegistrationPage } from '../pages/AkademiaRegistrationPage'

test.describe('Akademia - rejestracja', () => {
    test.beforeEach(async ({ akademiaLoginPage }) => {
        await akademiaLoginPage.otworzAkademie()
    })

    // Pozytywne scenariusze: Pętla nad rolami
    const role = [
        { name: 'nauczyciel', method: (page: AkademiaRegistrationPage, login: string, password: string) => page.zarejestrujJakoNauczyciel(login, password) },
        { name: 'uczeń', method: (page: AkademiaRegistrationPage, login: string, password: string) => page.zarejestrujJakoUczeń(login, password) },
        { name: 'inny', method: (page: AkademiaRegistrationPage, login: string, password: string) => page.zarejestrujJakoInny(login, password) },
        { name: 'dyrektor', method: (page: AkademiaRegistrationPage, login: string, password: string) => page.zarejestrujJakoDyrektor(login, password) },
        { name: 'rodzic', method: (page: AkademiaRegistrationPage, login: string, password: string) => page.zarejestrujJakoRodzic(login, password) },
    ]

    role.forEach(({ name, method }) => {
        test(`Rejestracja jako ${name}`, async ({ akademiaRegistrationPage }) => {
            const randomLogin = generateRandomEmail()
            const randomPassword = generateSecurePassword(10)
            await method(akademiaRegistrationPage, randomLogin, randomPassword)

            // Wspólna asercja sukcesu
            const expectedMessage = `Konto zostało utworzone. Przeczytaj wiadomość z linkiem aktywacyjnym, która została wysłana pod adresem: ${randomLogin}`
            await expect(akademiaRegistrationPage.registrationSuccessMessage).toHaveText(expectedMessage, { timeout: 10000 })
        })
    })

    // Negatywne scenariusze: Pętla nad danymi testowymi
    const negativeScenarios = [
        { name: 'bez loginu', expected: 'To pole jest wymagane.' },
        { name: 'bez hasła', expected: 'To pole jest wymagane.' },
        {
            name: 'bez funkcji',
            expected: 'Wymagane jest określenie co najmniej jednej funkcji.',
        },
        { name: 'bez regulaminu', expected: 'To pole jest wymagane.' },
        {
            name: 'nauczyciel bez przedmiotu',
            expected: 'Wybór przedmiotu jest wymagany.',
        },
        {
            name: 'nauczyciel bez poziomu',
            expected: 'Określenie poziomu jest wymagane.',
        },
        {
            name: 'dyrektor bez poziomu',
            expected: 'Określenie poziomu jest wymagane.',
        },
    ]

    negativeScenarios.forEach(({ name, expected }) => {
        test(`Rejestracja ${name} - błąd walidacji`, async ({ akademiaRegistrationPage }) => {
            const randomLogin = generateRandomEmail()
            const randomPassword = generateSecurePassword(10)

            switch (name) {
                case 'bez loginu':
                    await akademiaRegistrationPage.zarejestrujBezLoginu(randomPassword)
                    break
                case 'bez hasła':
                    await akademiaRegistrationPage.zarejestrujBezHasla(randomLogin)
                    break
                case 'bez funkcji':
                    await akademiaRegistrationPage.zarejestrujBezFunkcji(randomLogin, randomPassword)
                    break
                case 'bez regulaminu':
                    await akademiaRegistrationPage.zarejestrujBezRegulaminu(randomLogin, randomPassword)
                    break
                case 'nauczyciel bez przedmiotu':
                    await akademiaRegistrationPage.zarejestrujJakoNauczycielBezPrzedmiotu(randomLogin, randomPassword)
                    break
                case 'nauczyciel bez poziomu':
                    await akademiaRegistrationPage.zarejestrujJakoNauczycielBezPoziomu(randomLogin, randomPassword)
                    break
                case 'dyrektor bez poziomu':
                    await akademiaRegistrationPage.zarejestrujJakoDyrektorBezPoziomu(randomLogin, randomPassword)
                    break
                default:
                    throw new Error(`Nieznany scenariusz: ${name}`)
            }

            // Wspólna asercja błędu
            await expect(akademiaRegistrationPage.registrationFailMessage).toHaveText(expected, { timeout: 10000 })
        })
    })
})
