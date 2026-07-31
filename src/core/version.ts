/**
 * Einzige Quelle der Wahrheit fuer die Spielversion. Wird beim Build in
 * `dist/version.json` geschrieben; der Client vergleicht dagegen und zeigt bei
 * Abweichung das Update-Banner. Vor jedem release-wuerdigen Push hochzaehlen —
 * sonst erkennt das Banner den Deploy nicht als neu.
 *
 * Diese Datei wird auch von `vite.config.ts` (Node-Kontext) importiert und darf
 * deshalb NICHTS ausser einer Konstante enthalten — kein `import.meta.env`, kein DOM.
 * Die Build-Kennung (Commit-SHA) steht zur Laufzeit in `version.json`.
 */
export const GAME_VERSION = '0.1.0'
