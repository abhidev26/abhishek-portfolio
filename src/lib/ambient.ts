/**
 * Optional ambient space drone, synthesised with the Web Audio API (no audio files).
 * It is NEVER started automatically: AudioContext is only created after the visitor clicks the toggle.
 */
class AmbientSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;

  get isOn(): boolean {
    return this.enabled;
  }

  private build(): void {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 0.7;
    filter.connect(master);
    master.connect(ctx.destination);

    [55, 82.41, 110.0, 164.81].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (i - 1.5) * 6;
      const g = ctx.createGain();
      g.gain.value = 0.22 / (i + 1);
      osc.connect(g).connect(filter);
      osc.start();
    });
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 180;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    this.ctx = ctx;
    this.master = master;
  }

  async set(on: boolean): Promise<void> {
    if (on && !this.ctx) this.build();
    if (!this.ctx || !this.master) return;
    if (on) await this.ctx.resume();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(on ? 0.12 : 0, now, 0.6);
    this.enabled = on;
    if (!on) window.setTimeout(() => void this.ctx?.suspend(), 1800);
  }
}

export const ambient = new AmbientSound();
