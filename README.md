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

Die GitHub-Actions-Pipeline in [`.github/workflows/website.yml`](./.github/workflows/website.yml) prüft und baut die Website bei Pull Requests und Änderungen an `main`. Der Deploy-Job veröffentlicht nach erfolgreichem Build auf GitHub Pages, sobald die Repository-Variable `ENABLE_PUBLIC_DEPLOY` auf `true` gesetzt und in den Repository-Einstellungen **Pages → Source: GitHub Actions** gewählt wurde. Für GitHub Pages setzt der Build automatisch den Basispfad `/consulting_webpage`.

Die öffentliche Veröffentlichung bleibt vorerst deaktiviert, weil E-Mail-Adresse, Impressum und vollständige Datenschutzhinweise noch fehlen. Das Kontaktformular bereitet aktuell eine Anfrage zum Kopieren vor; es versendet keine Daten. Diese Angaben und der Versandweg sollten vor dem Aktivieren des Deploy-Jobs ergänzt und geprüft werden.
