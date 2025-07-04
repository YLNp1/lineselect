// Simple Engine Sound Generator with fallback support
class SimpleEngineSound {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNode = null;
        this.isSupported = false;
        
        // RPM calculation parameters
        this.baselineAmplitude = 0;
        this.isCalibrated = false;
        this.idleRPM = 750;
        this.maxRPM = 6500;
        this.lastRevTime = 0;
        
        this.init();
    }

    async init() {
        try {
            // Create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) {
                console.log('Web Audio API not supported');
                return;
            }

            this.audioContext = new AudioContext();
            this.isSupported = true;
            
            // Create analyzer for real-time audio analysis
            this.analyzer = this.audioContext.createAnalyser();
            this.analyzer.fftSize = 512;
            this.analyzer.smoothingTimeConstant = 0.8;
            
            // Create master gain
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.analyzer);
            this.analyzer.connect(this.audioContext.destination);
            this.gainNode.gain.value = 0;
            
            // Initialize audio data array for analysis
            this.audioData = new Uint8Array(this.analyzer.frequencyBinCount);
            this.smoothedAmplitude = 0;
            
            console.log('Audio context initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            this.isSupported = false;
        }
    }

    async startEngine() {
        if (!this.isSupported || this.isPlaying) {
            console.log('Audio not supported or already playing');
            return false;
        }

        try {
            // Resume audio context if suspended (required by browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
                console.log('Audio context resumed');
            }

            this.isPlaying = true;
            
            // Realistic engine startup sequence
            await this.performEngineStartup();
            
            // Calibrate baseline after engine starts
            setTimeout(() => {
                this.calibrateBaseline();
            }, 2500);
            
            console.log('Engine startup sequence completed');
            return true;
            
        } catch (error) {
            console.error('Failed to start engine sound:', error);
            this.isPlaying = false;
            return false;
        }
    }

    async performEngineStartup() {
        const startupDuration = 2.0; // Total startup time
        const now = this.audioContext.currentTime;
        
        console.log('Engine startup sequence initiated');
        
        // Phase 1: Starter motor (0-0.5 seconds)
        this.createStarterMotorSound(now);
        
        // Phase 2: Engine attempts to start (0.3-0.8 seconds)
        setTimeout(() => {
            this.createEngineAttempts(now + 0.3);
        }, 300);
        
        // Phase 3: Engine catches and builds (0.8-2.0 seconds)
        setTimeout(() => {
            this.createEngineOscillators();
            this.performStartupRamp(now + 0.8);
        }, 800);
        
        // Wait for startup sequence to complete
        return new Promise(resolve => {
            setTimeout(resolve, startupDuration * 1000);
        });
    }

    createStarterMotorSound(startTime) {
        // Create starter motor sound (high-frequency whirring)
        const starter = this.audioContext.createOscillator();
        const starterGain = this.audioContext.createGain();
        const starterFilter = this.audioContext.createBiquadFilter();
        
        starter.type = 'square';
        starter.frequency.value = 200;
        
        starterFilter.type = 'bandpass';
        starterFilter.frequency.value = 300;
        starterFilter.Q.value = 5;
        
        starterGain.gain.value = 0;
        
        starter.connect(starterFilter);
        starterFilter.connect(starterGain);
        starterGain.connect(this.audioContext.destination);
        
        starter.start(startTime);
        
        // Starter motor envelope (quick ramp up, sustain, quick off)
        starterGain.gain.setValueAtTime(0, startTime);
        starterGain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
        starterGain.gain.setValueAtTime(0.15, startTime + 0.4);
        starterGain.gain.linearRampToValueAtTime(0, startTime + 0.5);
        
        // Add slight frequency modulation to starter
        starter.frequency.linearRampToValueAtTime(250, startTime + 0.2);
        starter.frequency.linearRampToValueAtTime(180, startTime + 0.5);
        
        starter.stop(startTime + 0.6);
        
        console.log('Starter motor engaged');
    }

    createEngineAttempts(startTime) {
        // Create a few engine "coughs" as it tries to start
        const attempts = [
            { time: 0, freq: 80, duration: 0.15 },
            { time: 0.2, freq: 90, duration: 0.12 },
            { time: 0.35, freq: 100, duration: 0.18 }
        ];
        
        attempts.forEach((attempt, index) => {
            setTimeout(() => {
                this.createEngineAttempt(startTime + attempt.time, attempt.freq, attempt.duration);
            }, attempt.time * 1000);
        });
        
        console.log('Engine attempting to start');
    }

    createEngineAttempt(when, frequency, duration) {
        const attempt = this.audioContext.createOscillator();
        const attemptGain = this.audioContext.createGain();
        const attemptFilter = this.audioContext.createBiquadFilter();
        
        attempt.type = 'sawtooth';
        attempt.frequency.value = frequency;
        
        attemptFilter.type = 'lowpass';
        attemptFilter.frequency.value = 250;
        attemptFilter.Q.value = 2;
        
        attemptGain.gain.value = 0;
        
        attempt.connect(attemptFilter);
        attemptFilter.connect(attemptGain);
        attemptGain.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        attempt.start(now);
        
        // Quick sputter envelope
        attemptGain.gain.setValueAtTime(0, now);
        attemptGain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        attemptGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        
        // Frequency drops as attempt fails
        attempt.frequency.exponentialRampToValueAtTime(frequency * 0.6, now + duration);
        
        attempt.stop(now + duration + 0.1);
    }

    performStartupRamp(startTime) {
        // Engine catches and ramps up to idle
        const rampDuration = 1.2;
        
        // Start with very low gain and frequency
        this.gainNode.gain.setValueAtTime(0, startTime);
        this.gainNode.gain.linearRampToValueAtTime(0.05, startTime + 0.2);
        this.gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.6);
        this.gainNode.gain.linearRampToValueAtTime(0.2, startTime + rampDuration);
        
        // Gradually bring oscillators to proper frequency
        this.oscillators.forEach(({osc, gain}, index) => {
            if (osc.frequency && osc.frequency.value > 50) {
                const targetFreq = osc.frequency.value;
                const startFreq = targetFreq * 0.4; // Start at 40% of target
                
                osc.frequency.setValueAtTime(startFreq, startTime);
                osc.frequency.exponentialRampToValueAtTime(targetFreq * 0.8, startTime + 0.4);
                osc.frequency.exponentialRampToValueAtTime(targetFreq, startTime + rampDuration);
                
                // Individual oscillator gains ramp up slightly staggered
                const delay = index * 0.1;
                gain.gain.setValueAtTime(0, startTime + delay);
                gain.gain.linearRampToValueAtTime(0.3 / (index + 1), startTime + delay + 0.8);
            }
        });
        
        console.log('Engine caught - ramping up to idle');
    }

    createEngineOscillators() {
        // Clear existing oscillators
        this.stopOscillators();
        
        // Create multiple oscillators for richer sound
        const frequencies = [60, 120, 180, 240]; // Engine harmonics
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            
            // Volume decreases for higher harmonics
            gain.gain.value = 0.3 / (index + 1);
            
            osc.connect(gain);
            gain.connect(this.gainNode);
            
            osc.start();
            
            this.oscillators.push({osc, gain});
            
            // Add subtle frequency modulation for realism
            this.addFrequencyModulation(osc, freq);
        });
    }

    addFrequencyModulation(oscillator, baseFreq) {
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        lfo.type = 'sine';
        lfo.frequency.value = 2 + Math.random(); // 2-3 Hz modulation
        
        lfoGain.gain.value = baseFreq * 0.02; // 2% frequency variation
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.start();
        
        this.oscillators.push({osc: lfo, gain: lfoGain});
    }

    revEngine() {
        if (!this.isPlaying || !this.oscillators.length) return;
        
        const now = this.audioContext.currentTime;
        
        // Temporarily increase frequency and volume
        this.oscillators.forEach(({osc, gain}) => {
            if (osc.frequency && osc.frequency.value > 50) { // Main oscillators only
                const currentFreq = osc.frequency.value;
                const revFreq = currentFreq * 2;
                
                // Rev up and down
                osc.frequency.exponentialRampToValueAtTime(revFreq, now + 0.3);
                osc.frequency.exponentialRampToValueAtTime(currentFreq, now + 1);
                
                // Volume boost
                const currentGain = gain.gain.value;
                gain.gain.linearRampToValueAtTime(currentGain * 1.5, now + 0.2);
                gain.gain.linearRampToValueAtTime(currentGain, now + 1);
            }
        });
        
        this.lastRevTime = Date.now();
        console.log('Engine revved');
    }

    calibrateBaseline() {
        if (!this.isPlaying) return;
        
        // Sample amplitude multiple times to get baseline
        const samples = [];
        const sampleCount = 15;
        
        const sampleInterval = setInterval(() => {
            if (samples.length >= sampleCount) {
                clearInterval(sampleInterval);
                this.baselineAmplitude = samples.reduce((a, b) => a + b) / samples.length;
                this.isCalibrated = true;
                console.log('RPM baseline calibrated:', this.baselineAmplitude.toFixed(3));
                return;
            }
            
            samples.push(this.getRawAmplitude());
        }, 100);
    }

    getRawAmplitude() {
        if (!this.analyzer || !this.audioData) return 0;
        
        this.analyzer.getByteFrequencyData(this.audioData);
        
        // Focus on engine frequencies (40-250 Hz)
        const sampleRate = this.audioContext.sampleRate;
        const startBin = Math.floor((40 / (sampleRate / 2)) * this.audioData.length);
        const endBin = Math.floor((250 / (sampleRate / 2)) * this.audioData.length);
        
        let sum = 0;
        let count = 0;
        
        for (let i = startBin; i < endBin && i < this.audioData.length; i++) {
            sum += this.audioData[i];
            count++;
        }
        
        return count > 0 ? (sum / count) / 255 : 0;
    }

    stopEngine() {
        if (!this.isPlaying) return;
        
        console.log('Engine shutdown sequence initiated');
        this.isPlaying = false;
        
        // Realistic engine shutdown sequence
        this.performEngineShutdown();
    }

    performEngineShutdown() {
        const now = this.audioContext.currentTime;
        const shutdownDuration = 2.5; // Total shutdown time
        
        // Phase 1: RPM drops quickly (engine turned off)
        this.oscillators.forEach(({osc, gain}) => {
            if (osc.frequency && osc.frequency.value > 50) { // Main oscillators only
                const currentFreq = osc.frequency.value;
                const idleFreq = currentFreq * 0.7; // Drop to lower RPM first
                
                // Quick drop in RPM
                osc.frequency.exponentialRampToValueAtTime(idleFreq, now + 0.3);
                // Then gradual slowdown
                osc.frequency.exponentialRampToValueAtTime(idleFreq * 0.3, now + 1.5);
                // Final sputter and stop
                osc.frequency.linearRampToValueAtTime(10, now + shutdownDuration);
            }
        });
        
        // Phase 2: Volume fade with engine character
        // Initial slight volume increase (engine load reduction)
        this.gainNode.gain.linearRampToValueAtTime(0.25, now + 0.2);
        // Then gradual fade as engine slows
        this.gainNode.gain.exponentialRampToValueAtTime(0.1, now + 1.2);
        // Quick fade to silence as engine stops
        this.gainNode.gain.exponentialRampToValueAtTime(0.001, now + shutdownDuration);
        
        // Phase 3: Add shutdown sound effects
        this.addShutdownEffects(now);
        
        // Stop all oscillators after shutdown sequence
        setTimeout(() => {
            this.stopOscillators();
            console.log('Engine fully stopped');
        }, (shutdownDuration + 0.5) * 1000);
    }

    addShutdownEffects(startTime) {
        // Add a few final engine "coughs" as it shuts down
        const coughTimes = [0.8, 1.2, 1.6];
        
        coughTimes.forEach((time, index) => {
            setTimeout(() => {
                this.createEngineSputter(startTime + time);
            }, time * 1000);
        });
    }

    createEngineSputter(when) {
        if (!this.audioContext) return;
        
        const sputter = this.audioContext.createOscillator();
        const sputterGain = this.audioContext.createGain();
        const sputterFilter = this.audioContext.createBiquadFilter();
        
        sputter.type = 'square';
        sputter.frequency.value = 30 + Math.random() * 20; // Low frequency sputter
        
        sputterFilter.type = 'lowpass';
        sputterFilter.frequency.value = 200;
        sputterFilter.Q.value = 3;
        
        sputterGain.gain.value = 0;
        
        sputter.connect(sputterFilter);
        sputterFilter.connect(sputterGain);
        sputterGain.connect(this.audioContext.destination);
        
        const now = this.audioContext.currentTime;
        sputter.start(now);
        
        // Quick sputter envelope
        sputterGain.gain.setValueAtTime(0, now);
        sputterGain.gain.linearRampToValueAtTime(0.08, now + 0.02);
        sputterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        
        sputter.stop(now + 0.2);
    }

    // Audio analysis methods for RPM meter
    getAudioAmplitude() {
        if (!this.analyzer || !this.audioData) return 0;
        
        this.analyzer.getByteFrequencyData(this.audioData);
        
        // Focus on engine frequency range (50-400 Hz)
        const sampleRate = this.audioContext.sampleRate;
        const engineFreqStart = Math.floor((50 / (sampleRate / 2)) * this.audioData.length);
        const engineFreqEnd = Math.floor((400 / (sampleRate / 2)) * this.audioData.length);
        
        let sum = 0;
        let count = 0;
        
        for (let i = engineFreqStart; i < engineFreqEnd && i < this.audioData.length; i++) {
            sum += this.audioData[i];
            count++;
        }
        
        const average = count > 0 ? sum / count : 0;
        const normalized = average / 255; // Normalize to 0-1
        
        // Smooth the amplitude to reduce jitter
        this.smoothedAmplitude += (normalized - this.smoothedAmplitude) * 0.3;
        
        return this.smoothedAmplitude;
    }

    getCurrentRPM() {
        if (!this.isPlaying) return 0;
        if (!this.isCalibrated) return this.idleRPM;
        
        const rawAmplitude = this.getRawAmplitude();
        const relativeAmplitude = Math.max(0, rawAmplitude - this.baselineAmplitude);
        
        // Check if we're in a recent rev state
        const timeSinceRev = Date.now() - this.lastRevTime;
        const isRecentlyRevved = timeSinceRev < 2000;
        
        if (relativeAmplitude < 0.03 && !isRecentlyRevved) {
            // IDLE STATE: Stay in idle range with small variations
            const idleVariation = Math.sin(Date.now() * 0.003) * 40;
            return this.idleRPM + idleVariation;
        } else {
            // REVVING STATE: Map relative amplitude to higher RPM
            const revThreshold = 0.03;
            const scaledAmplitude = Math.min((relativeAmplitude - revThreshold) * 6, 1);
            const revRange = this.maxRPM - this.idleRPM;
            const targetRPM = this.idleRPM + (scaledAmplitude * revRange);
            
            return Math.min(targetRPM, this.maxRPM);
        }
    }

    stopOscillators() {
        this.oscillators.forEach(({osc}) => {
            try {
                osc.stop();
            } catch (error) {
                // Oscillator might already be stopped
            }
        });
        this.oscillators = [];
    }

    // Test method to verify audio is working
    async testBeep() {
        if (!this.isSupported) {
            console.log('Audio not supported for test');
            return false;
        }

        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.frequency.value = 440; // A note
            osc.type = 'sine';
            
            gain.gain.value = 0;
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            const now = this.audioContext.currentTime;
            osc.start(now);
            
            // Quick beep
            gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            
            osc.stop(now + 0.3);
            
            console.log('Test beep played');
            return true;
            
        } catch (error) {
            console.error('Test beep failed:', error);
            return false;
        }
    }
}

// Global instance
let simpleEngineInstance = null;

// Initialize function
function initSimpleEngine() {
    if (!simpleEngineInstance) {
        simpleEngineInstance = new SimpleEngineSound();
    }
    return simpleEngineInstance;
}

// Test function
async function testAudio() {
    const engine = initSimpleEngine();
    const result = await engine.testBeep();
    console.log('Audio test result:', result);
    return result;
}

// Export for global use
window.SimpleEngineSound = SimpleEngineSound;
window.initSimpleEngine = initSimpleEngine;
window.testAudio = testAudio;