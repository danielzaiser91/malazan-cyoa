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

export interface AudioSettings {
  muted: boolean
  volume: number
}

export class AudioEngine {
  private ctx: AudioContext | undefined
  private master: GainNode | undefined
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
