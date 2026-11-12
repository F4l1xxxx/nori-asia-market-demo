# ASIA MART – Wettbewerbsvergleich: sieben weitere Shops
Stand: 12.11.2026 | Ziel: öffentliche Shopfunktionen analysieren und originell für eine fiktive Präsentationsdemo umsetzen.

## Grenzen
Keine Übernahme fremder Designs, Bilder, Marken, Texte, Quellcodes, Produktbewertungen oder echter Händlerdaten. Demodaten bleiben als fiktiv gekennzeichnet. Alle zukünftigen Liefer- und Rabattversprechen benötigen die Händlerfreigabe.

## Einzelanalyse

### 1. Tains / Mein-Asiamarkt
Referenz: https://www.mein-asiamarkt.de/
Sichtbar: Hauptnavigation, Warenbereiche, Angebote, Rezepte, Filialen, Kontakt und Community-/App-Bezug.
Ableitung: Ein stationärer Händler braucht zusätzlich zu Produktseiten eine Filial- und Informationswelt. Unsere Demo enthält Kontakt-/Filial-Konzept und jetzt thematische Kochideen. App- und Community-Integration bewusst nicht ohne Bedarf erfunden.

### 2. MAM-Shop / Modern Asia Market
Referenz: https://mam-shop.de/
Sichtbar: Tief gegliederte Warengruppen, etwa Instantnudeln, Unterarten von Snacks, Tee, Saucen, Reis/Wrapper. Themensets, Bundle-Angebote, Vorratspackungen und eine stark produktfokussierte Startseite.
Ableitung: Hauptmangel bei uns war fehlende Warengruppen-Tiefe und das Fehlen kombinierbarer Einkaufssets. Umgesetzt: Unterkategorien und drei selbstständige Einkaufslisten. Keine erfundenen Mengenrabatte, Set-Rabatte oder falsche Vergleichspreise.

### 3. Asienmarkt Online
Referenz: https://asienmarkt.online/de
Sichtbar: EU-Versandinformationen, Deutschland-Schwelle, lokale Same-Day-Option und Abholung für bestimmte Produkte, Sprachauswahl und Bonusbereich.
Ableitung: Regional unterschiedliche Zustellarten sind essenziell, dürfen aber nicht als pauschal verfügbare Leistungen dargestellt werden. Umgesetzt: eigenständige Frische-/Tiefkühl-Versandkonzeptseite und eindeutiger Produktlagerhinweis. Verbindliche Zustellgebiete, Preise, Same-Day, Loyalty, Abholtage und Sprachen nur bei tatsächlicher Händlerfreigabe.

### 4. Asia-In
Referenz: https://www.asia-in.de/
Sichtbar: Datenschutz- und Einwilligungseinstellungen, Weiterleitungen zu Impressum/Datenschutz und Navigation mit Suche.
Ableitung: Datenschutz und Usability sind Pflicht vor Livebetrieb. Unsere Demo lädt keine externen Webfonts, führt keinen Live-Checkout aus und hat eine robuste Suche. Endgültiges Consent-Konzept und juristische Seiten folgen erst mit realen Diensten und Betreiberangaben. Die bereits öffentliche Vorschau benötigt ggf. selbst Betreiberkennzeichnung.

### 5. Asia4Friends
Referenz: https://asia4friends.de/
Sichtbar: Produktgruppen entlang konkreter Küchenwelten, saisonaler Themeneinstieg (Ramen, Kimchi), Grundpreis, Empfehlungen und Serviceversprechen.
Ableitung: Zuhause schnell zum passenden Gericht und den richtigen Produkten zu finden, ist wertvoller als bloße Katalogfülle. Umgesetzt: Direktzugriffe auf relevante Subkategorien, Kochideen und freiwillig kombinierbare Einkaufslisten. Keine künstlichen Bewertungen oder ungeprüften Mengenpreise.

### 6. Asia Markt Wing
Referenz: https://www.asiamarkt-wing.de/
Sichtbar: umfangreiche Sprachauswahl, Zahlungsarten-Werbung, spezielle Nudelgruppen und ausführlichere produktbezogene Beschreibungen.
Ableitung: Breitere Sprachunterstützung kann später sinnvoll sein, aber nur vollständig übersetzt und mit Kundenvorgabe. Der vorhandene Demo-Checkout bleibt klar als nicht angebunden gekennzeichnet. Neue Unterkategorien bieten Detailtiefe bei konkreten Warengruppen.

### 7. Vinh-Loi
Referenz: https://www.vinhloi.de/
Sichtbar: stationärer Handelsfokus, Frische-/Sortimentsschwerpunkte, Filial- und Öffnungszeiten statt durchgängiger Online-Shopfunktion.
Ableitung: Für Handelsketten mit Filialen sind Kühlware und Filialservices wichtig. Eine eigenständige Frische-/Versandkonzeptseite erklärt, was später tatsächlich integriert werden muss; es werden keine erfundenen Adressen oder Öffnungszeiten veröffentlicht.

## Direkt umgesetzte Änderungen
- [x] Sechs sichtbare Unterkategorie-Schnelleinstiege auf der Startseite
- [x] Unterkategorie-Navigation und Filter im Online-Sortiment, inklusive Deep Links wie ?kategorie=Reis%20%26%20Nudeln&typ=Ramen%20%26%20Instantnudeln
- [x] Sortiments-Kategorien weiterhin durchsuch- und filterbar nach Marke, Herkunft, Preis und Sortierung
- [x] Drei eigenständige, teilbare Kochideen-/Einkaufslisten: Sushi, Ramen, Thai-Curry (?seite=kochideen)
- [x] Pro Einkaufsset einzelne Artikel per Checkbox an- oder abwählen; Summe wird vor dem Hinzufügen neu berechnet
- [x] Nur bewusst ausgewählte Positionen gelangen in den Demo-Warenkorb; keine erzwungenen Zugaben und keine rabattbezogenen Täuschungen
- [x] Eigenständige Frische-, Kühl- und Tiefkühl-Versandkonzeptseite (?seite=frische)
- [x] Lager-/Transporthinweis auf jeder Produktdetailseite, spezielle Kennzeichnung für Tiefkühlartikel
- [x] Keine echte Bestellung, Bezahlung, Lager- oder Kühlkettensteuerung behauptet

## Bewusst nicht ohne Kundenangaben umgesetzt
Mehrsprachiger produktiver Shop; Kundenpunkte/Abo-System; Filialadressen, Öffnungszeiten und regionale Lieferzeiten; echte Treueaktionen; Kühlversand; Live-Bewertungen; Echtzeit-Lager; verbindliche Rabatte und Gutscheine; echte Lieferdienst-/Zahlungsanbieter. Diese Elemente sind kunden- und geschäftsmodellabhängig, deshalb nicht als angeblich fertig beworben.

## Tests
- extensions-qa.cjs: Startseiten-Einstiege, Filter, Deep Links, abwählbare Sets, Summen, Warenkorb, TK-Hinweis und mobile Layouts
- buyer-acceptance-qa.cjs: bestehende Bestell-, Katalog-, Produkt- und Händler-Demo
- checkout-qa.cjs: simulierte Gastbestellung und Datenschutzgrenzen
- search-mobile-qa.cjs: Stabile Suche bei Texteingabe und Löschungen
- search-relevance-qa.cjs: Produktrelevanz der Suchergebnisse

## Abnahme
Der Ausbau verbessert die Kundenvorschau, ersetzt aber nicht die zukünftige produktive Shop-Infrastruktur. Die rechtlichen Pflichten und der betriebsbereite Checkout müssen nach Auftragserteilung auf Grundlage der echten Händlerdaten umgesetzt und fachlich geprüft werden.
