import { Locator } from '@playwright/test'

/**
 * Zaznacza losową liczbę checkboxów z podanej grupy
 * @param checkboxLocator Lokator grupy checkboxów
 * @param minCount Minimalna liczba checkboxów do zaznaczenia
 * @param maxCount Maksymalna liczba checkboxów do zaznaczenia
 */
export async function zaznaczLosowePoziomyNauczania(checkboxLocator: Locator, minCount: number = 1, maxCount: number = 3): Promise<void> {
    const checkboxes = await checkboxLocator.all()

    // Losujemy liczbę checkboxów do zaznaczenia
    const count = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount

    // Losowo wybieramy indeksy checkboxów do zaznaczenia
    const indices = new Set<number>()
    while (indices.size < count) {
        indices.add(Math.floor(Math.random() * checkboxes.length))
    }

    // Zaznaczamy wybrane checkboxy
    for (const index of indices) {
        await checkboxes[index].click()
    }
}

/**
 * Zaznacza jeden losowy checkbox z podanej grupy
 * @param checkboxLocator Lokator grupy checkboxów
 */
export async function zaznaczLosowyCheckbox(checkboxLocator: Locator): Promise<void> {
    const checkboxes = await checkboxLocator.all()
    const randomIndex = Math.floor(Math.random() * checkboxes.length)
    await checkboxes[randomIndex].click()
}
