# Wetter-Dashboard Projekt
## Projektübersicht
Dieses Projekt ist ein einfaches Wetter-Dashboard, bei dem Nutzer mehrere Widgets für verschiedene Städte erstellen können. Jedes Widget zeigt aktuelle Wetterdaten für die gewählte Stadt an. Die Wetterdaten werden vom Backend über eine externe Wetter-API (z.B. Open-Meteo) abgerufen und im Backend gecached, um die Anzahl der API-Aufrufe zu reduzieren.

Das Projekt ist in zwei Teile unterteilt:

### Backend: 
Node.js mit Express, verwaltet Widgets und holt Wetterdaten mit Caching aus einer externen API.

### Frontend:
Next.js (React) mit TypeScript, zeigt das Dashboard, erlaubt das Hinzufügen und Löschen von Widgets und ruft Wetterdaten vom Backend ab.

## Setup-Anleitung
### Voraussetzungen

#### Node.js (Version 18 oder höher empfohlen)
#### MongoDB (lokal installiert oder MongoDB Atlas Cloud)
#### npm (Node Package Manager) oder yarn

### Backend Setup
1. Ins Backend-Verzeichnis wechseln:

```bash
cd backend

npm install
```

2. Erstelle eine `.env` Datei im `backend` -Ordner mit folgendem Inhalt:

```ini
MONGODB_URI=mongodb://localhost:27017/widgets
PORT=5000
```

3. Backend starten (Entwicklungsmodus):

```bash
npm run dev
```
Das Backend läuft nun unter `http://localhost:5000`.

### Frontend Setup
1. Ins Frontend-Verzeichnis wechseln:

```bash
cd frontend

npm install

npm run dev
```
Das Frontend ist erreichbar unter `http://localhost:3000`.

## API-Beschreibung
### Endpunkte
| Methode | Endpoint                     | Beschreibung                              |
| ------- | ---------------------------- | ----------------------------------------- |
| GET     | `/widgets`                   | Liste aller gespeicherten Widgets         |
| GET     | `/widgets/:id`               | Widget holen nach ID                    |
| POST    | `/widgets`                   | Neues Widget erstellen (mit `location`)   |
| DELETE  | `/widgets/:id`               | Widget löschen nach ID                    |
| GET     | `/widgets/:location/weather` | Aktuelle Wetterdaten für Location abrufen |


## Beispiel: Neues Widget erstellen
### Request:

```http
POST /widgets
Content-Type: application/json

{
  "location": "Berlin"
}
```
### Response:

```json
{
  "_id": "64c9f12abc1234d5678efabc",
  "location": "Berlin",
  "createdAt": "2025-08-02T14:00:00.000Z"
}
```

## Architekturüberblick
Das Projekt folgt einer klaren Trennung von Frontend und Backend mit folgenden Komponenten:

```text
/project-root
├── backend/         # Node.js REST API mit Express
│   ├── routes/      # API-Routen für Widgets und Wetter
│   ├── controllers/ # Logik zum Erstellen, Löschen und Abrufen von Widgets
│   ├── services/    # Wetterdaten-Handling & Caching-Logik
│   ├── models/      # MongoDB Modelle (Widget-Schema)
│   └── cache/       # In-Memory Cache für Wetterdaten
├── frontend/        # Next.js Frontend (React, TypeScript)
│   ├── pages/       # Seiten, u.a. Dashboard in index.tsx
│   ├── components/  # Wiederverwendbare UI-Komponenten (Widgets, Buttons, etc.)
│   └── styles/      # TailwindCSS-Konfiguration und Styles
└── README.md        # Projektbeschreibung & Setup
```

Hier ein einfaches Architekturdiagramm, das die Hauptkomponenten und deren Zusammenspiel zeigt:

<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg" font-family="Arial, sans-serif">
  <!-- Backend Box -->
  <rect x="0" y="0" width="700" height="700" fill="#e0f7fa" stroke="#00796b" 
  stroke-width="2" rx="10" ry="10" />
  <rect x="20" y="20" width="260" height="350" fill="#e0f7fa" stroke="#00796b" stroke-width="2" rx="10" ry="10" />
  <text x="150" y="50" font-weight="bold" font-size="18" fill="#004d40" text-anchor="middle">Backend (Node.js + Express)</text>
  <rect x="50" y="80" width="200" height="50" fill="#b2dfdb" rx="6" ry="6" />
  <text x="150" y="110" font-size="14" fill="#004d40" text-anchor="middle">API-Routen & Controller</text>
  <rect x="50" y="150" width="200" height="50" fill="#80cbc4" rx="6" ry="6" />
  <text x="150" y="180" font-size="14" fill="#004d40" text-anchor="middle">Wetterservice & Cache</text>
  <rect x="50" y="220" width="200" height="50" fill="#4db6ac" rx="6" ry="6" />
  <text x="150" y="250" font-size="14" fill="#004d40" text-anchor="middle">MongoDB (Widgets)</text>
  <!-- External API -->
  <rect x="400" y="230" width="160" height="50" fill="#fff9c4" stroke="#fbc02d" stroke-width="2" rx="8" ry="8" />
  <text x="480" y="260" font-size="14" fill="#f57f17" text-anchor="middle">Externe Wetter-API</text>
  <!-- Frontend Box -->
  <rect x="320" y="20" width="260" height="180" fill="#e3f2fd" stroke="#1976d2" stroke-width="2" rx="10" ry="10" />
  <text x="450" y="50" font-weight="bold" font-size="18" fill="#0d47a1" text-anchor="middle">Frontend (Next.js + React)</text>
  <rect x="350" y="90" width="200" height="60" fill="#90caf9" rx="6" ry="6" />
  <text x="450" y="125" font-size="14" fill="#0d47a1" text-anchor="middle">Dashboard + Widgets UI</text>
  <!-- Arrows -->
  <!-- Frontend to Backend -->
  <line x1="280" y1="110" x2="320" y2="120" stroke="#000" stroke-width="2" marker-end="url(#arrow)" />
  <text x="300" y="100" font-size="12" fill="#000" text-anchor="middle">API Calls</text>
  <!-- Backend to External API -->
  <line x1="250" y1="255" x2="400" y2="255" stroke="#000" stroke-width="2" marker-end="url(#arrow)" />
  <text x="325" y="245" font-size="12" fill="#000" text-anchor="middle">Wetterdaten anfragen</text>
  <!-- Backend to MongoDB -->
  <line x1="150" y1="270" x2="150" y2="300" stroke="#000" stroke-width="2" marker-end="url(#arrow)" />
  <rect x="85" y="300" width="130" height="40" fill="#c8e6c9" stroke="#388e3c" stroke-width="2" rx="8" ry="8" />
  <text x="150" y="325" font-size="14" fill="#2e7d32" text-anchor="middle">MongoDB Server</text>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#000" />
    </marker>
  </defs>
</svg>

## Datenfluss
1. Frontend lädt Widgetliste vom Backend.

2. Für jedes Widget werden aktuelle Wetterdaten vom Backend abgefragt.

3. Backend prüft den Cache, falls vorhanden, liefert die gecachten Daten, sonst ruft es die externe Wetter-API auf, speichert die Daten im Cache und sendet sie an das Frontend.

4. Nutzer können neue Widgets hinzufügen oder löschen, was zu API-Aufrufen an das Backend führt.

## Wichtige Technologien
* Node.js & Express: Server, API-Routing, Caching und MongoDB-Anbindung

* MongoDB & Mongoose: Speicherung der Widgetdaten

* Next.js & React: Frontend-Framework für SPA mit Server-Side-Rendering (SSR)

* TypeScript: Typensicherheit im Frontend

* Tailwind CSS: Utility-First CSS Framework für schnelles Styling

* Fetch API: Clientseitige API-Aufrufe im Frontend