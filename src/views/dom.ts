/**
 * Winzige Renderschicht. Kein Framework: die App ist ein Textrenderer plus eine
 * SVG-Karte, und ein Framework kauft dafuer nichts und kostet Bundle.
 *
 * Barrierefreiheit ist hier eingebaut, nicht nachgeruestet: `btn` setzt immer
 * einen erreichbaren Namen, `el` nimmt `aria-*` direkt entgegen.
 */

type Attrs = Record<string, string | number | boolean | undefined>

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: (Node | string | undefined | false)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === false) continue
    if (k === 'class') node.className = String(v)
    else if (k === 'text') node.textContent = String(v)
    else if (k === 'html') node.innerHTML = String(v)
    else if (k.startsWith('data') || k.startsWith('aria') || k === 'role') node.setAttribute(k, String(v))
    else if (v === true) node.setAttribute(k, '')
    else node.setAttribute(k, String(v))
  }
  for (const c of children) {
    if (c === undefined || c === false) continue
    node.append(typeof c === 'string' ? document.createTextNode(c) : c)
  }
  return node
}

export function btn(label: string, onClick: () => void, attrs: Attrs = {}): HTMLButtonElement {
  const b = el('button', { type: 'button', ...attrs })
  if (!b.textContent) b.textContent = label
  if (!b.getAttribute('aria-label') && !b.textContent) b.setAttribute('aria-label', label)
  b.addEventListener('click', onClick)
  return b
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild)
}

/** Absaetze aus einem Prosatext mit `\n\n` als Trenner. */
export function paragraphs(text: string, cls = 'p'): DocumentFragment {
  const frag = document.createDocumentFragment()
  for (const part of text.split(/\n{2,}/)) {
    if (!part.trim()) continue
    frag.append(el('p', { class: cls, text: part.trim() }))
  }
  return frag
}

/**
 * Setzt Fokus auf ein Element, ohne die Seite zu scrollen — der Story-View
 * springt sonst bei jedem Seitenwechsel.
 */
export function focus(node: HTMLElement | null): void {
  node?.focus({ preventScroll: true })
}

/** Ein Element, dessen Platz reserviert bleibt (kein Layoutsprung beim Ein-/Ausblenden). */
export function setReserve(node: HTMLElement, show: boolean): void {
  node.style.visibility = show ? 'visible' : 'hidden'
}
