# Instrukcje Copilot dla agentów AI

## Architektura projektu

- Ten projekt to zestaw testów end-to-end Playwright dla aplikacji webowej Akademia.
- Główne komponenty:
  - `pages/`: Modele stron (Page Object Models, POM) dla kluczowych ekranów (np. `AkademiaLoginPage.ts`, `AkademiaPage.ts`).
  - `fixtures/`: Niestandardowe fixtury Playwright do przygotowania testów i współdzielonego kontekstu.
  - `testData/`: Centralne definicje danych testowych.
  - `tests/`: Główne specyfikacje testów (np. `akademia.spec.ts`, `akademiaLogin.spec.ts`).
  - `config/`: Pliki konfiguracyjne i środowiskowe (np. `environments.ts`).

## Workflow deweloperskie

- **Uruchamianie wszystkich testów:**
  - `npx playwright test` (wykorzystuje konfigurację z `playwright.config.ts`)
- **Podgląd raportów z testów:**
  - Otwórz `playwright-report/index.html` po zakończeniu testów.
- **Debugowanie:**
  - Użyj trybu debugowania Playwright: `npx playwright test --debug`.
- **Dane testowe:**
  - Wszystkie statyczne dane testowe znajdują się w `testData/akademia.data.ts`.
- **Globalny setup:**
  - Wspólna logika przygotowania w `global.setup.ts` oraz `auth.setup.ts`.

## Konwencje projektowe

- Modele stron (POM) są wymagane dla każdego nowego ekranu; umieszczaj je w `pages/` i stosuj wzorzec nazewnictwa `*Page.ts`.
- Fixtury definiuj w `fixtures/` i importuj w specyfikacjach testów.
- Pliki testowe umieszczaj w `tests/` i nazywaj z sufiksem `.spec.ts`.
- Konfiguracja środowiskowa jest scentralizowana w `config/environments.ts`.
- Używaj TypeScript; nie dodawaj nowych plików w JavaScript.

## Integracje i zależności

- Projekt korzysta z Playwright do automatyzacji przeglądarki i raportowania.
- Brak stubów backendu; testy komunikują się z prawdziwym lub skonfigurowanym środowiskiem.
- Zewnętrzne dane/konfiguracje odwołuj wyłącznie z `testData/` lub `config/`.

## Przykłady

- Dodanie nowego testu logowania:
  - Utwórz nową specyfikację w `tests/`, użyj `AkademiaLoginPage` z `pages/` i zaimportuj dane testowe z `testData/akademia.data.ts`.
- Dodanie nowej fixtury:
  - Zdefiniuj w `fixtures/`, eksportuj i importuj w odpowiednich testach.

## Kluczowe pliki i katalogi

- `playwright.config.ts`: Główna konfiguracja Playwright
- `global.setup.ts`, `auth.setup.ts`: Globalny setup testów
- `pages/`: Modele stron
- `fixtures/`: Niestandardowe fixtury
- `testData/`: Dane testowe
- `tests/`: Specyfikacje testów
- `config/`: Pliki konfiguracyjne/środowiskowe

---

W przypadku niejasnych konwencji lub brakującej dokumentacji poproś użytkownika o doprecyzowanie lub przykłady z ostatnich PR.
