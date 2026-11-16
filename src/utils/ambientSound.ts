class AmbientChimeEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playSealChime(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [293.66, 369.99, 440.0, 587.33]; // D major warm chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.045, now + idx * 0.08 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.7);
    });
  }

  public toggleAmbient(): boolean {
    if (this.isPlaying) {
      this.stopAmbient();
      return false;
    }
    const ctx = this.ensureContext();
    if (!ctx) return false;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.035, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    const chordSequence = [
      [261.63, 329.63, 392.0], // C major
      [220.0, 261.63, 329.63], // A minor
      [174.61, 220.0, 261.63], // F major
      [196.0, 246.94, 293.66], // G major
    ];
    let step = 0;

    const triggerChord = () => {
      if (!this.ctx || !this.masterGain) return;
      const chord = chordSequence[step % chordSequence.length];
      step += 1;
      const now = this.ctx.currentTime;
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        g.gain.setValueAtTime(0.0001, now + idx * 0.14);
        g.gain.exponentialRampToValueAtTime(0.35, now + idx * 0.14 + 0.5);
        g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.14 + 3.6);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 3.7);
      });
    };

    triggerChord();
    this.intervalId = window.setInterval(triggerChord, 3800);
    this.isPlaying = true;
    return true;
  }

  public stopAmbient(): void {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.15);
    }
    this.isPlaying = false;
  }
}

export const ambientEngine = new AmbientChimeEngine();
