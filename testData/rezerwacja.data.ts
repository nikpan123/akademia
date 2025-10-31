export const rezerwacjaTestData = {
    urlSzkolenia: 'https://akademia.gwodev.pl/szkolenia-dla-rad-pedagogicznych/adhd-jak-sobie-z-nim-radzic,6444', // na chwile obecną trzeba ręcznie zmieniać adres szkolenia

    // Przyszła data (za 30 dni od dziś)
    generateFutureDate: (daysFromNow: number = 30): string => {
        const date = new Date()
        date.setDate(date.getDate() + daysFromNow)
        return date.toISOString().split('T')[0] // Format: YYYY-MM-DD
    },

    // Przeszła data (30 dni od dziś)
    generatePastDate: (daysAgo: number = 30): string => {
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        return date.toISOString().split('T')[0] // Format: YYYY-MM-DD
    },

    // Przykładowe dane
    podstawowaDane: {
        miejscowosc: 'Warszawa',
        data: '2025-12-15',
        godzina: '14:00',
        liczbaOsob: 25,
    },

    daneZUwagami: {
        miejscowosc: 'Gdańsk',
        data: '2025-11-20',
        godzina: '10:30',
        liczbaOsob: 30,
        uwagi: 'Proszę o przygotowanie sali konferencyjnej z projektorem.',
    },

    // Wartości selectów
    rodzajeSzkolen: {
        stacjonarne: 'cm_2',
        online: 'cm_1',
    },

    poziomySzkol: {
        podstawowa: 'sl_2',
        przedszkole: 'sl_1',
        srednia: 'sl_3',
    },
}
