// import { Page, Locator } from '@playwright/test';
// import { BasePage } from './BasePage';

// export class KontaktPage extends BasePage {
//   // Lokatory formularza
//   readonly fullNameInput: Locator;
//   readonly countyTomSelectControl: Locator;
//   readonly countyDropdownInput: Locator;
//   readonly countyDropdown: Locator;
//   readonly countySelect: Locator; // Oryginalny select
//   readonly emailInput: Locator;
//   readonly phoneInput: Locator;
//   readonly schoolLevelSelect: Locator;
//   readonly schoolFunctionSelect: Locator;
//   readonly courseTypeSelect: Locator;
//   readonly subjectInput: Locator;
//   readonly messageTextarea: Locator;
//   readonly symbolCounter: Locator;
//   readonly submitButton: Locator;

//   constructor(page: Page) {
//     super(page);

//     // Pola formularza
//     this.fullNameInput = page.locator('#contact_form_fullName');

//     // Tom Select - precyzyjne selektory
//     this.countyTomSelectControl = page.locator('.cart-text-input.--region .ts-control');
//     this.countyDropdownInput = page.locator('.dropdown-input');
//     this.countyDropdown = page.locator('.ts-dropdown');
//     this.countySelect = page.locator('#contact_form_county');
//     this.emailInput = page.locator('#contact_form_email');
//     this.phoneInput = page.locator('#contact_form_phone');
//     this.schoolLevelSelect = page.locator('#contact_form_schoolLevel');
//     this.schoolFunctionSelect = page.locator('#contact_form_schoolFunction');
//     this.courseTypeSelect = page.locator('#contact_form_courseType');
//     this.subjectInput = page.locator('#contact_form_subject');
//     this.messageTextarea = page.locator('#contact_form_message');
//     this.symbolCounter = page.locator('.symbol_count');
//     this.submitButton = page.getByRole('button', { name: 'Wyślij' });
//   }

//   // ============ NAWIGACJA ============

//   async otworzKontakt(): Promise<void> {
//     await this.otworzStrone(`${this.env.akademia}/kontakt`);
//   }

//   // ============ WYPEŁNIANIE FORMULARZA ============

//   async wypelnijImieNazwisko(imieNazwisko: string): Promise<void> {
//     await this.fullNameInput.fill(imieNazwisko);
//   }

//   async wybierzPowiat(powiat: string): Promise<void> {
//     await this.countyTomSelectControl.click();
//     await this.countyDropdown.waitFor({ state: 'visible' });
//     await this.countyDropdownInput.fill(powiat);
//     await this.page.waitForTimeout(2000);
//     await this.page.locator('.ts-dropdown-content .option').first().click();
//   }

//   async wypelnijEmail(email: string): Promise<void> {
//     await this.emailInput.fill(email);
//   }

//   async wypelnijTelefon(telefon: string): Promise<void> {
//     await this.phoneInput.fill(telefon);
//   }

//   async wypelnijTemat(temat: string): Promise<void> {
//     await this.subjectInput.fill(temat);
//   }

//   async wypelnijWiadomosc(wiadomosc: string): Promise<void> {
//     await this.messageTextarea.fill(wiadomosc);
//   }

//   async wybierzPoziomNauczania(poziom: 'kindergarten' | 'primary-school' | 'high-school'): Promise<void> {
//     await this.schoolLevelSelect.selectOption(poziom);
//   }

//   async wybierzFunkcjeWSzkole(funkcja: 'director' | 'vice-director' | ''): Promise<void> {
//     if (funkcja) {
//       await this.schoolFunctionSelect.selectOption(funkcja);
//     }
//   }

//   async wybierzTypSzkolenia(typ: 'paid-course' | 'closed-course' | 'e-learning'): Promise<void> {
//     await this.courseTypeSelect.selectOption(typ);
//   }

//   async kliknijWyslij(): Promise<void> {
//     await this.submitButton.click();
//   }

//   // ============ WERYFIKACJA ============

//   async sprawdzCzyPowiatWybrany(): Promise<boolean> {
//     // Sprawdź czy oryginalny select ma wartość (nie pusty string)
//     const value = await this.countySelect.inputValue();
//     return value !== '';
//   }

//   // ============ METODA KOMPLEKSOWA ============

//   async wypelnijFormularz(dane: {
//     imieNazwisko: string;
//     powiat: string;
//     email: string;
//     telefon?: string;
//     poziomNauczania: 'kindergarten' | 'primary-school' | 'high-school';
//     funkcjaWSzkole?: 'director' | 'vice-director' | '';
//     typSzkolenia: 'paid-course' | 'closed-course' | 'e-learning';
//     temat: string;
//     wiadomosc: string;
//   }): Promise<void> {
//     await this.wypelnijImieNazwisko(dane.imieNazwisko);
//     await this.wybierzPowiat(dane.powiat);
//     await this.wypelnijEmail(dane.email);

//     if (dane.telefon) {
//       await this.wypelnijTelefon(dane.telefon);
//     }

//     await this.wybierzPoziomNauczania(dane.poziomNauczania);

//     if (dane.funkcjaWSzkole) {
//       await this.wybierzFunkcjeWSzkole(dane.funkcjaWSzkole);
//     }

//     await this.wybierzTypSzkolenia(dane.typSzkolenia);
//     await this.wypelnijTemat(dane.temat);
//     await this.wypelnijWiadomosc(dane.wiadomosc);
//   }

//   async wyslijFormularz(dane: {
//     imieNazwisko: string;
//     powiat: string;
//     email: string;
//     telefon?: string;
//     poziomNauczania: 'kindergarten' | 'primary-school' | 'high-school';
//     funkcjaWSzkole?: 'director' | 'vice-director' | '';
//     typSzkolenia: 'paid-course' | 'closed-course' | 'e-learning';
//     temat: string;
//     wiadomosc: string;
//   }): Promise<void> {
//     await this.wypelnijFormularz(dane);
//     await this.kliknijWyslij();
//   }
// }
