# ASIA MART — eigenständige Asia-Supermarkt-Demo

Interaktiver, **fiktiver** Shop-Prototyp zur Kundengewinnung, kein rechtlich oder technisch betriebsbereiter Onlineshop. Kein echtes Payment, keine Kundendaten, kein Live-Versand.

## Lokal starten
Doppelklick auf \`START_PREVIEW.bat\` oder \`index.html\`. Alle Seiten verwenden Query-Parameter der selben HTML-Datei und funktionieren auch lokal.

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

## Rechtliche Trennung
Kundenindividuelle Impressums-, Datenschutz-, Liefer- und Produktpflichtangaben werden nach Freigabe ergänzt. Die bereits öffentlich gehostete Demo kann **eigene Betreiberpflichten** haben; das muss unabhängig davon geprüft werden.

Projektdaten und Tests sind ausschließlich im Ordner \`AsiaMarkt_Shop_Demo_2026-11-04\` abgelegt. Andere Projekte sind unberührt.

## Ergänzung aus sieben Wettbewerbern (12.11.2026)
Neu: Unterkategorien mit direkt teilbaren Filter-URLs, sechs Startseiten-Einstiege, drei einzeln auswählbare Einkaufslisten mit dynamischen Summen und eine separate Frische-/Tiefkühl-Konzeptseite. Produktseiten zeigen Lager-/Transporthinweise. Alles bleibt fiktiv und ohne echte Bestellverarbeitung.

Siehe research/7-Shops-Vergleich_2026-11-12.md. In der lokalen QA ist extensions-qa.cjs enthalten.
