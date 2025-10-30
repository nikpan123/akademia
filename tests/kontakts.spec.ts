// import { test, expect } from '../fixtures/akademiaFixtures';
// import { kontaktTestData } from '../testData/kontakt.data';

// test.describe('Kontakt - formularz', () => {

//   test.beforeEach(async ({ kontaktPage }) => {
//     await kontaktPage.otworzKontakt();
//   });

//   test('Wypełnienie pełnego formularza', async ({ kontaktPage }) => {
//     await kontaktPage.wyslijFormularz(kontaktTestData.prawidloweDane);

//     // Asercja - sprawdź czy nie ma błędów walidacji
//     const validationError = await kontaktPage.page.locator('.error, .invalid').count();
//     expect(validationError).toBe(0);
//   });

//   test('Weryfikacja wyboru powiatu', async ({ kontaktPage }) => {
//     await kontaktPage.wybierzPowiat('gdański');

//     // Sprawdź czy powiat został wybrany
//     const isSelected = await kontaktPage.sprawdzCzyPowiatWybrany();
//     expect(isSelected).toBe(true);

//     // Sprawdź wizualnie czy pokazuje "gdański"
//     const selectedText = await kontaktPage.page.locator('.ts-control .item').textContent();
//     expect(selectedText).toContain('gdański');
//   });

//   test('Pełny formularz krok po kroku', async ({ kontaktPage }) => {
//     await kontaktPage.wypelnijImieNazwisko('Jan Kowalski');
//     await kontaktPage.wybierzPowiat('gdański');

//     // Weryfikacja po wyborze powiatu
//     expect(await kontaktPage.sprawdzCzyPowiatWybrany()).toBe(true);

//     await kontaktPage.wypelnijEmail('test@example.com');
//     await kontaktPage.wypelnijTelefon('123456789');
//     await kontaktPage.wybierzPoziomNauczania('primary-school');
//     await kontaktPage.wybierzFunkcjeWSzkole('director');
//     await kontaktPage.wybierzTypSzkolenia('paid-course');
//     await kontaktPage.wypelnijTemat('Pytanie testowe');
//     await kontaktPage.wypelnijWiadomosc('Treść testowej wiadomości');

//     await kontaktPage.kliknijWyslij();

//     // Asercje - brak błędów walidacji
//     const errorCount = await kontaktPage.page.locator('.invalid, .error').count();
//     expect(errorCount).toBe(0);
//   });

// });
