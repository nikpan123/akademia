import { test, expect } from '../fixtures/akademiaFixtures'
import { generateRandomString } from '../utils/generators'

test.describe('Akademia - logowanie przez Moje GWO', () => {
    test.beforeEach(async ({ akademiaLoginPage }) => {
        await akademiaLoginPage.otworzAkademie()
    })

    test('Poprawne logowanie', async ({ akademiaLoginPage }) => {
        await akademiaLoginPage.zalogujSieNaAkademie(process.env.GWO_LOGIN!, process.env.GWO_PASSWORD!)

        // Asercje
        await expect(akademiaLoginPage.page).toHaveURL(new RegExp(akademiaLoginPage.env.akademia))
        await expect(akademiaLoginPage.page).toHaveURL('https://akademia.gwodev.pl/')
    })

    test('Logowanie z błędnymi danymi', async ({ akademiaLoginPage }) => {
        const randomLogin = `user_${generateRandomString(8)}`
        const randomPassword = generateRandomString(10)

        await akademiaLoginPage.kliknijZaloguj()
        await akademiaLoginPage.czekajNaStroneMojeGwo()
        await akademiaLoginPage.wypelnijFormularzLogowania(randomLogin, randomPassword)
        await akademiaLoginPage.kliknijZalogujSie()

        // Asercja
        await expect(akademiaLoginPage.errorMessage).toBeVisible({
            timeout: 10000,
        })
    })

    test('Przejście do przypomnienia hasła', async ({ akademiaLoginPage }) => {
        await akademiaLoginPage.kliknijZaloguj()
        await akademiaLoginPage.czekajNaStroneMojeGwo()
        await akademiaLoginPage.kliknijNiePamietamHasla()

        // Asercja
        await expect(akademiaLoginPage.page).toHaveURL(/przypomnienie-hasla/)
    })

    test('Przejście do rejestracji', async ({ akademiaLoginPage }) => {
        await akademiaLoginPage.kliknijZaloguj()
        await akademiaLoginPage.czekajNaStroneMojeGwo()
        await akademiaLoginPage.kliknijNieMamKonta()

        // Asercja
        await expect(akademiaLoginPage.page).toHaveURL(/rejestracja/)
    })
})
