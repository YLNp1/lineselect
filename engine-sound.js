// V8 Engine Sound Generator using Web Audio API
class V8EngineSound {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.masterGain = null;
        this.oscillators = [];
        this.filters = [];
        this.noiseBuffer = null;
        this.startTime = 0;
        
        this.initAudioContext();
        this.createNoiseBuffer();
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Create master gain
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0;
            
        } catch (error) {
            console.error('Web Audio API not supported:', error);
        }
    }

    createNoiseBuffer() {
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds of noise
        this.noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        
        // Generate pink noise for engine rumble
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1;
        }
    }

    createV8EngineSound() {
        if (!this.audioContext || this.isPlaying) return;
        
        this.isPlaying = true;
        this.startTime = this.audioContext.currentTime;
        
        // Clear previous oscillators
        this.oscillators = [];
        this.filters = [];
        
        // V8 Engine fundamental frequencies (firing order simulation)
        const fundamentalFreq = 45; // Base RPM around 900 (45 Hz)
        const harmonics = [1, 2, 3, 4, 6, 8]; // V8 harmonic series
        
        // Create main engine oscillators
        harmonics.forEach((harmonic, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            // Configure oscillator
            osc.type = 'sawtooth';
            osc.frequency.value = fundamentalFreq * harmonic;
            
            // Configure filter for engine character
            filter.type = 'lowpass';
            filter.frequency.value = 800 + (harmonic * 200);
            filter.Q.value = 2;
            
            // Configure gain
            const baseGain = 0.15 / (harmonic * 0.8); // Decrease volume for higher harmonics
            gain.gain.value = 0;
            
            // Connect audio graph
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            // Store references
            this.oscillators.push(osc);
            this.filters.push(filter);
            
            // Start oscillator
            osc.start(this.startTime);
            
            // Engine startup sequence
            this.animateEngineStartup(osc, gain, filter, harmonic, baseGain);
        });
        
        // Add engine rumble with noise
        this.addEngineRumble();
        
        // Add exhaust pops and crackles
        this.addExhaustEffects();
        
        // Fade in master volume
        this.masterGain.gain.setValueAtTime(0, this.startTime);
        this.masterGain.gain.linearRampToValueAtTime(0.3, this.startTime + 0.5);
    }

    animateEngineStartup(osc, gain, filter, harmonic, baseGain) {
        const startTime = this.startTime;
        
        // Starter motor cranking (first 1.5 seconds)
        osc.frequency.setValueAtTime(fundamentalFreq * harmonic * 0.3, startTime);
        osc.frequency.linearRampToValueAtTime(fundamentalFreq * harmonic * 0.6, startTime + 1.5);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(baseGain * 0.4, startTime + 0.3);
        
        // Engine catches and revs up (1.5 - 3 seconds)
        osc.frequency.setValueAtTime(fundamentalFreq * harmonic * 0.6, startTime + 1.5);
        osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * harmonic * 1.8, startTime + 3);
        
        gain.gain.linearRampToValueAtTime(baseGain * 1.2, startTime + 2.5);
        
        // Settle to idle (3 - 5 seconds)
        osc.frequency.exponentialRampToValueAtTime(fundamentalFreq * harmonic, startTime + 5);
        gain.gain.linearRampToValueAtTime(baseGain, startTime + 5);
        
        // Add subtle RPM variations for realistic idle
        this.addIdleVariations(osc, harmonic, startTime + 5);
    }

    addIdleVariations(osc, harmonic, startTime) {
        const fundamentalFreq = 45;
        const baseFreq = fundamentalFreq * harmonic;
        
        // Create subtle frequency modulation for realistic engine idle
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        lfo.type = 'sine';
        lfo.frequency.value = 0.5 + Math.random() * 1.5; // Slow irregular idle
        
        lfoGain.gain.value = baseFreq * 0.02; // Small frequency variations
        
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        
        lfo.start(startTime);
        
        // Stop LFO when engine stops
        setTimeout(() => {
            if (lfo) {
                lfo.stop();
            }
        }, 10000);
    }

    addEngineRumble() {
        if (!this.noiseBuffer) return;
        
        const rumbleSource = this.audioContext.createBufferSource();
        const rumbleGain = this.audioContext.createGain();
        const rumbleFilter = this.audioContext.createBiquadFilter();
        
        rumbleSource.buffer = this.noiseBuffer;
        rumbleSource.loop = true;
        
        rumbleFilter.type = 'bandpass';
        rumbleFilter.frequency.value = 80;
        rumbleFilter.Q.value = 3;
        
        rumbleGain.gain.value = 0;
        
        rumbleSource.connect(rumbleFilter);
        rumbleFilter.connect(rumbleGain);
        rumbleGain.connect(this.masterGain);
        
        rumbleSource.start(this.startTime);
        
        // Fade in rumble
        rumbleGain.gain.linearRampToValueAtTime(0.1, this.startTime + 2);
        rumbleGain.gain.linearRampToValueAtTime(0.05, this.startTime + 5);
        
        // Store reference for cleanup
        this.oscillators.push(rumbleSource);
    }

    addExhaustEffects() {
        // Add random exhaust pops during startup
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                if (this.isPlaying) {
                    this.createExhaustPop();
                }
            }, 2000 + Math.random() * 3000);
        }
    }

    createExhaustPop() {
        const pop = this.audioContext.createOscillator();
        const popGain = this.audioContext.createGain();
        const popFilter = this.audioContext.createBiquadFilter();
        
        pop.type = 'square';
        pop.frequency.value = 120 + Math.random() * 80;
        
        popFilter.type = 'highpass';
        popFilter.frequency.value = 300;
        
        popGain.gain.value = 0;
        
        pop.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.masterGain);
        
        const now = this.audioContext.currentTime;
        pop.start(now);
        
        // Quick pop envelope
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        pop.stop(now + 0.2);
    }

    revEngine() {
        if (!this.isPlaying || !this.oscillators.length) return;
        
        const now = this.audioContext.currentTime;
        const revDuration = 1.5;
        
        this.oscillators.forEach((osc, index) => {
            if (osc.frequency) {
                const currentFreq = osc.frequency.value;
                const revFreq = currentFreq * 2.5;
                
                // Rev up
                osc.frequency.exponentialRampToValueAtTime(revFreq, now + 0.8);
                // Back to idle
                osc.frequency.exponentialRampToValueAtTime(currentFreq, now + revDuration);
            }
        });
        
        // Add rev sound effects
        this.createExhaustPop();
        setTimeout(() => this.createExhaustPop(), 500);
    }

    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        const fadeTime = 1.0;
        const now = this.audioContext.currentTime;
        
        // Fade out master gain
        this.masterGain.gain.linearRampToValueAtTime(0.001, now + fadeTime);
        
        // Stop all oscillators
        setTimeout(() => {
            this.oscillators.forEach(osc => {
                try {
                    if (osc.stop) {
                        osc.stop();
                    }
                } catch (error) {
                    // Oscillator might already be stopped
                }
            });
            
            this.oscillators = [];
            this.filters = [];
        }, fadeTime * 1000);
    }

    async resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }
}

// Global engine sound instance
let engineSoundInstance = null;

// Initialize engine sound
function initEngineSound() {
    if (!engineSoundInstance) {
        engineSoundInstance = new V8EngineSound();
    }
    return engineSoundInstance;
}

// Export for use in other scripts
window.V8EngineSound = V8EngineSound;
window.initEngineSound = initEngineSound;