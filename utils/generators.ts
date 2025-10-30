/**
 * Funkcje pomocnicze do generowania losowych danych testowych
 */

/**
 * Generuje losowy ciąg znaków o zadanej długości
 * @param length - długość ciągu znaków do wygenerowania
 * @returns losowy ciąg znaków
 */
export function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Generuje losowy (9 znaków) numer telefonu
 */
export function generateRandomPhoneNumber(length: number): string {
    const chars = '0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * Generuje losowy adres email
 * @returns losowy adres email w formacie user@domain
 */
export function generateRandomEmail(): string {
    const randomUser = generateRandomString(8).toLowerCase()
    const domains = ['test.pl', 'example.com', 'testmail.pl', 'sample.edu']
    const randomDomain = domains[Math.floor(Math.random() * domains.length)]
    return `${randomUser}@${randomDomain}`
}

/**
 * Lista dostępnych przedmiotów nauczania
 */
export const teachingSubjects = [
    'język polski',
    'matematyka',
    'historia',
    'fizyka',
    'biologia',
    'edukacja wczesnoszkolna',
    'przyroda',
    'plastyka',
    'geografia',
    'inny (przedmiot)',
] as const

/**
 * Zwraca losowo wybrany przedmiot nauczania
 * @returns nazwa przedmiotu
 */
export function getRandomTeachingSubject(): string {
    return teachingSubjects[Math.floor(Math.random() * teachingSubjects.length)]
}

/**
 * Generuje losowe hasło spełniające wymagania:
 * - minimum 8 znaków
 * - zawiera litery i cyfry
 * @param length - długość hasła (domyślnie 10 znaków)
 * @returns bezpieczne hasło zawierające litery i cyfry
 */
export function generateSecurePassword(length: number = 10): string {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'

    // Upewniamy się, że hasło ma minimum 8 znaków
    if (length < 8) {
        length = 8
    }

    // Generujemy hasło zawierające przynajmniej jedną literę i jedną cyfrę
    let password = ''

    // Dodajemy przynajmniej jedną literę
    password += letters.charAt(Math.floor(Math.random() * letters.length))

    // Dodajemy przynajmniej jedną cyfrę
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))

    // Uzupełniamy resztę hasła losowymi znakami (literami lub cyframi)
    const allChars = letters + numbers
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    // Mieszamy znaki w haśle, aby nie zawsze zaczynało się od litery i cyfry
    return password
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('')
}

/**
 * Lista przykładowych polskich imion
 */
const polishNames = [
    'Anna',
    'Maria',
    'Katarzyna',
    'Małgorzata',
    'Agnieszka',
    'Krzysztof',
    'Andrzej',
    'Piotr',
    'Jan',
    'Tomasz',
    'Michał',
    'Paweł',
    'Jacek',
    'Adam',
    'Marek',
    'Sławomir',
    'Wojciech',
    'Robert',
    'Sebastian',
    'Bartosz',
] as const

/**
 * Lista przykładowych polskich nazwisk
 */
const polishSurnames = [
    'Kowalski',
    'Nowak',
    'Wiśniewski',
    'Wójcik',
    'Kowalczyk',
    'Kamiński',
    'Lewandowski',
    'Zieliński',
    'Szymański',
    'Woźniak',
    'Kozłowski',
    'Jankowski',
    'Wojciechowski',
    'Kwiatkowski',
    'Kaczmarek',
    'Mazur',
    'Krawczyk',
    'Krupa',
    'Michalski',
    'Nowicki',
] as const

/**
 * Lista przykładowych nazw ulic
 */
const streetNames = [
    'Marszałkowska',
    'Nowogrodzka',
    'Chmielna',
    'Krakowskie Przedmieście',
    'Aleja Jerozolimskie',
    'Grunwaldzka',
    'Wiejska',
    'Sejmowa',
    'Szkolna',
    'Lipowa',
    'Brzozowa',
    'Dębowa',
    'Modowa',
    'Słoneczna',
    'Leśna',
] as const

/**
 * Lista przykładowych miejscowości
 */
const polishCities = [
    'Warszawa',
    'Kraków',
    'Gdańsk',
    'Wrocław',
    'Poznań',
    'Szczecin',
    'Bydgoszcz',
    'Lublin',
    'Białystok',
    'Katowice',
    'Gdynia',
    'Toruń',
    'Radom',
    'Sosnowiec',
    'Opole',
    'Zabrze',
    'Bielsko-Biała',
    'Gorzów Wielkopolski',
    'Olsztyn',
    'Częstochowa',
] as const

/**
 * Generuje losowe imię polskie
 * @returns losowe imię
 */
export function generateRandomName(): string {
    return polishNames[Math.floor(Math.random() * polishNames.length)]
}

/**
 * Generuje losowe nazwisko polskie
 * @returns losowe nazwisko
 */
export function generateRandomSurname(): string {
    return polishSurnames[Math.floor(Math.random() * polishSurnames.length)]
}

/**
 * Generuje losowy numer budynku (1-4 cyfry)
 * @returns losowy numer budynku jako string
 */
export function generateRandomBuildingNumber(): string {
    const min = 1
    const max = 9999
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

/**
 * Generuje losowy kod pocztowy w formacie XX-XXX
 * @returns losowy kod pocztowy
 */
export function generateRandomPostalCode(): string {
    const firstTwo = Math.floor(Math.random() * 90) + 10 // 10-99
    const lastThree = Math.floor(Math.random() * 900) + 100 // 100-999
    return `${firstTwo}-${lastThree.toString().padStart(3, '0')}`
}

/**
 * Generuje losową nazwę ulicy
 * @returns losowa nazwa ulicy
 */
export function generateRandomStreet(): string {
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
    return `${streetName}`
}

/**
 * Generuje losową miejscowość polską
 * @returns losowa nazwa miejscowości
 */
export function generateRandomCity(): string {
    return polishCities[Math.floor(Math.random() * polishCities.length)]
}
