# MISJA AED – Dane na Ratunek (gov.pl)

Aplikacja webowa w architekturze **Vite + React + Tailwind CSS + Leaflet**, zaprojektowana zgodnie z identyfikacją wizualną serwisu **gov.pl** i wykorzystująca otwarte dane publiczne (**dane.gov.pl**).

## Struktura projektu
```text
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AedMap.jsx
│   │   ├── CprAssistant.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LocationBar.jsx
│   │   ├── OpenDataPortal.jsx
│   │   └── TargetAedCard.jsx
│   ├── data/
│   │   └── aedPoints.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── vite.config.js
```

## Uruchomienie lokalne (krok po kroku)
1. Rozpakuj archiwum ZIP i otwórz folder projektu w terminalu (lub VS Code).
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
4. Otwórz wyświetlony adres (domyślnie `http://localhost:5173`) w przeglądarce.

## Budowanie wersji produkcyjnej (np. na GitHub Pages / Netlify / Vercel)
```bash
npm run build
```
Gotowe pliki statyczne zostaną wygenerowane w katalogu `dist/`.
