/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private vibrationEnabled: boolean = true;
  private holdOscillator: OscillatorNode | null = null;
  private holdGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopHoldTone();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVibrationEnabled(enabled: boolean) {
    this.vibrationEnabled = enabled;
  }

  public getVibrationEnabled(): boolean {
    return this.vibrationEnabled;
  }

  // Curto clique de metrônomo para cada segundo de cadência
  public playTick(pitch: number = 720, duration: number = 0.04) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Falha silenciosa em navegadores com restrições
    }
  }

  // Tom contínuo e suave durante fases de isometria
  public startHoldTone() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.holdOscillator) return;

      this.holdOscillator = this.ctx.createOscillator();
      this.holdGain = this.ctx.createGain();

      this.holdOscillator.type = 'triangle';
      this.holdOscillator.frequency.setValueAtTime(329.63, this.ctx.currentTime); // Mi4 suave

      this.holdGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.holdGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);

      this.holdOscillator.connect(this.holdGain);
      this.holdGain.connect(this.ctx.destination);

      this.holdOscillator.start();
    } catch {
      // Ignora erro
    }
  }

  public stopHoldTone() {
    try {
      if (this.holdGain && this.ctx) {
        this.holdGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
      }
      setTimeout(() => {
        if (this.holdOscillator) {
          try {
            this.holdOscillator.stop();
            this.holdOscillator.disconnect();
          } catch {
            // Já parado
          }
          this.holdOscillator = null;
          this.holdGain = null;
        }
      }, 90);
    } catch {
      this.holdOscillator = null;
      this.holdGain = null;
    }
  }

  // Acorde harmônico clínico de conclusão de série ou exercício
  public playCompletionChime() {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 150]);
    }

    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99]; // Dó, Mi, Sol maior
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        const startTime = this.ctx!.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch {
      // Fallback
    }
  }

  // Aviso sonoro para os 3 segundos finais de descanso
  public playCountdownWarning() {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
    this.playTick(980, 0.06);
  }
}

export const soundSynthesizer = new SoundSynthesizer();
