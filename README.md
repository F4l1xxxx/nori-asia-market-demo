# NORI & CO. — eigenständige Asia-Markt Shop-Demo

**Status:** Interaktive Präsentationsfassung, 150 fiktive Artikel, keinerlei echter Verkauf. **Nicht als Live-Shop einsetzen.**

## Start
- Auf Windows START_PREVIEW.bat doppelklicken oder index.html im Browser öffnen.
- Keine Build-Tools, kein Server und kein zahlungspflichtiger Dienst für den Shop nötig.
- Alle Demo-Produkte sind frei erfunden. Preise, Herkunft, Zutaten, Allergene und Nährwerte dienen nur der Funktionserprobung.
- Nur der Warenkorb und die Merkliste werden lokal in diesem Browser gespeichert. Checkout-Eingaben werden nicht übermittelt oder gespeichert.
- Bezahlmethoden sind rein visuelle Auswahl. Kein Payment Provider, keine echte Zahlung, kein Versandauftrag.

## Konkurrenzstudie — funktionale Muster, keine Kopie
Untersucht wurden öffentlich sichtbare Shop-Strukturen, keine proprietären Designs oder Codes:

1. Go Asia (https://goasia.net/de/) — Sortimentsbreite, Kategorien, Produktkarten und Grundpreise.
2. NikanKitchen (https://www.nikankitchen.com/de/) — Premium-Markenwirkung, Themenwelten, Versandversprechen und Inspiration.
3. Asian Food Lovers (https://www.asianfoodlovers.de/) — Angebote, Kategorien, Rezeptideen und größere Einkaufspackungen.
4. Asiafoodland (https://www.asiafoodland.de/) — Warengruppen, Deals, Rezepte und Grundpreise.
5. Baymard (https://baymard.com/research/checkout-usability) — unkomplizierter Checkout und relevante statt aufdringlicher Cross-Sells.

## Geplante Umsatzhebel im Prototyp
- Entdeckung: Hero, Geschmackswelten, thematische Entdeckungslisten.
- Produktsuche: sechs Kategorien, Herkunftsfilter, Volltextsuche, Sortierung und Produktdetails.
- Rezeptbasierte Ergänzung: Ramen- und Sushi-Zutatensets als freiwillige Warenkorb-Aktionen.
- Warenkorb-Ergänzung: freiwillige, kontextuelle Produktvorschläge.
- Versandprogress: Beispielschwelle 49 EUR für kostenlosen Standardversand, erst im Live-Shop wirtschaftlich kalkulieren.
- Demo-Gutschein: WILLKOMMEN5, 5 Prozent Nachlass, ausdrücklich fiktiv.
- Gast-Checkout: Versandoptionen, Zahlungsarten ohne echte Verarbeitung.
- Merkliste: Favoriten lokal im Browser; echtes Kundenkonto erst im späteren Ausbau.

Diese Maßnahmen sind Conversion-Hypothesen, keine garantierten Gewinnsteigerungen.
Später Conversion Rate, durchschnittlichen Warenkorbwert, Netto-Marge nach Rabatt und
Versand, Cross-Sell-Anteil und Wiederkaufrate messen.

## Funktionen
Fertig als Demo: 150 Produkte, Produktinformationen, Filter, Suche, Favoriten,
Warenkorb mit Menge, Rezeptsets, Vorschläge, Demo-Gutschein, Versandsimulation,
Zahlungsarten-Auswahl, Bestellvorschau, responsives Layout.

Nicht vorhanden: echtes Lager/ERP, Kundenkonto, Live-Versand, Live-Zahlung,
Echtzeit-Bestand, geprüfte Lebensmitteletiketten, steuerliche Integration,
Newsletter-Versand, vollständige rechtliche Seiten.

## Vor Inbetriebnahme verbindlich ergänzen
- Art. 14 LMIV: verifizierte Lebensmittelangaben, Zutaten, Allergene,
  Nährwerte, Füllmenge und ggf. Verantwortliche/Ursprung/Anweisungen.
- PAngV: echte Brutto- und Grundpreise, Versand- und Steuerinformationen.
- Impressum nach DDG, Datenschutzerklärung, DSGVO-konforme Verarbeitung,
  Widerrufsbelehrung, verbindliche Kundeninformationen und Bestellbutton.
- Liefergebiete, Kühlkette bei Tiefkühlware, Verpackung, Logistik, Retouren,
  Verfügbarkeit, Reklamationen und verbindliche AGB soweit verwendet.
- Payment-Anbieter, echte Zahlungs- und Steuertests, Sicherheit und Monitoring.
- Rechte und Genauigkeit von Marken, Bildmaterial und Produktdaten prüfen.
- Rechtliche und technische Abnahme vor Livebetrieb.

## Assets
Lifestyle-Fotos aus dem kostenlosen Unsplash-Bilddienst als lokale JPEGs.
Verpackungen, Shopname und Katalog sind eigenständige Illustrationen und Muster,
keine Darstellungen echter Marken oder konkreter Handelsprodukte.

## QA
Headless-Browsertest lokal: node qa.cjs. Testet 150 Produkte, Bilder,
Suche, Details, Warenkorb, Checkout, Desktop/Mobil und JavaScript-Fehler.
Puppeteer Core wird nur als kostenlose Entwicklungshilfe verwendet.

Alle Dateien liegen isoliert in diesem Projektordner.
