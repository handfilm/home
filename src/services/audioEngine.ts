// Ambient Sound Design Engine (Procedural Web Audio API Synthesis)
// Zero external files required — 100% reliable, zero latency, offline-ready

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private currentPortal: string = 'd2c';
  private masterGain: GainNode | null = null;
  private activeNodes: { [key: string]: AudioNode[] } = {};
  private noiseBuffer: AudioBuffer | null = null;

  constructor() {
    // Visibility listener for auto-pause/unpause
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseContext();
        } else if (this.isEnabled) {
          this.resumeContext();
        }
      });
    }
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Create 2-second pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
      b6 = white * 0.115926;
    }
  }

  public setEnabled(enabled: boolean): boolean {
    this.isEnabled = enabled;
    if (enabled) {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.playPortalTexture(this.currentPortal);
    } else {
      this.stopAll();
    }
    return this.isEnabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public setPortal(portalId: string) {
    this.currentPortal = portalId;
    if (this.isEnabled) {
      this.playPortalTexture(portalId);
    }
  }

  private stopAll() {
    if (!this.ctx) return;
    Object.values(this.activeNodes).forEach((nodes) => {
      nodes.forEach((node) => {
        try {
          if (node instanceof AudioScheduledSourceNode) {
            node.stop();
          }
          node.disconnect();
        } catch {
          // ignore
        }
      });
    });
    this.activeNodes = {};
  }

  private playPortalTexture(portalId: string) {
    if (!this.ctx || !this.masterGain || !this.isEnabled) return;
    this.stopAll();

    const now = this.ctx.currentTime;
    const portalGain = this.ctx.createGain();
    portalGain.gain.setValueAtTime(0.001, now);
    portalGain.gain.exponentialRampToValueAtTime(0.7, now + 1.2);
    portalGain.connect(this.masterGain);

    const nodes: AudioNode[] = [portalGain];

    // Portal specific procedural synthesizers
    if (portalId === 'd2c') {
      // Warm vinyl drone with 110Hz sub & soft saturation
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, now); // A2

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(165, now); // E3 fifth

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(portalGain);

      osc1.start(now);
      osc2.start(now);
      nodes.push(osc1, osc2, filter);
    } else if (portalId === 'b2b') {
      // Industrial deep hum with resonant 73Hz pulse & metallic texture
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(73.4, now); // D2

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, now);
      filter.Q.setValueAtTime(4.0, now);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, now); // 0.2Hz slow modulation
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc.connect(filter);
      filter.connect(portalGain);

      osc.start(now);
      lfo.start(now);
      nodes.push(osc, filter, lfo, lfoGain);
    } else if (portalId === 'articles') {
      // Crisp atmospheric paper / tape texture & 220Hz calm harmonic chord
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(220, now); // A3

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(330, now); // E4

      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0.4, now);

      osc1.connect(chordGain);
      osc2.connect(chordGain);
      chordGain.connect(portalGain);

      osc1.start(now);
      osc2.start(now);
      nodes.push(osc1, osc2, chordGain);

      // Add gentle tape hiss
      if (this.noiseBuffer) {
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = this.noiseBuffer;
        noiseSource.loop = true;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(2400, now);
        noiseFilter.Q.setValueAtTime(1.2, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.12, now);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(portalGain);
        noiseSource.start(now);
        nodes.push(noiseSource, noiseFilter, noiseGain);
      }
    } else {
      // Hand Film / Cinematic 432Hz deep film drone with wind atmosphere
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(54, now); // Sub-bass

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(108, now); // Octave

      const osc3 = this.ctx.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(216, now); // Film octave

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(portalGain);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      nodes.push(osc1, osc2, osc3, filter);
    }

    this.activeNodes[portalId] = nodes;
  }

  private pauseContext() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  private resumeContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
}

export const audioEngine = new AmbientAudioEngine();
