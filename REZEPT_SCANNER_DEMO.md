# ASIA MART — Rezept-Scanner (Demo, 13.11.2026)

## Funktionsumfang

- Seite: `?seite=rezeptscanner`, zusätzlicher Einstieg über Shop-Navigation, Homepage und Kochideen.
- Per Drag & Drop, Dateiauswahl oder Einfügen aus der Zwischenablage werden Rezept-Screenshots angenommen (PNG, JPEG, WEBP, BMP, bis 10 MB).
- Tesseract.js 7 mit deutschen und englischen Sprachdaten führt OCR im Browser durch. Alle Assets werden von der eigenen Demo-Seite geladen; die Bilder werden nicht an Drittdienste gesendet.
- Alternativ kann eine Zutatenliste direkt eingefügt oder der erkannte OCR-Text bearbeitet werden.
- Bei vollständigen Rezeptseiten liest die OCR Wortpositionen (TSV) und identifiziert gezielt den Bereich unter **„Zutaten“**. Zubereitungsspalten, Navigation, Werbetexte und „Jetzt bestellen“-Schaltflächen werden nicht als Zutaten übernommen.
- Wird kein eindeutiger Zutatenbereich erkannt, bleibt der Warenkorb unverändert. Der Nutzer kann einen enger auf die Zutatenliste zugeschnittenen Screenshot verwenden oder die Zutaten im Textfeld korrigieren.
- Der Scanner ordnet Zutaten anhand konservativer, kuratierter Namen/Synonyme den 150 fiktiven Shop-Artikeln zu. Unsichere Vorschläge und nicht verfügbare Zutaten werden getrennt angezeigt.
- Bei Gramm/Millilitern wird die benötigte **Anzahl ganzer Packungen** aufgerundet (z. B. 800 ml Kokosmilch bei 400-ml-Dosen = 2 Dosen). Bei EL/TL oder fehlenden Mengen wird eine Packung **als Schätzung** vorgeschlagen.
- Sichere verfügbare Treffer werden standardmäßig sofort in den lokalen Demo-Warenkorb übernommen. Der Automatismus lässt sich vor dem Scan abschalten. Eine unveränderte Zutatenliste wird nicht mehrfach automatisch hinzugefügt.
- Keine echten Bestellungen, Zahlungen oder Kundendatenverarbeitung.

## Bewusste Grenzen

- Die Erkennung hängt von Auflösung, Sprache, Schrift und Qualität des Screenshots ab. OCR-Ergebnisse können Fehler enthalten; der Text ist editierbar.
- Seiten mit mehreren Zutatenbereichen, außergewöhnlichem Layout oder fehlender Zutatenüberschrift benötigen eventuell einen zugeschnittenen Screenshot. Die visuelle Spaltenerkennung ist eine konservative Heuristik und keine vollständige semantische KI-Bildanalyse.
- Das Demo-Sortiment enthält nur 150 fiktive Artikel. Frische Kräuter, Gemüse, Fleisch und andere Zutaten fehlen teils. Diese Artikel werden **nicht durch unpassende Waren ersetzt**.
- Mengen in Löffeln, Stück oder Packungen sind ohne produktspezifische Umrechnungsregeln nicht auf ein exaktes Gewicht bzw. Volumen umrechenbar.
- Bereits vorhandene Warenkorbartikel bleiben erhalten. Der Scanner ergänzt zusätzliche Mengen.
- Nutzer sollten Produktzutaten, Allergene, Kühlhinweise und tatsächlich benötigte Mengen vor einer echten Bestellung prüfen.
- Ein Link zu beliebigen Rezeptwebseiten kann nicht ohne weiteres automatisiert eingelesen werden: Viele Seiten verhindern fremdes Auslesen technisch oder rechtlich. Hier ist der Screenshot bzw. die eingefügte Zutatenliste der vorgesehene Weg.

## Prüfung

`node recipe-scanner-qa.cjs` startet einen lokalen Test-Webserver und prüft Parsing, Packungsrechnung, Demo-Warenkorb, Verhinderung doppelter Übernahme, mobile Breite und echte OCR-Erkennung eines generierten Bildes. Der Test stellt sicher, dass beim OCR-Lauf keine Drittanbieter-Anfragen abgehen.

`node qa.cjs` prüft die fünf bestehenden Shop-Testgruppen auf Regressionen.

## Bibliotheken & Lizenzen

OCR: [naptha/tesseract.js](https://github.com/naptha/tesseract.js), Version 7.0.0, Apache-2.0; [naptha/tesseract.js-core](https://github.com/naptha/tesseract.js-core), Version 7.0.0, Apache-2.0; Sprachmodelle `@tesseract.js-data/deu` und `@tesseract.js-data/eng`, Version 1.0.0, MIT-Lizenz laut npm-Metadaten. Lizenztexte und Bundler-Notizen liegen unter `assets/ocr/`.

Die Demo verwendet ausschließlich kostenlose, lokal eingebundene Open-Source-Bibliotheken. Für einen produktiven Shop müssen die Rechtsgrundlagen und Produktdaten gesondert geprüft werden.
