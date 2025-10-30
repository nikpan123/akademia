import { test, expect } from '../fixtures/akademiaFixtures'
import { akademiaTestData } from '../testData/akademia.data'

test.describe('Szkolenia dla rad pedagogicznych', () => {
    test.beforeEach(async ({ szkoleniaDlaRadPedagogicznychPage }) => {
        await szkoleniaDlaRadPedagogicznychPage.otworzSzkoleniaDlaRadPedagogicznych()
        await expect(szkoleniaDlaRadPedagogicznychPage.page).toHaveURL(/.*\/szkolenia-dla-rad-pedagogicznych/)
        await expect(szkoleniaDlaRadPedagogicznychPage.header).toBeVisible()
        await expect(szkoleniaDlaRadPedagogicznychPage.header).toHaveText(akademiaTestData.naglowekStronySzkoleniaDlaRadPedagogicznych)
    })

    test.describe('Nawigacja', () => {
        test('Kontakt', async ({ szkoleniaDlaRadPedagogicznychPage }) => {
            await szkoleniaDlaRadPedagogicznychPage.przejdzNaKontakt()

            // Asercje
            await expect(szkoleniaDlaRadPedagogicznychPage.page).toHaveURL(/.*\/kontakt.*/)
        })

        test('Widoczność filtrów, buttonów', async ({ szkoleniaDlaRadPedagogicznychPage }) => {
            // Asercje
            await expect(szkoleniaDlaRadPedagogicznychPage.subjectFilter).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.levelFilter).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.topicFilter).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.typeFilter).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.otherFilter).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.clearButton).toBeVisible()
            await expect(szkoleniaDlaRadPedagogicznychPage.changeViewButton).toBeVisible()
        })

        test('Szczegóły szkolenia dla rad - nawigacja do szczegółów', async ({ szkoleniaDlaRadPedagogicznychPage }) => {
            const nazwaSzkolenia = await szkoleniaDlaRadPedagogicznychPage.otworzLosoweSzkolenieDlaRad()
            expect(nazwaSzkolenia).not.toBe('')
            console.log(`Pobrana nazwa szkolenia: ${nazwaSzkolenia}`)

            // Asercje
            const tytulNaStronie = szkoleniaDlaRadPedagogicznychPage.page.locator('h1')
            await expect(tytulNaStronie).toContainText(nazwaSzkolenia)
        })
    })
})
