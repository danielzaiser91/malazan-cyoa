# Archiv — Paran-Referenzen mit dem alten Anker, 31.07.2026

Erzeugt mit dem **vollen** `STYLE_ANCHOR` statt dem reduzierten `REFERENCE_ANCHOR`.
Zwei Fehler, beide sichtbar:

1. `figures small against architecture and sky` zog Mauern und Landschaft in einen Hintergrund,
   der laut Prompt `plain flat background` sein sollte. Der Szenen-Anker ist für ein Porträt der
   falsche Auftrag.
2. `generous empty margin at the frame edge` erzeugte gefälschte Künstlersignaturen — in
   `paranChild-1` unten links, in `paranChild-3` gleich zweimal.

Beides ist behoben (Anker Y, eigener `REFERENCE_ANCHOR`). Diese drei Bilder bleiben als Beleg
liegen und werden **nicht** als Referenz benutzt.
