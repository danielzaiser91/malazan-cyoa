/**
 * Graph-Auswertung ueber dem Content: Erreichbarkeit, Kanten, Spalten-Layout,
 * Abdeckung. Rein und DOM-frei — der Flowchart-View rendert nur, was hier
 * berechnet wurde, und die Validierungs-Suite prueft dasselbe Ergebnis.
 */

import type { BookId, SceneId } from './types.ts'
import type { Registry } from './registry.ts'
import type { MetaState } from './state.ts'

export interface Edge {
  from: SceneId
  to: SceneId
  /** ID der Auswahl, oder `undefined` bei einem einfachen `goto`. */
  choiceId?: string
}

/** Alle gerichteten Kanten eines Buches. */
export function edgesOf(reg: Registry, bookId: BookId): Edge[] {
  const edges: Edge[] = []
  for (const scene of reg.scenesOf(bookId)) {
    if (scene.exit.type === 'goto') edges.push({ from: scene.id, to: scene.exit.to })
    else if (scene.exit.type === 'choice') {
      for (const c of scene.exit.choices) {
        edges.push({ from: scene.id, to: c.to, choiceId: c.id })
        if (c.check) edges.push({ from: scene.id, to: c.check.fail, choiceId: c.id })
      }
    }
  }
  return edges
}

/** Von der Buch-Eingangsszene aus erreichbare Szenen — ohne Bedingungen zu pruefen. */
export function reachable(reg: Registry, bookId: BookId): Set<SceneId> {
  const book = reg.book(bookId)
  const seen = new Set<SceneId>()
  if (!book) return seen
  const stack: SceneId[] = [book.entry]
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    const scene = reg.scene(id)
    if (!scene) continue
    for (const to of reg.targetsOf(scene)) if (!seen.has(to)) stack.push(to)
  }
  return seen
}

/** Szenen, die es gibt, die aber niemand erreichen kann. */
export function orphans(reg: Registry, bookId: BookId): SceneId[] {
  const live = reachable(reg, bookId)
  return reg.scenesOf(bookId).map(s => s.id).filter(id => !live.has(id))
}

/** Kanten, die auf eine nicht existierende Szene zeigen. */
export function danglingEdges(reg: Registry, bookId: BookId): Edge[] {
  return edgesOf(reg, bookId).filter(e => !reg.scene(e.to))
}

/**
 * Szenen, von denen aus kein Terminal (Ende oder Game Over) erreichbar ist —
 * also Schleifen ohne Ausgang. Rueckwaerts-Erreichbarkeit von allen Terminals.
 */
export function noExitScenes(reg: Registry, bookId: BookId): SceneId[] {
  const scenes = reg.scenesOf(bookId)
  const incoming = new Map<SceneId, SceneId[]>()
  const terminals: SceneId[] = []
  for (const s of scenes) {
    if (s.exit.type === 'gameover' || s.exit.type === 'ending') terminals.push(s.id)
    for (const to of reg.targetsOf(s)) {
      const list = incoming.get(to) ?? []
      list.push(s.id)
      incoming.set(to, list)
    }
  }
  const canFinish = new Set<SceneId>(terminals)
  const stack = [...terminals]
  while (stack.length) {
    const id = stack.pop()!
    for (const from of incoming.get(id) ?? []) {
      if (!canFinish.has(from)) { canFinish.add(from); stack.push(from) }
    }
  }
  return scenes.map(s => s.id).filter(id => !canFinish.has(id))
}

/** Wie viel Prosa unter einer Szene haengt — fuer die Pfad-Balance-Pruefung. */
export function subtreeWords(
  reg: Registry,
  start: SceneId,
  wordsOf: (sceneId: SceneId) => number,
  stopAt: Set<SceneId>,
): number {
  const seen = new Set<SceneId>()
  const stack = [start]
  let total = 0
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    total += wordsOf(id)
    if (stopAt.has(id)) continue
    const scene = reg.scene(id)
    if (!scene) continue
    for (const to of reg.targetsOf(scene)) if (!seen.has(to)) stack.push(to)
  }
  return total
}

/** Alle Konvergenz-Szenen — die Bottlenecks, an denen die Zweige zusammenlaufen. */
export function convergences(reg: Registry, bookId: BookId): SceneId[] {
  return reg.scenesOf(bookId).filter(s => s.kind === 'convergence').map(s => s.id)
}

export interface Coverage {
  scenesSeen: number
  scenesTotal: number
  pagesRead: number
  pagesTotal: number
  endingsFound: number
  endingsTotal: number
  cardsFound: number
  cardsTotal: number
  codexFound: number
  codexTotal: number
  /** Anteil gelesener Seiten, 0..1 — die Zahl fuer die Abdeckungsleiste. */
  ratio: number
}

export function coverage(reg: Registry, bookId: BookId, meta: MetaState): Coverage {
  const scenes = reg.scenesOf(bookId)
  const pagesTotal = scenes.reduce((n, s) => n + s.pages.length, 0)
  const pageIds = new Set(scenes.flatMap(s => s.pages.map(p => p.id)))
  const pagesRead = meta.pagesRead.filter(p => pageIds.has(p)).length
  const scenesSeen = scenes.filter(s => meta.scenes[s.id]?.reached).length
  const endingsTotal = reg.endingsOf(bookId).length
  return {
    scenesSeen,
    scenesTotal: scenes.length,
    pagesRead,
    pagesTotal,
    endingsFound: meta.endings.length,
    endingsTotal,
    cardsFound: meta.cards.length,
    cardsTotal: reg.pack.cards.length,
    codexFound: meta.codex.length,
    codexTotal: reg.pack.codex.length,
    ratio: pagesTotal === 0 ? 0 : pagesRead / pagesTotal,
  }
}
