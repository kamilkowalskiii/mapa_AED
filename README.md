# MISJA AED – Dane na Ratunek (gov.pl) 🚨❤️

Aplikacja ratunkowo-edukacyjna oparta na otwartych danych publicznych (**dane.gov.pl**), która w sytuacji zagrożenia życia pomaga błyskawicznie zlokalizować najbliższy defibrylator AED oraz przeprowadzić skuteczną resuscytację krążeniowo-oddechową.

## 🎯 Cel projektu
Rozwiązanie wykorzystuje potencjał otwartych danych państwowych, aby skrócić czas dotarcia do defibrylatora AED w krytycznych minutach nagłego zatrzymania krążenia (NZK) oraz przeprowadzić świadka zdarzenia krok po kroku przez procedurę ratującą życie.

## ✨ Główne funkcjonalności
* **Szybka lokalizacja i nawigacja** – automatyczne wyznaczanie pozycji GPS lub wskazanie miejsca na interaktywnej mapie, obliczanie szacowanego czasu dobiegu, podgląd dokładnej mikrolokalizacji urządzenia wewnątrz budynku oraz szybkie wyznaczanie trasy w Mapach Google.
* **Wsparcie dla drugiej osoby (QR / SMS)** – natychmiastowe generowanie kodu QR oraz gotowej wiadomości SMS z linkiem do trasy, umożliwiające błyskawiczne wysłanie innego świadka zdarzenia po defibrylator.
* **Asystent RKO** – czytelna, krokowa instrukcja pierwszej pomocy (z podziałem na dorosłych i dzieci) wyposażona we wbudowany metronom dźwiękowy o częstotliwości **110 uderzeń/min**.
* **Baza otwartych danych** – przeszukiwalny rejestr 44 zweryfikowanych punktów AED w Polsce z możliwością eksportu zbioru danych do formatów **GeoJSON** oraz **CSV**.

## 🛠️ Technologie i dane
* **Źródło danych:** Otwarte Dane Publiczne ([dane.gov.pl](https://dane.gov.pl))
* **Frontend:** React / Vite, HTML5, CSS3, JavaScript
* **Mapy i geolokalizacja:** Interaktywna mapa, integracja z Google Maps API, Web Audio API (metronom)

## 💻 Uruchomienie lokalne
Aby uruchomić projekt lokalnie na swoim komputerze:

1. Sklonuj repozytorium:
   ```bash
   git clone [https://github.com/kamilkowalskiii/projekty_webowe.git](https://github.com/kamilkowalskiii/projekty_webowe.git)
