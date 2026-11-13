# ASIA MART — eigenständige Asia-Supermarkt-Demo

Interaktiver, **fiktiver** Shop-Prototyp zur Kundengewinnung, kein rechtlich oder technisch betriebsbereiter Onlineshop. Kein echtes Payment, keine Kundendaten, kein Live-Versand.

## Lokal starten
Doppelklick auf \`START_PREVIEW.bat\`. Dadurch startet ein kleiner Node-HTTP-Server auf einem freien lokalen Port und öffnet die Demo im Browser. Alle Seiten nutzen Query-Parameter derselben HTML-Datei. Die meisten Seiten lassen sich zusätzlich direkt als \`index.html\` öffnen; **der Rezept-Scanner benötigt HTTP**, damit seine OCR-WebWorker und Sprachdateien laden können.

## Kundenvorschau
- **150 Musterartikel** mit Demo-Nährwerten und markiert fiktiven Informationen
- **Produktdetails mit eigener URL**, Mengenwahl und sinnvoll ergänzenden Zutaten
- **Separates Sortiment** mit Filtern nach Warengruppe, Marke, Herkunft und Preis, Sortierung und Paginierung
- **Mobile Produktsuche**, Merkliste, Warenkorb und Kaufprozess als Simulation
- **Gast-Checkout** mit Beispielfeldern, Versandarten, Zahlungsmethoden und Bestellvorschau, ohne echte Bestellung
- **FAQ, Versand, Kontakt und Konzeptseiten**
- **Händler-Demo** \`?seite=verwaltung\`: fiktive Produktpreise und Bestände lokal bearbeiten, Beispielaufträge ansehen, CSV exportieren, Demodaten zurücksetzen
- **Keine externen Schriftanbieter**; lokale Fotos aus frei verfügbaren Bilddatenbanken als eindeutig gekennzeichnete Symbolbilder
- **Mobile Bottom-Navigation** und zugänglichere Bedienelemente

## Qualität
\`node qa.cjs\` führt die wichtigsten E2E- und Mobiltests aus (Puppeteer Core wird nur für lokale QA benötigt).
\`buyer-acceptance-qa.cjs\`, \`checkout-qa.cjs\`, \`search-mobile-qa.cjs\` und \`search-relevance-qa.cjs\` können einzeln gestartet werden.

## Dokumentation
- \`ABNAHME_DEMO_2026-11-12.md\`: Abnahmekriterien, vollständige Scope-Abgrenzung und späterer Live-Ausbau
- \`research/GoAsia_Referenzanalyse_2026-11-12.md\`: Vergleich und UX-Ableitungen

## Rezept-Scanner (13.11.2026)
\`?seite=rezeptscanner\`: Screenshot per Drag & Drop, Dateiauswahl oder Zwischenablage hochladen. Deutsche und englische Texterkennung läuft mit lokal eingebundener Tesseract.js-Bibliothek im Browser. Sichere Produktzuordnungen werden auf vollständige Packungen hochgerechnet und optional automatisch in den Demo-Warenkorb gelegt; unsichere und fehlende Zutaten werden gekennzeichnet. Die Bilddaten verlassen den Browser nicht. Ein Testrezept und manuelle Textkorrektur stehen bereit.

Die neue Prüfung \`recipe-scanner-qa.cjs\` testet echte OCR, Mengenumrechnung, Warenkorb, Doppelklickschutz und mobile Darstellung. Details unter \`REZEPT_SCANNER_DEMO.md\`.

## Rechtliche Trennung
Kundenindividuelle Impressums-, Datenschutz-, Liefer- und Produktpflichtangaben werden nach Freigabe ergänzt. Die bereits öffentlich gehostete Demo kann **eigene Betreiberpflichten** haben; das muss unabhängig davon geprüft werden.

Projektdaten und Tests sind ausschließlich im Ordner \`AsiaMarkt_Shop_Demo_2026-11-04\` abgelegt. Andere Projekte sind unberührt.

## Ergänzung aus sieben Wettbewerbern (12.11.2026)
Neu: Unterkategorien mit direkt teilbaren Filter-URLs, sechs Startseiten-Einstiege, drei einzeln auswählbare Einkaufslisten mit dynamischen Summen und eine separate Frische-/Tiefkühl-Konzeptseite. Produktseiten zeigen Lager-/Transporthinweise. Alles bleibt fiktiv und ohne echte Bestellverarbeitung.

Siehe research/7-Shops-Vergleich_2026-11-12.md. In der lokalen QA ist extensions-qa.cjs enthalten.
