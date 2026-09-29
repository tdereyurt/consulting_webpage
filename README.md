# Tayfun Dereyurt — AI, Data & Digital Transformation

Deutschsprachige Beratungswebsite, umgesetzt mit **Astro 7**, **TypeScript** und statischer Ausgabe. Der Quellcode liegt in [`tayfun-dereyurt/`](./tayfun-dereyurt/).

## Lokal starten

```bash
cd tayfun-dereyurt
npm ci
npm run dev
```

`npm run build` führt die Astro- und TypeScript-Prüfung aus und erzeugt die fertige Website in `dist/`.

## CI/CD

Die GitHub-Actions-Pipeline in [`.github/workflows/website.yml`](./.github/workflows/website.yml) prüft und baut die Website bei Pull Requests und Änderungen an `main`. Bei einem Push auf `main` veröffentlicht sie nach erfolgreichem Build automatisch auf GitHub Pages. In den Repository-Einstellungen ist **Pages → Source: GitHub Actions** ausgewählt. Für GitHub Pages setzt der Build automatisch den Basispfad `/consulting_webpage`.

Die Website ist öffentlich erreichbar. Impressum und Datenschutzhinweise enthalten derzeit deutlich gekennzeichnete Musterangaben; diese müssen vor der geschäftlichen Nutzung durch echte und geprüfte Angaben ersetzt werden. Das Kontaktformular bereitet aktuell eine Anfrage zum Kopieren vor; es versendet keine Daten.
