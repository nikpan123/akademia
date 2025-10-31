import { test as base } from '@playwright/test'
import { AkademiaPage } from '../pages/AkademiaPage'
import { MojeGwoLoginPage } from '../pages/MojeGwoLoginPage'
import { AkademiaLoginPage } from '../pages/AkademiaLoginPage'
import { AkademiaRegistrationPage } from '../pages/AkademiaRegistrationPage'
import { KontaktPage } from '../pages/KontaktPage'
import { SzkoleniaDlaNauczycieliPage } from '../pages/SzkoleniaDlaNauczycieliPage'
import { SzkoleniaDlaRadPedagogicznychPage } from '../pages/SzkoleniaDlaRadPedagogicznychPage'
import { RezerwacjaSzkoleniaPage } from '../pages/RezerwacjaSzkoleniaPage'
export { expect } from '@playwright/test'

type AkademiaFixtures = {
    akademiaPage: AkademiaPage
    mojeGwoLoginPage: MojeGwoLoginPage
    akademiaLoginPage: AkademiaLoginPage
    akademiaRegistrationPage: AkademiaRegistrationPage
    kontaktPage: KontaktPage
    szkoleniaDlaNauczycieliPage: SzkoleniaDlaNauczycieliPage
    szkoleniaDlaRadPedagogicznychPage: SzkoleniaDlaRadPedagogicznychPage
    rezerwacjaSzkoleniaPage: RezerwacjaSzkoleniaPage
}

export const test = base.extend<AkademiaFixtures>({
    akademiaPage: async ({ page }, use) => {
        const akademiaPage = new AkademiaPage(page)
        await use(akademiaPage)
    },

    mojeGwoLoginPage: async ({ page }, use) => {
        const mojeGwoLoginPage = new MojeGwoLoginPage(page)
        await use(mojeGwoLoginPage)
    },

    akademiaLoginPage: async ({ page }, use) => {
        const akademiaLoginPage = new AkademiaLoginPage(page)
        await use(akademiaLoginPage)
    },

    akademiaRegistrationPage: async ({ page }, use) => {
        const akademiaRegistrationPage = new AkademiaRegistrationPage(page)
        await use(akademiaRegistrationPage)
    },

    kontaktPage: async ({ page }, use) => {
        const kontaktPage = new KontaktPage(page)
        await use(kontaktPage)
    },

    szkoleniaDlaNauczycieliPage: async ({ page }, use) => {
        const szkoleniaDlaNauczycieliPage = new SzkoleniaDlaNauczycieliPage(page)
        await use(szkoleniaDlaNauczycieliPage)
    },

    szkoleniaDlaRadPedagogicznychPage: async ({ page }, use) => {
        const szkoleniaDlaRadPedagogicznychPage = new SzkoleniaDlaRadPedagogicznychPage(page)
        await use(szkoleniaDlaRadPedagogicznychPage)
    },

    rezerwacjaSzkoleniaPage: async ({ page }, use) => {
        const rezerwacjaSzkoleniaPage = new RezerwacjaSzkoleniaPage(page)
        await use(rezerwacjaSzkoleniaPage)
    },
})
