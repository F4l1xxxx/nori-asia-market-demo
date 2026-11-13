# ASIA MART — Rezeptfinder und Warenkorb-Empfehlungen (Demo, 13.11.2026)

## Zweck

Ein Gericht finden und nur passende, tatsächlich geführte Shopartikel in den Warenkorb übernehmen. Den Besucher nicht mit endlosen Produktmarken oder unpassendem Cross-Selling überfordern.

## Bedienung

- Im Bereich **Kochideen** erscheint die Frage „Was stellst du dir für heute vor?“ mit Suche und vier Direktvorschlägen.
- Beim Tippen werden die **12 kuratierten, eigenständig formulierten deutschsprachigen Rezepte** ohne Internetzugriff gefiltert. Zunächst sind nur sechs Karten sichtbar; die weiteren Rezepte erscheinen auf Wunsch.
- Ein Klick auf **„Im Internet suchen“** ruft den freien Demo-Endpunkt `https://www.themealdb.com/api/json/v1/1/search.php?s=…` auf. Der Suchbegriff wird erst nach dieser expliziten Aktion übertragen.
- Geläufige deutsche Gerichte werden für die Datenbank auf ihren internationalen Suchnamen abgebildet, z. B. „Grünes Thai-Curry“ → „Thai Green Curry“. Maximal sechs passende Suchergebnisse sind sichtbar.
- Durch Auswahl eines Online-Ergebnisses werden dessen Zutaten, Mengenangaben und Original-Zubereitungsanleitung geladen. **Online-Rezepte können englischsprachig sein**; ein Quellenlink führt zum Original bei TheMealDB. Die 12 eigenen Rezepte sind deutschsprachig.
- **„Passende Shopzutaten übernehmen“** öffnet den Rezept-Scanner mit einer einmalig übergebenen Zutatenliste. Nur im Sortiment geführte Artikel werden angeboten, Packungszahlen geschätzt/berechnet, nicht passende Ersatzprodukte ausgeschlossen. Nutzer können das Ergebnis vor Kauf prüfen.
- Ein Fehlbild im Scanner kann mit **„Bild entfernen“** wieder gelöscht werden, ohne vorherige Warenkorbartikel zu verlieren.

## Kontextbezogene Warenkorbempfehlungen

- Die Warenkorbempfehlung verwendet den **Gesamtkontext der Produkte**, nicht bloß das zuletzt angeklickte Produkt.
- Für Sushi kommen nur fehlende passende Sushi-Zutaten in Betracht (z. B. Nori, Reisessig, Sojasauce). **Kokosmilch ist keine Sushi-Ergänzung**. Für Curry kann Kokosmilch passend sein, wenn Curry-Paste im Warenkorb liegt.
- Es gibt **keinen pauschalen Fallback** auf beliebige Artikel. Bei fehlendem eindeutigen Kontext oder einer vollständigen passenden Warenkorbgruppe wird keine Empfehlung gezeigt.
- Im Scanner werden maximal drei gleichwertige Marken vorab angezeigt; zusätzliche Varianten bleiben hinter „Weitere Produkte“ verborgen.

## Daten, Kosten und Grenzen

- Die **TheMealDB-Entwicklungs-API mit Schlüssel `1` ist für Entwicklungs-, Bildungs- und Test-Demos gedacht**, nicht als kostenlos zugesicherte Produktionslösung. Vor echtem Kundenbetrieb Nutzungsrechte, API-Zugang, Verfügbarkeit, Datenschutz und ggf. Kosten erneut klären: [API-Dokumentation](https://www.themealdb.com/api.php) · [Nutzungsbedingungen](https://www.themealdb.com/terms_of_use.php).
- Die Online-Suche ist eine **Suche in der Rezeptdatenbank TheMealDB**, keine freie Web-/Google-Recherche. Netzwerkzugriff, CORS und API-Verfügbarkeit sind erforderlich. Fällt der Dienst aus, bleiben alle lokalen Kochideen verfügbar.
- Suchanfragen und für angezeigte Treffer benötigte Rezeptdaten/Bilder werden direkt vom Browser bei TheMealDB abgerufen. Der Nutzer wird vor Auslösen der externen Suche darauf hingewiesen. Beim bloßen Öffnen der Rezeptseite erfolgt keine Drittanfrage.
- Online-Inhalte sind fremde Rezepte und werden mit Quelle ausgewiesen. Maßangaben und Anweisungen werden unverändert aus der Quelle angezeigt. Nur eine kurze Liste bekannter englischer **Zutatenbezeichnungen** wird für den Shopabgleich ins Deutsche übertragen; nicht erkannte Zutaten werden nicht durch erfundene Waren ersetzt.
- Zutaten- und Rezeptdaten sind nicht garantiert vollständig, korrekt oder allergenfrei. Die Demo enthält fiktive Artikeldaten, Preise und Verfügbarkeiten. Keine echten Käufe oder Bezahlungen.
- Bei produktiver Nutzung sollten Rezepte redaktionell geprüft, eine zulässige kommerzielle Datenquelle vertraglich gesichert und Datenschutz- sowie Inhaltsrechte geprüft werden.

## Qualitätssicherung

- `node recipe-discovery-qa.cjs` prüft mit Headless Edge die kurze Standardliste, 12 Kochideen, lokale Suche ohne Third-Party-Aufrufe, Live-Suche (TheMealDB), Quellenlink, Einzelrezept, Übernahme zum Scanner/Warenkorb, Bildentfernung, Sushi ohne Kokosmilch-Empfehlung und eine 390-Pixel-Mobilansicht.
- `node recipe-scanner-qa.cjs` prüft OCR, Matching, Portions-/Packungsmengen, Ersatzprodukte und mobilen Scanner.
- `node checkout-qa.cjs` prüft den vorhandenen Demo-Checkout gegen unbeabsichtigte Regressionen.
