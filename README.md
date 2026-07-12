# Rohan
<i>Tomasz Turek\
2025</i>

[Polski](#rohan-1) | [English](#rohan-2)


# Rohan

# Spis treści

- [Opis](#opis)
- [Funkcjonalności](#funkcjonalności)
- [Architektura](#architektura)
- [Co zostało zrealizowane](#co-zostało-zrealizowane)
- [Instalacja](#instalacja)
- [Budowanie i publikacja](#budowanie-i-publikacja)
- [Testy jednostkowe](#testy-jednostkowe)
- [Technologie](#technologie)

---

## Opis

**Rohan** to aplikacja mobilna (zbudowana przy użyciu React Native + Expo w języku TypeScript).<br>
Służy ona jako zaawansowana lista Misji ze skromnymi elementami grywalizacji oraz obsługą natywnych funkcji aplikacji.

---

## Funkcjonalności

- **Zarządzanie Misjami:** dodawanie, edycja, usuwanie, podmisje i statusy.
- **Import z plików Markdown:** możliwość importu questów z plików .md.
- **Tryb offline:** zalogowany użytkownik może działać bez połączenia z siecią, zmiany są synchronizowane po odzyskaniu połączenia.
- **Udostępnianie Misji:** natywna funkcja "share".
- **Zmiana języka:** obsługa języka polskiego oraz angielskiego.
- **Zmiana motywów:** obsługa motywów: jasnego, cyber i ciemnego.
- **Grywalizacja:** Misje mają możliwość nadania punktów za każde zadanie.
- **Responsywny IU:** Interfejs dostosowany do różnych rozmiarów ekranów.
- **Bezpieczeństwo:** logowanie przez Firebase Auth.
- **Testy jednostkowe:** podstawowe testy logiki i komponentów.

---

## Architektura

- **Podział na foldery:** `app`, `components`, `context`, `utils`, `hooks`, `assets`.
- **Zarządzanie stanem:** Context API (`AuthContext`, `QuestContext`, `ThemeContext`).
- **Obsługa offline:** AsyncStorage + kolejka zmian + synchronizacja.
- **Import/eksport:** funkcje pomocnicze w `utils/`.
- **Testy:** pliki testowe w `__tests__`.

---


## Co zostało zrealizowane

- Obsługa Questów (dodawanie, edycja, usuwanie).
- Import questów z plików Markdown (bez załączników).
- Tryb offline z synchronizacją po odzyskaniu internetu.
- Udostępnianie Questów.
- Wyświetlanie lokalizacji użytkownika.
- Zmiana języka aplikacji (PL/EN).
- Responsywny i nowoczesny interfejs (Tamagui).
- Test jednostkowy dla logiki i komponentów.
- Instrukcja budowania i uruchamiania aplikacji.
- Grywalizacja: system punktów nie został wdrożony, ale pojedyncze zadanie posiada atrybut punktów.

---

## Instalacja

### Wymagania wstępne

- Urządzenie z systemem Android do pliku .apk
lub
- Komputer obsługujący `npm`

### Instalacja

1. **Zainstaluj zależności:**
   ```
   npm install
   ```
2. **Uruchom aplikację Expo:**
   ```
   npx expo start
   ```
3. **Uruchom na Android/iOS (fizyczne urządzenie lub emulator):**

   Zeskanuj kod QR lub wpisz adres IP (wymagane połączenie w ramach jednej sieci LAN) w Expo Go lub użyj emulatora.

---

## Budowanie i publikacja

### Android (.apk):

1. **Budowanie:**
   ```
   npx expo build:android
   ```
   lub (nowy system EAS):
   ```
   npx eas build -p android
   ```
2. **Plik .apk znajdziesz w panelu Expo lub w katalogu build.**

### iOS (.ipa):

1. **Budowanie:**
   ```
   npx eas build -p ios
   ```
2. **Publikacja:**  

    Wymaga konta Apple Developer i konfiguracji certyfikatów.

---

## Testy jednostkowe

1. **Uruchomienie testów:**
   ```
   npm test
   ```
2. **Testowane elementy:**
   - Funkcje importu/eksportu Markdown (`utils/importQuest.tsx`)
   - Logika QuestContext (dodawanie, edycja, synchronizacja)
   - Wybrane komponenty UI (np. QuestForm)
3. **Framework:** Jest

---

## Technologie

- React Native + Expo
- TypeScript
- Firebase (Auth, Firestore)
- Tamagui (UI)
- AsyncStorage
- NetInfo
- Expo Location
- Jest

---


# Rohan

# Spis treści

- [Description](#description)
- [Functionality](#functionality)
- [Architecture](#architecture)
- [What has been implemented](#what-has-been-implemented)
- [Installation](#installation)
- [Build and publish](#build-and-publish)
- [Unit tests](#unit-tests)
- [Technologies](#technologies)

---

## Description

**Rohan** is a mobile application (built using React Native + Expo in TypeScript).<br>
It serves as an advanced Quest list with modest gamification elements and support for native app features.

---

## Functionality

- **Manage Quests:** add, edit, delete, sub-missions and statuses.
- **Import from Markdown files:** ability to import quests from .md files.
- **Offline mode:** logged-in user can run without network connection, changes are synchronized when connection is recovered.
- **Mission sharing:** native "share" function.
- **Language change:** Polish and English language support.
- **Changing themes:** support for light, cyber and dark themes.
- **Gaming:** quests have the ability to give points for each.
- **Responsive IU:** interface adapted to different screen sizes.
- **Security:** login via Firebase Auth.
- **Unit testing:** basic logic and component testing.

---

## Architektura

- **Folder separation:** `app`, `components`, `context`, `utils`, `hooks`, `assets`.
- **State management:** Context API (`AuthContext`, `QuestContext`, `ThemeContext`).
- **Offline support:** AsyncStorage + change queue + synchronization.
- **Import/export:** helper functions in `utils/`.
- **Tests:** test files in `__tests__`.

---

## What has been implemented

- Quest handling (adding, editing, deleting).
- Import of Quests from Markdown files (without attachments).
- Offline mode with synchronization after internet recovery.
- Sharing of Quests.
- Displaying the user's location.
- Changing the language (EN/PL).
- Responsive and modern interface (Tamagui).
- Unit test for logic and components.
- Instructions for building and running the application.
- Gamification: the points system has not been implemented, but a single task has a points attribute.

---

## Installation

### Prerequisites.

- Android device to .apk file
or
- A computer that supports `npm`.

### Installation

1. **Install dependencies:**
 ```
 npm install
 ```
2. **Start Expo app:**
 ```
 npx expo start
 ```
3. **Start on Android/iOS (physical device or emulator):**.

   Scan the QR code or enter the IP address (single LAN connection required) in Expo Go or use the emulator.

---

1. **Build:**
 ```
 npx eas build -p ios
 ```
2. **Publish:**.

    Requires Apple Developer account and certificate configuration.

## Building and publishing

### Android (.apk):

1. **Build:**
   ```
   npx expo build:android
   ```
   or (new system EAS):
   ```
   npx eas build -p android
   ```
2. **You can find the .apk file in the Expo panel or in the build directory.**

### iOS (.ipa):

1. **Build:**
   ```
   npx eas build -p ios
   ```
2. **Publish:**  

   Requires Apple Developer account and certificate configuration.

---

## Unit tests

1. **Starting tests:**
 ```
 npm test
 ```
2. **Elements tested:**.
   - Markdown import/export functions (`utils/importQuest.tsx`).
   - QuestContext logic (add, edit, sync)
   - Selected UI components (e.g. QuestForm)
3. **Framework:** Jest

---

## Technologies

- React Native + Expo
- TypeScript
- Firebase (Auth, Firestore)
- Tamagui (UI)
- AsyncStorage
- NetInfo
- Expo Location
- Jest

---