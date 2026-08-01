/**
 * Klang. Synthetisiert, keine Asset-Dateien, keine Dependency.
 *
 * Jedes Ereignis der Engine bekommt hier einen eigenen Klang — das ist die
 * hoerbare Haelfte der Regel "keine unsichtbare oder stumme Mechanik". Die
 * sichtbare Haelfte macht `views/feedback.ts`.
 *
 * **Preview-Schutz:** Im Entwicklungs-Build (also auch im Browser-Pane des
 * Claude-Clients) startet der AudioContext NIE von selbst. Er wird erst
 * angelegt, wenn der Spieler den Ton bewusst einschaltet. Im ausgelieferten
 * Spiel ist Ton normal an. Die Regel schuetzt den Nutzer vor dem Agenten, nicht
 * den Spieler vor dem Spiel.
 */

export type Sfx =
  | 'page' | 'scene' | 'choice' | 'locked' | 'stat-up' | 'stat-down'
  | 'item' | 'coin' | 'flag' | 'card' | 'codex' | 'achievement' | 'levelup'
  | 'check-pass' | 'check-fail' | 'attention' | 'checkpoint' | 'jump'
  | 'gameover' | 'ending'

interface Voice {
  /** Frequenzen in Hz, nacheinander gespielt. */
  notes: number[]
  /** Dauer je Note in Sekunden. */
  step: number
  type: OscillatorType
  gain: number
  /** Leichtes Rauschen daruntermischen (Feuer, Asche, Schritte). */
  noise?: number
}

const VOICES: Record<Sfx, Voice> = {
  page: { notes: [420], step: 0.05, type: 'sine', gain: 0.06, noise: 0.25 },
  scene: { notes: [220, 330], step: 0.09, type: 'triangle', gain: 0.09 },
  choice: { notes: [330, 440], step: 0.06, type: 'triangle', gain: 0.08 },
  locked: { notes: [180, 150], step: 0.07, type: 'square', gain: 0.05 },
  'stat-up': { notes: [523, 659], step: 0.07, type: 'sine', gain: 0.1 },
  'stat-down': { notes: [392, 294], step: 0.08, type: 'sine', gain: 0.09 },
  item: { notes: [587, 784], step: 0.06, type: 'triangle', gain: 0.09 },
  coin: { notes: [988, 1319], step: 0.05, type: 'sine', gain: 0.07 },
  flag: { notes: [349], step: 0.09, type: 'sine', gain: 0.06 },
  card: { notes: [440, 554, 659], step: 0.08, type: 'triangle', gain: 0.1 },
  codex: { notes: [659, 880], step: 0.06, type: 'sine', gain: 0.07 },
  achievement: { notes: [523, 659, 784, 1047], step: 0.09, type: 'triangle', gain: 0.11 },
  levelup: { notes: [392, 523, 659, 784, 1047], step: 0.1, type: 'sine', gain: 0.12 },
  'check-pass': { notes: [523, 784], step: 0.1, type: 'triangle', gain: 0.11 },
  'check-fail': { notes: [311, 233], step: 0.13, type: 'sawtooth', gain: 0.09 },
  attention: { notes: [110, 104, 98], step: 0.22, type: 'sine', gain: 0.13 },
  checkpoint: { notes: [294, 392], step: 0.07, type: 'sine', gain: 0.05 },
  jump: { notes: [784, 587, 440, 330], step: 0.07, type: 'triangle', gain: 0.1 },
  gameover: { notes: [196, 165, 131], step: 0.3, type: 'sine', gain: 0.14, noise: 0.2 },
  ending: { notes: [262, 330, 392, 523], step: 0.22, type: 'triangle', gain: 0.13 },
}

/**
 * Klangteppich je Stimmung. `drones` sind Grundtoene in Hz, `noise` die
 * Beimischung von gefiltertem Rauschen, `cutoff` dessen Tiefpass — hoher
 * Cutoff klingt nach Wind und Feuer, niedriger nach Raum und Erde.
 */
interface AmbienceBed {
  drones: number[]
  noise: number
  cutoff: number
  level: number
}

export const AMBIENCE: Record<string, AmbienceBed> = {
  siege: { drones: [55, 82.5], noise: 0.35, cutoff: 900, level: 0.08 },
  'street-night': { drones: [98, 147], noise: 0.12, cutoff: 400, level: 0.05 },
  warren: { drones: [61.7, 92.5, 123.5], noise: 0.2, cutoff: 250, level: 0.07 },
  dream: { drones: [65.4, 98, 130.8], noise: 0.06, cutoff: 300, level: 0.05 },
  council: { drones: [73.4, 110], noise: 0.05, cutoff: 220, level: 0.04 },
  march: { drones: [65.4, 98], noise: 0.22, cutoff: 700, level: 0.05 },
  ruin: { drones: [49, 73.4], noise: 0.18, cutoff: 500, level: 0.06 },
  duel: { drones: [87.3, 130.8], noise: 0.08, cutoff: 600, level: 0.06 },
  divine: { drones: [41.2, 61.7, 82.4], noise: 0.1, cutoff: 180, level: 0.09 },
  aftermath: { drones: [58.3, 87.3], noise: 0.14, cutoff: 350, level: 0.05 },
  // Eng, holzern, gedaempft: tiefe Grundtoene, viel Rauschen fuer die Menge,
  // niedriger Cutoff, weil ueber allem eine Decke liegt.
  'close-quarters': { drones: [55.0, 82.4], noise: 0.22, cutoff: 260, level: 0.05 },
}

export interface AudioSettings {
  muted: boolean
  volume: number
}

export class AudioEngine {
  private ctx: AudioContext | undefined
  private master: GainNode | undefined
  private ambienceGain: GainNode | undefined
  private ambienceNodes: AudioScheduledSourceNode[] = []
  private currentMood: string | undefined
  private settings: AudioSettings = { muted: false, volume: 0.5 }
  /** Im Dev-Build erst nach bewusster Freigabe durch den Nutzer. */
  private allowed: boolean

  constructor(devBuild: boolean) {
    this.allowed = !devBuild
    if (devBuild) this.settings.muted = true
  }

  /** Wird vom Ton-Schalter in den Einstellungen gerufen — und nur von dort. */
  enableInDev(): void { this.allowed = true }

  update(settings: AudioSettings): void {
    // Im Dev-Build (und damit im Browser-Pane) bleibt stumm stumm, bis der
    // Nutzer den Ton bewusst einschaltet — auch wenn ein geladenes Profil
    // "nicht stumm" sagt. `play()` haette ohnehin nichts getan, aber so ist
    // der angezeigte Zustand ehrlich statt nur folgenlos.
    this.settings = this.allowed ? settings : { ...settings, muted: true }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.settings.muted ? 0 : this.settings.volume, this.ctx.currentTime, 0.01)
    }
    if (this.settings.muted || this.settings.volume <= 0) this.stopAmbience()
  }

  /** Wird der Ton gerade vom Preview-Schutz zurueckgehalten? */
  get blockedByDevGuard(): boolean { return !this.allowed }

  play(sfx: Sfx): void {
    if (!this.allowed || this.settings.muted || this.settings.volume <= 0) return
    const ctx = this.context()
    if (!ctx || !this.master) return
    const voice = VOICES[sfx]
    const t0 = ctx.currentTime
    voice.notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = voice.type
      osc.frequency.setValueAtTime(freq, t0 + i * voice.step)
      gain.gain.setValueAtTime(0, t0 + i * voice.step)
      gain.gain.linearRampToValueAtTime(voice.gain, t0 + i * voice.step + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + i * voice.step + voice.step * 1.6)
      osc.connect(gain).connect(this.master!)
      osc.start(t0 + i * voice.step)
      osc.stop(t0 + i * voice.step + voice.step * 1.8)
    })
    if (voice.noise) this.hiss(ctx, voice.noise, voice.notes.length * voice.step)
  }

  private hiss(ctx: AudioContext, amount: number, duration: number): void {
    const frames = Math.max(1, Math.floor(ctx.sampleRate * duration))
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    // Deterministisch genug fuer Rauschen; kein Math.random noetig.
    let s = 1
    for (let i = 0; i < frames; i++) {
      s = (s * 16807) % 2147483647
      data[i] = (s / 1073741823 - 1) * (1 - i / frames)
    }
    const src = ctx.createBufferSource()
    const gain = ctx.createGain()
    gain.gain.value = amount * 0.03
    src.buffer = buffer
    src.connect(gain).connect(this.master!)
    src.start()
  }

  // -- Umgebungsklang --------------------------------------------------------

  /**
   * Ein leiser Klangteppich je Stimmung. Kein Loop einer Datei, sondern zwei
   * Oszillatoren plus gefiltertes Rauschen — das kostet null Bytes im Bundle und
   * laesst sich stufenlos ueberblenden. Wechselt die Stimmung, blendet der alte
   * Teppich in zwei Sekunden aus und der neue ein.
   */
  ambience(mood: string): void {
    if (!this.allowed || this.settings.muted || this.settings.volume <= 0) {
      this.stopAmbience()
      return
    }
    if (this.currentMood === mood && this.ambienceGain) return
    const ctx = this.context()
    if (!ctx || !this.master) return
    this.stopAmbience()
    this.currentMood = mood

    const bed = AMBIENCE[mood] ?? AMBIENCE.march
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(bed.level, ctx.currentTime + 2)
    gain.connect(this.master)

    const nodes: AudioScheduledSourceNode[] = []
    for (const freq of bed.drones) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const shaper = ctx.createGain()
      shaper.gain.value = 0.5
      osc.connect(shaper).connect(gain)
      osc.start()
      nodes.push(osc)
    }
    if (bed.noise > 0) {
      const seconds = 4
      const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      let s = 12345
      for (let i = 0; i < data.length; i++) {
        s = (s * 16807) % 2147483647
        data[i] = s / 1073741823 - 1
      }
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = bed.cutoff
      const noiseGain = ctx.createGain()
      noiseGain.gain.value = bed.noise
      src.connect(filter).connect(noiseGain).connect(gain)
      src.start()
      nodes.push(src)
    }
    this.ambienceGain = gain
    this.ambienceNodes = nodes
  }

  stopAmbience(): void {
    const ctx = this.ctx
    const gain = this.ambienceGain
    const nodes = this.ambienceNodes
    this.ambienceGain = undefined
    this.ambienceNodes = []
    this.currentMood = undefined
    if (!ctx || !gain) return
    gain.gain.cancelScheduledValues(ctx.currentTime)
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5)
    for (const n of nodes) {
      try { n.stop(ctx.currentTime + 1.6) } catch { /* schon gestoppt */ }
    }
  }

  private context(): AudioContext | undefined {
    if (this.ctx) return this.ctx
    const Ctor = globalThis.AudioContext
    if (!Ctor) return undefined
    this.ctx = new Ctor()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.settings.muted ? 0 : this.settings.volume
    this.master.connect(this.ctx.destination)
    return this.ctx
  }
}
