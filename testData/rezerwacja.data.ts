export const rezerwacjaTestData = {
    // Przyszła data (za 30 dni od dziś)
    generateFutureDate: (daysFromNow: number = 30): string => {
        const date = new Date()
        date.setDate(date.getDate() + daysFromNow)
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

    // Wartości selectów (dostosuj do rzeczywistych!)
    rodzajeSzkolen: {
        stacjonarne: 'cm_2',
        online: 'cm_1', // Przykład, sprawdź rzeczywiste wartości
    },

    poziomySzkol: {
        podstawowa: 'sl_2',
        przedszkole: 'sl_1', // Przykład
        srednia: 'sl_3', // Przykład
    },
}
