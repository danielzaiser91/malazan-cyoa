import { writeFileSync } from 'node:fs'
import type { Plugin } from 'vite'
// `vitest/config` reicht `defineConfig` von Vite durch und kennt zusaetzlich den
// `test`-Block — so bleibt die Konfiguration in EINER Datei und `tsc` ist zufrieden.
import { defineConfig } from 'vitest/config'
import { GAME_VERSION } from './src/core/version.ts'

/**
 * Schreibt beim Build eine `version.json` neben den Bundle. Der Client pollt sie
 * cache-bustend und meldet dem Spieler eine neue Fassung, statt ihn mit einem
 * veralteten Bundle weiterlesen zu lassen. Uebernommen aus `archmage-idle`.
 */
function versionManifest(): Plugin {
  return {
    name: 'version-manifest',
    apply: 'build',
    closeBundle() {
      const build = process.env.GITHUB_SHA?.slice(0, 7) ?? 'local'
      writeFileSync('dist/version.json', JSON.stringify({ version: GAME_VERSION, build }) + '\n')
    },
  }
}

/**
 * `base` NUR im Build: live liegt das Spiel unter
 * danielzaiser91.github.io/malazan-cyoa/ (Unterpfad → Assets brauchen den Prefix),
 * der Dev-Server soll aber weiter direkt auf localhost:5176/ laufen.
 */
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/malazan-cyoa/' : '/',
  server: { port: 5176, strictPort: true },
  plugins: [versionManifest()],
  build: {
    target: 'es2022',
    // Der Bundle-Budget-Check (200 KB gzip) laeuft in `tools/check-budget.mjs`.
    chunkSizeWarningLimit: 300,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
}))
