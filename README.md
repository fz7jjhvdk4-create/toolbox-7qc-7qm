# Verktygslådan – 7QC & 7QM

En interaktiv webbapplikation för studenter som lär sig **de sju förbättringsverktygen (7QC)** och **de sju ledningsverktygen (7QM)** inom kvalitetsutveckling.

## Så kör du appen

**Enklast:** dubbelklicka på `index.html` – appen öppnas direkt i webbläsaren. Inget behöver installeras.

**Eller med en lokal server** (rekommenderas):

```bash
cd "Toolbox 7QC 7QM"
python3 -m http.server 8734
```

Öppna sedan [http://localhost:8734](http://localhost:8734) i webbläsaren.

## Innehåll

- **14 verktygssidor** – varje verktyg har: vad/varför, steg-för-steg-guide, en **interaktiv demo** att klicka på, vanliga fallgropar samt en snabbkoll-fråga.
- **🧭 Vilket verktyg?** – en guide som utifrån dina svar pekar ut rätt verktyg (numerisk data → 7QC, verbal data → 7QM).
- **🎯 Quiz** – 12 scenariofrågor: vilket verktyg passar situationen?

### 7QC – De sju förbättringsverktygen (numerisk data)
1. Datainsamling (streckdiagram) · 2. Histogram · 3. Paretodiagram · 4. Ishikawadiagram · 5. Uppdelning (stratifiering) · 6. Sambandsdiagram · 7. Styrdiagram

### 7QM – De sju ledningsverktygen (verbal data)
1. Släktskapsdiagram · 2. Relationsdiagram · 3. Träddiagram · 4. Matrisdiagram · 5. Matrisdataanalys · 6. Processbeslutsdiagram (PDPC) · 7. Pildiagram

## Teknik

Ren HTML/CSS/JavaScript utan ramverk eller byggsteg – tre filer: `index.html`, `styles.css`, `app.js`. Alla diagram ritas som SVG direkt i koden. Typsnitten (Fraunces + Atkinson Hyperlegible) hämtas från Google Fonts men appen fungerar även offline med reservtypsnitt.
