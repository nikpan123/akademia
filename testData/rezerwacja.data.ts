export const rezerwacjaTestData = {
    urlSzkolenia: 'https://akademia.gwodev.pl/szkolenia-dla-rad-pedagogicznych/adhd-jak-sobie-z-nim-radzic,6444', // na chwile obecną trzeba ręcznie zmieniać adres szkolenia

    generateFutureDate: (daysFromNow: number = 30): string => {
        const date = new Date()
        date.setDate(date.getDate() + daysFromNow)
        return date.toISOString().split('T')[0]
    },

    generatePastDate: (daysAgo: number = 30): string => {
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        return date.toISOString().split('T')[0]
    },

    daneKontaktowe: {
        imie: 'Jan',
        nazwisko: 'Kowalski',
        email: 'jan.kowalski@example.com',
        telefon: '123456789',
    },

    daneFaktury: {
        nazwa: 'Szkoła Podstawowa nr 1',
        nip: '1111111111',
        ulica: 'Testowa',
        nrBudynku: '1A',
        kodPocztowy: '00-001',
        miejscowosc: 'Warszawa',
        zwolnienieVat: true,
    },
}
