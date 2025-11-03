import {
    generateRandomBuildingNumber,
    generateRandomCity,
    generateRandomName,
    generateRandomPhoneNumber,
    generateRandomPostalCode,
    generateRandomStreet,
    generateRandomSurname,
} from '../utils/generators'

export const akademiaTestData = {
    // Adresy i teksty
    adresWStopce: 'Akademia GWO, al. Grunwaldzka 50A, 80-241 Gdańsk',
    oAkademiiTekst:
        'Niepubliczna placówka doskonalenia nauczycieli prowadzona przez Instytut Rozwoju Edukacji – Fundację im. Adama Mysiora, wpisana do ewidencji przez Marszałka Województwa Pomorskiego pod numerem 5/2017. Akademia GWO ma akredytację Pomorskiego Kuratora Oświaty na prowadzenie ogólnopolskich szkoleń dla nauczycieli. Numer akredytacji: 177/2024.',
    naglowekStronySzkoleniaDlaRadPedagogicznych: 'Wyszukaj szkolenie',
    urlAkademii: 'https://akademia.gwodev.pl',

    // Generatory
    generateEmail: () => `test-${Date.now()}@playwright.com`,
    generateBadEmail: () => `test-${Date.now()}`,
    generateRandomPhoneNumber,
    generateRandomName,
    generateRandomSurname,
    generateRandomStreet,
    generateRandomBuildingNumber,
    generateRandomPostalCode,
    generateRandomCity,

    // Komunikaty błędów
    bledy: {
        bladNewsletter: 'Wpisz poprawny e-mail',
        bladNewsletterEmailRodo: 'Wpisz poprawny e-mail\nZaznacz zgodę na przetwarzanie danych',
        blednyEmail: 'Wpisz poprawny adres e-mail',
        brakRodo: 'Zaznacz zgodę na przetwarzanie danych',
        bladneLogowanie: 'Podany login bądź hasło są niepoprawne.',
    },

    // Numery kont do zamówień
    gwoAccount: '46 1750 1325 0000 0000 3019 0017',
    adres: `Gdańskie Wydawnictwo Oświatowe
            spółka z ograniczoną odpowiedzialnością sp. k.
            al. Grunwaldzka 50A, 80-241 Gdańsk`,
}

export interface WspolneDaneZamowienia {
    phone: string
    name: string
    surname: string
    address: string
    number: string
    postalCode: string
    city: string
}

export interface DaneZamowieniaBezLogowania extends WspolneDaneZamowienia {
    email: string
}

export interface DaneZamowieniaZLogowaniem extends WspolneDaneZamowienia {}
