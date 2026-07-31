# TODO

Kurzliste ausserhalb der Task Queue in `status.md`. Was hier steht, ist bewusst noch keine
Entscheidung.

- [ ] **Projekt ins Portfolio eintragen, sobald sinnvoll** (öffentlich, stabil genug für eine
      kuratierte Beschreibung) — siehe Projects-Daten in
      `C:\code\ai\my website\src\app\data\projects.ts`
      (Repo `danielzaiser91/Portfolio-daniel-zaiser.de`). Dazu der Arcade-Eintrag in
      `src/app/data/games.ts` und ein Preview-Screenshot über `tools/capture-previews.js`.
      Timing, Kategorie und Texte bleiben eine bewusste Entscheidung, keine Automatik.
- [ ] **Eigene Schriftart** selbst hosten (offene Lizenz, kein CDN-Aufruf). Aktuell laufen
      System-Schriften — funktioniert, sieht aber auf jedem Rechner anders aus.
- [ ] **Legasthenie-Schrift** ist derzeit auf Systemschriften abgebildet; eine echte
      OpenDyslexic-Einbindung wäre besser (Lizenz vorher prüfen und in `public/CREDITS.md`
      eintragen).
- [ ] **PWA/Offline-Schicht** ist ausdrücklich Phase E und optional. Falls sie kommt: das
      Update-Banner muss den Service-Worker-Cache mit invalidieren, sonst hängen Spieler auf
      einem alten Build fest.
- [ ] **Umgebungsklang** je Region (Belagerung, Gasse bei Nacht, Gewirr) — die Klangschicht
      synthetisiert bisher nur Ereignis-Töne.
