# ASIA MART — Abnahmeunterlagen für die interaktive Kundenvorschau
Stand: 12.11.2026 · selbstständige Demo-Marke · keine Live-Handelsplattform

## Ziel und Abgrenzung
Das Ziel dieses Arbeitspakets ist eine Präsentationsqualität, bei der ein potenzieller Händler das geplante Einkaufserlebnis, die wichtigsten Serviceprozesse und die vorgesehene Verwaltungsoberfläche nachvollziehen kann. Es ist **keine** fertige Produktionslösung. Eine Bewertung "10/10" ist subjektiv und kann nur durch eine Abnahme mit dem Kunden erfolgen.

## Funktionsprüfung für die Kundenpräsentation
- [x] 150 unterschiedliche fiktive Artikel in sechs Warengruppen
- [x] Separat aufrufbare, teilbare Produktdetailseiten unter ?produkt=n###
- [x] Produktseiten mit Beschreibung, Demo-Herkunft, Artikelnummer, Zutaten, Allergenen, Nährwerten, Preis, Grundpreis, Menge und Produktvorschlägen
- [x] Eigenständiges Sortiment unter ?seite=sortiment mit Kategorie, Marke, Herkunft, Preisfilter, Sortierung und Ladefunktion
- [x] Direkt aufrufbare Kategorieseiten unter ?kategorie=... und Suchergebnisse unter ?suche=...
- [x] Mobile Suchvorschläge ohne Seitenhöhen-/Scroll-Sprünge
- [x] Warenkorb, Mengenänderung, lokal gespeicherte Merkliste, Versandkosten-Beispiel und gezielte Zusatzempfehlungen
- [x] Beispielaktionscode WILLKOMMEN5 (keine echte Werbeaktion)
- [x] Simulierter Gast-Checkout mit Versand- und Zahlungsmethodenauswahl, optionaler Testdaten-Autofill-Funktion und Demo-Bestellvorschau
- [x] Abholung als Option ohne erforderliche Lieferadresse
- [x] Hilfe & FAQ (8 Themen), Versandbeispiele und Kontakt-/Filial-Konzeptseiten
- [x] Transparente Händler-Demo unter ?seite=verwaltung: Produkte mit Preisen/Beständen ändern, Musteraufträge, Statuswechsel, CSV-Beispielexport und lokales Zurücksetzen
- [x] Lokale Änderungen der Demo-Preise/Bestände auf den Produktseiten sichtbar
- [x] Responsive Ansichten und mobile untere Shopnavigation
- [x] Keine echten Zahlungen, Aufträge oder versendeten E-Mails; Kundendaten werden nicht dauerhaft gespeichert
- [x] Keine extern geladenen Google-Schriften
- [x] Impressum/Datenschutz des **späteren Kunden** bewusst noch nicht erfunden oder integriert

## Demo-Routen
- ./ — Startseite
- ?seite=sortiment — Produktliste
- ?kategorie=Reis%20%26%20Nudeln — Kategorie
- ?suche=Nudeln — Suchergebnisse
- ?produkt=n023 — Beispiel-Produktdetails
- ?seite=hilfe — FAQ
- ?seite=versand — Versand
- ?seite=kontakt — Kontakt / Filial-Konzept
- ?seite=ueber-uns — Konzept
- ?seite=verwaltung — vollständig fiktiver Administrationsmodus

## Technische und qualitative Sicherungen
- Reines HTML/CSS/JavaScript, keine Build-Abhängigkeit im ausgelieferten Webordner
- Öffentliche Vorschau bei GitHub Pages als statische Website
- Produkt-/Admin-Links sind direkte URLs mit Query-Parametern und bei Browser-Neuladen aufrufbar
- Lokale Speicherung nur von Demo-Warenkorb, Merkliste und beispielhaften Händleränderungen; keine Anmeldung, kein Serverbackend
- robots: noindex, nofollow, noarchive
- Eigene fiktive Shopmarke und fiktiver Katalog, keine kopierten Produktbilder/-informationen der Konkurrenz
- Prüfscripts im Projekt: node qa.cjs (Abnahme, Checkout, mobile Suche, relevante Suchtreffer)

## Noch vor echtem Verkauf erforderlich (bewusst nicht Bestandteil der Vorschau)
1. Zustimmung, Marke, CI, Produktfotos und Original-Stammdaten des Kunden
2. Warenwirtschaft/ERP, Produktpflege-Rechte, Datenbank, Lagerabgleich und Bestellübersicht
3. Echte Anbindung eines Zahlungsdienstleisters, sichere Verarbeitung, Zahlungsstatus und Rechnungswesen
4. Liefergebiet und Versandpartner, Etiketten/Tracking, Kühl- und Tiefkühlkette, Lieferkosten- und Steuerlogik
5. Geprüfte Angaben nach LMIV (z.B. Herkunft, Verantwortlicher, allergene Zutaten, Nährwerte, Füllmenge, relevante Zubereitungs-/Lagerungsinformationen)
6. Korrekte Verbraucher- und Preisangaben (PAngV), Rechtstexte, Datenschutz, Widerruf/Retouren und ggf. weitere produkt-/shopbezogene Pflichten
7. Echte Produkt- und Kategorieseiten mit SEO-Konzept, Sitemap und strukturierten Daten für die Produktionsdomain
8. Backup, Monitoring, Rechteverwaltung, Sicherheitskonzept, Leistungs- und Barrierefreiheitstests, Wartungsvertrag, Schulung und dokumentierte finale Abnahme
9. Umsatzoptimierung nur auf echten Daten und unter Berücksichtigung der Deckungsbeiträge. Keine Umsatzgarantie.

## Wichtiger Hinweis zur aktuell öffentlichen Vorschau
Eine frei erreichbare, für geschäftliche Akquise genutzte Demo kann eigenständige Betreiber-Informationspflichten auslösen. Die **Rechtstexte des Kunden** können nach Vertragsannahme erstellt werden. Die **Betreiberpflichten der jetzt öffentlichen Demo** sind davon getrennt zu prüfen, insbesondere nach § 5 DDG. Bis die Prüfung erfolgt ist: keine echten personenbezogenen Kundendaten erfassen.

## Methodik / Referenzen
- Go Asia, NikanKitchen und andere Asia-Supermarkt-Shops: Nutzerführung, Produktkategorien, Produktlisten, Inspiration. Eigenständige Umsetzung ohne Designkopie.
- Baymard Institute: Product Listing UX, Filter-/Sortierungsklarheit, Guest Checkout und Produktdetail-Usability.

## Ergänzung aus sieben Wettbewerbern (12.11.2026)
Neu: Unterkategorien mit direkt teilbaren Filter-URLs, sechs Startseiten-Einstiege, drei einzeln auswählbare Einkaufslisten mit dynamischen Summen und eine separate Frische-/Tiefkühl-Konzeptseite. Produktseiten zeigen Lager-/Transporthinweise. Alles bleibt fiktiv und ohne echte Bestellverarbeitung.

Siehe research/7-Shops-Vergleich_2026-11-12.md. In der lokalen QA ist extensions-qa.cjs enthalten.
