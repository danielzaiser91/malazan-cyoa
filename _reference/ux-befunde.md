# Bedienung und Spielgefühl — Befunde und Plan

Stand **01.08.2026**, nach der ersten Testrunde am Vertical Slice. Grundlage: das Feedback aus
der Testrunde, eigene Durchsicht der Ansichten, und Lesbarkeitsforschung (Quellen unten).

Diese Datei ist die Arbeitsliste für den Umbau. Was erledigt ist, wandert nach `status.md`.

---

## 1 · Die harte Anforderung: nichts scrollen

**Ab 800 px Höhe und 900 px Breite darf eine Seite nicht scrollen.** Das ist keine Kosmetik: Wer
scrollt, verliert beim Zurückspringen die Stelle, und die Auswahlmöglichkeiten am Seitenende sind
unsichtbar, während man den Text liest — man entscheidet also, ohne die Optionen im Blick zu haben.

### Das Höhenbudget, ausgerechnet

Bei 800 px Fensterhöhe:

| Bereich | Höhe |
|---|---|
| Kopfzeile | 56 |
| Meta-Zeile (Kapitel · Code · Seite) | 24 |
| POV-Zeile | 22 |
| Abstand vor der Auswahl | 24 |
| Auswahl: ein „Weiter" | 48 |
| Auswahl: drei Optionen mit Risiko-Zeile | 170 |
| Sicherheitspuffer | 24 |

Damit bleiben für den Fließtext **600 px** auf einer Seite mit „Weiter" und **480 px** am
Szenenende mit drei Optionen. Bei einer Zeilenhöhe von 27 px sind das 22 beziehungsweise 17
Zeilen; bei den gemessenen ~10 Wörtern je Zeile in der Textspalte also:

- Seite mit „Weiter": **höchstens ~200 Wörter**
- Seite am Szenenende: **höchstens ~160 Wörter**

### Was aktuell dasteht

Gemessen an 56 Seiten (deutsche Fassung): Schnitt 114 Wörter, aber **7 Seiten über 200**, davon
zwei über 250 (`b1.c01.s01.p01` mit 270, `b1.c01.s07.p01` mit 254). Die Wortbänder erlauben bis
**320** — das ist die eigentliche Ursache, nicht der einzelne Ausrutscher.

### Maßnahmen

- **M1** Wortbänder senken: `beat` 50–90, `standard` 90–150, `long` 150–190.
- **M2** Neue Content-Regel samt Test: **Die letzte Seite einer Szene mit mehr als einer Auswahl
  trägt höchstens `standard`.** Dort ist das Budget am kleinsten und die Entscheidung am wichtigsten.
- **M3** Die sieben zu langen Seiten teilen. Neue Seiten brauchen **kein** eigenes Unterkapitel —
  Kapitel und Szenen tragen die Checkpoints, Seiten sind nur Bildschirme. Ein Bild darf mehrere
  Seiten tragen, wo es inhaltlich noch passt; das spart Credits und ist bei einer fortlaufenden
  Szene sogar richtiger als ein Motivwechsel alle 150 Wörter.
- **M4** Ein Test, der aus Wortzahl und Auswahl-Anzahl die geschätzte Höhe rechnet und bei
  Überschreitung fehlschlägt. Sonst wandert das Problem mit dem nächsten Kapitel zurück.

---

## 2 · Kopfzeile: zwei verschiedene Dinge sehen gleich aus

Aktuell stehen sechs gleichrangige Textknöpfe nebeneinander: *Die Auslegung · Marginalien · Blatt ·
Rückschau · Einstellungen · Profile*. Die ersten vier sind **Spielinhalt**, die letzten zwei
**Verwaltung** — dass sie identisch aussehen, ist der Fehler.

- **M5** Aufteilen: Inhalt links als beschriftete Knöpfe, Verwaltung rechts abgesetzt als
  **Symbole ohne Beschriftung** (mit `aria-label` und Tooltip — ein Symbol ohne zugänglichen Namen
  wäre ein Rückschritt gegenüber dem heutigen Stand).
- **M6** Die Verwaltungs-Ecke ist **immer sichtbar**, auch in Unteransichten.
- **M7** Die Meta-Zeile (Kapitel · Code · Seite) gehört zur Orientierung nach oben zur Kopfzeile,
  nicht in den Lesebereich — sie kostet dort Höhe, die der Text braucht.

---

## 3 · Marginalien sind unsichtbar, solange man liest

Der Codex heißt hier *Marginalien* und füllt sich, während man spielt — aber im Fließtext deutet
nichts darauf hin. Wer nicht von sich aus in die Marginalien geht, erfährt nie, dass es sie gibt.

- **M8** **Jede Seite hebt mindestens einen freigeschalteten Marginalien-Begriff im Fließtext
  hervor**, einmal pro Seite, beim ersten Vorkommen. Hervorhebung dezent (unterpunktet), nicht
  wie ein Link im Web.
- **M9** Klick öffnet den zugehörigen Marginalien-Eintrag; Maus darüber zeigt die erste Zeile als
  Tooltip. Tastatur erreichbar, weil es ein echtes Bedienelement ist.
- **M10** Nur **freigeschaltete** Begriffe werden hervorgehoben. Ein Begriff, den man noch nicht
  hat, würde verraten, dass es ihn gibt — das verletzt die Spoiler-Regel, die im Core steht.

---

## 4 · Was mir beim Durchsehen sonst aufgefallen ist

- **M11 Der Lesefluss bricht am Seitenende.** „Weiter" sitzt nach dem Text ganz unten. Sobald
  nichts mehr scrollt (M1–M3), steht er im Blick — dann ist es kein Problem mehr. Vorher schon.
- **M12 Das Bild steht links oben und lässt darunter Leerraum**, während der Text rechts weiterläuft.
  Auf breiten Fenstern verschenkt das Fläche, die der Text bräuchte. Bild und Text sollten dieselbe
  Höhe teilen.
- **M13 Kein sichtbarer Zustand während des Lesens.** Wer sich fragt, wie es um seine Werte steht,
  muss ins *Blatt* wechseln und verliert die Seite. Eine schmale, ruhige Zustandszeile in der
  Kopfleiste würde reichen.
- **M14 Zeilenlänge prüfen.** Forschung: 50–75 Zeichen je Zeile, ~66 optimal. Die Einstellung bietet
  schmal/normal/breit als 45/60/75 Zeichen an — das ist bereits richtig gewählt, sollte aber gegen
  das reale Layout gegengeprüft werden, weil die Textspalte im Zweispalter schmaler ist als `--line-width`
  verspricht.
- **M15 Der Inhaltshinweis erscheint erst beim Start**, nicht beim Laden. Das ist richtig so
  (er gehört vor die Geschichte, nicht vor das Menü) — nur wusste das Screenshot-Werkzeug es nicht.
  Kein Fehler, hier nur festgehalten.

---

## Quellen

- [Optimal Line Length for Readability (UXPin, 2026)](https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/) — 50–75 Zeichen, 66 als Optimum
- [Readability: The Optimal Line Length (Baymard)](https://baymard.com/blog/line-length-readability)
- [Line Width in Digital Typography (Oregon State)](https://blogs.oregonstate.edu/calverta/line-width-in-digital-typography-for-accessibility-and-comprehension/) — kürzere Zeilen helfen dyslektischen Lesern messbar
- [Emily Short zu IF-Oberflächen](https://emshort.blog/category/user-interface/) — Regeln sichtbar machen statt stillschweigend ablehnen; Illustrationen als Informationskanal statt Dekoration
