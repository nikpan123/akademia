export const kontaktTestData = {
    // Przykładowe dane do formularza
    prawidloweDane: {
        imieNazwisko: 'Jan Kowalski',
        powiat: 'gdański',
        email: 'jan.kowalski@example.com',
        telefon: '123456789',
        poziomNauczania: 'primary-school' as const,
        funkcjaWSzkole: 'director' as const,
        typSzkolenia: 'paid-course' as const,
        temat: 'Pytanie o szkolenie',
        wiadomosc: 'Dzień dobry, chciałbym uzyskać więcej informacji o szkoleniach dla nauczycieli.',
    },

    daneBezTelefonu: {
        imieNazwisko: 'Anna Nowak',
        powiat: 'warszaw',
        email: 'anna.nowak@example.com',
        poziomNauczania: 'kindergarten' as const,
        typSzkolenia: 'e-learning' as const,
        temat: 'Kurs e-learningowy',
        wiadomosc: 'Proszę o informacje dotyczące kursów online.',
    },

    generateEmail: () => `kontakt-${Date.now()}@test.com`,

    // Mapowanie wartości
    poziomyNauczania: {
        przedszkole: 'kindergarten' as const,
        podstawowa: 'primary-school' as const,
        srednia: 'high-school' as const,
    },

    funkcje: {
        dyrektor: 'director' as const,
        wicedyrektor: 'vice-director' as const,
        brak: '' as const,
    },

    typySzkolen: {
        nauczyciele: 'paid-course' as const,
        radyPedagogiczne: 'closed-course' as const,
        eLearning: 'e-learning' as const,
    },
}
