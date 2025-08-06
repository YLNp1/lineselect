// Immersive 360° Viewer Component
class ImmersiveViewer {
    constructor() {
        this.container = null;
        this.currentCarId = null;
        this.soundPlaying = false;
        this.isShuttingDown = false;
        this.engineSound = null;
        this.createViewer();
        this.initEventListeners();
        this.carData = this.getCarData();
        this.initEngineSound();
    }

    createViewer() {
        // Create container
        this.container = document.createElement('div');
        this.container.className = 'immersive-container';
        this.container.innerHTML = `
            <!-- Controls -->
            <div class="immersive-controls">
                <button class="control-btn engine-btn" id="immersive-engine" title="Start Engine">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="8" width="20" height="8" rx="2"/>
                        <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
                        <path d="M6 14h.01"/>
                        <path d="M10 14h.01"/>
                        <path d="M14 14h.01"/>
                        <path d="M18 14h.01"/>
                    </svg>
                </button>
                <button class="control-btn close-btn" id="close-immersive" title="Close">
                    ×
                </button>
            </div>

            <!-- 360° Viewer -->
            <div class="immersive-viewer" id="immersive-viewer">
                <div class="viewer-loading" id="viewer-loading">
                    <div class="loading-spinner"></div>
                    LOADING 360° VIEWER
                </div>
            </div>

            <!-- Specs Section -->
            <div class="immersive-specs" id="immersive-specs">
                <div class="specs-content">
                    <div class="car-details">
                        <h1 id="immersive-car-name">PORSCHE 911 GT3</h1>
                        <div class="car-meta">
                            <div class="meta-item">
                                <div class="meta-label">Year</div>
                                <div class="meta-value" id="immersive-year">2023</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Power</div>
                                <div class="meta-value" id="immersive-power">510 HP</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Mileage</div>
                                <div class="meta-value" id="immersive-mileage">2,500 KM</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Price</div>
                                <div class="meta-value" id="immersive-price">€189,500</div>
                            </div>
                        </div>
                        <div class="car-description" id="immersive-description">
                            This exceptional GT3 represents the pinnacle of Porsche's racing heritage. 
                            With its naturally aspirated engine and precision-tuned suspension, it delivers 
                            an uncompromising driving experience.
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="immersive-btn primary">REQUEST INFO</button>
                        <button class="immersive-btn">SCHEDULE VIEWING</button>
                        <button class="immersive-btn">VIEW DETAILS</button>
                    </div>
                </div>
            </div>
        `;

        // Add audio element
        const audio = document.createElement('audio');
        audio.id = 'immersive-engine-sound';
        audio.preload = 'auto';
        audio.innerHTML = '<source src="assets/engine-sound.mp3" type="audio/mpeg">';
        
        // Append to body
        document.body.appendChild(this.container);
        document.body.appendChild(audio);

        // Add styles
        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('immersive-styles')) return;

        const style = document.createElement('style');
        style.id = 'immersive-styles';
        style.textContent = `
            .immersive-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #000;
                z-index: 10000;
                display: none;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.5s ease;
            }

            .immersive-container.active {
                display: block;
            }

            .immersive-container.visible {
                opacity: 1;
            }

            .immersive-viewer {
                width: 100%;
                height: 70vh;
                position: relative;
                background: #111;
            }

            .immersive-controls {
                position: absolute;
                top: 30px;
                right: 30px;
                display: flex;
                gap: 20px;
                z-index: 10001;
            }

            .control-btn {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: #fff;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
                font-size: 16px;
            }

            .control-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.5);
            }

            .close-btn {
                font-size: 24px;
                font-weight: 300;
                line-height: 1;
            }

            .immersive-specs {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 60px;
                background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
                color: #fff;
                opacity: 0;
                transform: translateY(50px);
                transition: all 1s ease;
            }

            .immersive-specs.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .specs-content {
                max-width: 1200px;
                margin: 0 auto;
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 60px;
                align-items: end;
            }

            .car-details h1 {
                font-size: 36px;
                font-weight: 300;
                letter-spacing: 4px;
                margin-bottom: 20px;
                color: #fff;
            }

            .car-meta {
                display: flex;
                gap: 40px;
                margin-bottom: 30px;
            }

            .meta-item {
                text-align: center;
            }

            .meta-label {
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 2px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 5px;
            }

            .meta-value {
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1px;
                color: #fff;
            }

            .car-description {
                font-size: 14px;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.8);
                max-width: 500px;
                letter-spacing: 0.5px;
            }

            .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .immersive-btn {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.5);
                color: #fff;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 2px;
                padding: 12px 24px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                min-width: 180px;
            }

            .immersive-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: #fff;
            }

            .immersive-btn.primary {
                background: #fff;
                color: #000;
            }

            .immersive-btn.primary:hover {
                background: rgba(255, 255, 255, 0.9);
            }

            .viewer-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                letter-spacing: 2px;
                z-index: 10000;
                text-align: center;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes engine-startup {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Source element animation */
            .immersive-zoom-source {
                transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease !important;
                transform-origin: center center !important;
            }

            .immersive-fade-siblings > *:not(.immersive-zoom-source) {
                transition: opacity 0.6s ease !important;
            }

            @media (max-width: 768px) {
                .immersive-controls {
                    top: 20px;
                    right: 20px;
                    gap: 15px;
                }

                .control-btn {
                    width: 45px;
                    height: 45px;
                    font-size: 14px;
                }

                .immersive-specs {
                    padding: 40px 20px;
                }

                .specs-content {
                    grid-template-columns: 1fr;
                    gap: 40px;
                    text-align: center;
                }

                .car-details h1 {
                    font-size: 28px;
                    letter-spacing: 2px;
                }

                .car-meta {
                    justify-content: center;
                    gap: 20px;
                    flex-wrap: wrap;
                }

                .action-buttons {
                    align-items: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    initEngineSound() {
        // Initialize simple engine sound
        if (window.initSimpleEngine) {
            this.engineSound = window.initSimpleEngine();
            console.log('Engine sound initialized');
        } else {
            console.log('Engine sound not available');
        }
    }

    initEventListeners() {
        // Wait for container to be created
        setTimeout(() => {
            const closeBtn = this.container.querySelector('#close-immersive');
            const soundBtn = this.container.querySelector('#immersive-sound');
            
            closeBtn.addEventListener('click', () => this.close());
            const engineBtn = this.container.querySelector('#immersive-engine');
            engineBtn.addEventListener('click', () => this.toggleEngine());
            
            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.container.classList.contains('active')) {
                    this.close();
                }
            });
        }, 100);
    }

    getCarData() {
        // Use global carData from CMS if available, otherwise fallback
        if (typeof carData !== 'undefined' && Object.keys(carData).length > 0) {
            return carData;
        }
        
        // Fallback data
        return {
            1: {
                name: "PORSCHE 911 GT3",
                year: "2023",
                power: "510 HP",
                mileage: "2,500 KM",
                price: "€189,500",
                description: "This exceptional GT3 represents the pinnacle of Porsche's racing heritage. With its naturally aspirated engine and precision-tuned suspension, it delivers an uncompromising driving experience."
            },
            2: {
                name: "McLAREN 720S",
                year: "2022",
                power: "720 HP",
                mileage: "1,800 KM",
                price: "€295,000",
                description: "The McLaren 720S embodies the perfect fusion of cutting-edge technology and raw performance. Its carbon fiber construction delivers breathtaking acceleration."
            },
            3: {
                name: "LAMBORGHINI HURACÁN",
                year: "2023",
                power: "640 HP",
                mileage: "900 KM",
                price: "€225,000",
                description: "The Huracán represents Italian automotive artistry at its finest. Every curve has been sculpted to perfection, housing a naturally aspirated V10."
            }
        };
    }

    open(carId, sourceElement) {
        // Prevent opening if already active
        if (isImmersiveViewerActive) {
            console.log('🚫 Immersive viewer already active, ignoring click');
            return;
        }
        
        // Set active state immediately to prevent race conditions
        isImmersiveViewerActive = true;
        
        // Refresh car data from CMS
        this.carData = this.getCarData();
        this.currentCarId = carId;
        const car = this.carData[carId];
        
        if (!car) {
            console.warn('🚫 Car not found:', carId);
            isImmersiveViewerActive = false; // Reset state
            return;
        }
        
        console.log('🚗 Opening immersive view for:', car.name);

        // Animate source element
        this.animateSourceElement(sourceElement);
        
        // Show container
        this.container.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Fade in
        setTimeout(() => {
            this.container.classList.add('visible');
        }, 50);
        
        // Update car information
        this.updateCarInfo(car);
        
        // Load 360° viewer
        this.load360Viewer();
        
        // Show specs after delay
        setTimeout(() => {
            const specs = this.container.querySelector('#immersive-specs');
            specs.classList.add('visible');
        }, 2000);
    }

    animateSourceElement(element) {
        if (!element) return;
        
        // Add classes for animation
        element.classList.add('immersive-zoom-source');
        if (element.parentElement) {
            element.parentElement.classList.add('immersive-fade-siblings');
        }
        
        // Start animation
        setTimeout(() => {
            element.style.transform = 'scale(2)';
            element.style.opacity = '0';
            
            // Fade siblings
            const siblings = element.parentElement?.children;
            if (siblings) {
                Array.from(siblings).forEach(sibling => {
                    if (sibling !== element) {
                        sibling.style.opacity = '0';
                    }
                });
            }
        }, 100);
        
        // Reset after animation
        setTimeout(() => {
            this.resetSourceElement(element);
        }, 1000);
    }

    resetSourceElement(element) {
        if (!element) return;
        
        element.style.transform = '';
        element.style.opacity = '';
        element.classList.remove('immersive-zoom-source');
        
        if (element.parentElement) {
            element.parentElement.classList.remove('immersive-fade-siblings');
            Array.from(element.parentElement.children).forEach(sibling => {
                sibling.style.opacity = '';
            });
        }
    }

    updateCarInfo(car) {
        this.container.querySelector('#immersive-car-name').textContent = car.name;
        this.container.querySelector('#immersive-year').textContent = car.year;
        this.container.querySelector('#immersive-power').textContent = car.power;
        this.container.querySelector('#immersive-mileage').textContent = car.mileage;
        this.container.querySelector('#immersive-price').textContent = car.price;
        this.container.querySelector('#immersive-description').textContent = car.description;
    }

    load360Viewer() {
        const viewer = this.container.querySelector('#immersive-viewer');
        const loading = this.container.querySelector('#viewer-loading');
        
        loading.style.display = 'block';
        
        setTimeout(() => {
            loading.style.display = 'none';
            
            const car = this.carData[this.currentCarId];
            let viewerHTML = '';
            
            // Only use Impel URLs from backend, strict validation
            if (car && car.view360Url && 
                (car.view360Url.includes('impel.app') || car.view360Url.includes('impel.')) && 
                !car.view360Url.includes('godaddy')) {
                // Real Impel 360° viewer from backend
                console.log('🎯 Using Impel viewer from backend:', car.view360Url);
                viewerHTML = `<iframe src="${car.view360Url}" width="100%" height="100%" frameborder="0" allowfullscreen style="background: #000;"></iframe>`;
            } else {
                // Fallback interactive viewer
                viewerHTML = `
                    <div class="viewer-360" style="width: 100%; height: 100%; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); display: flex; align-items: center; justify-content: center; color: #fff; position: relative; overflow: hidden; cursor: grab;">
                        <div style="text-align: center; z-index: 10; pointer-events: none;">
                            <div style="font-size: 28px; letter-spacing: 4px; margin-bottom: 15px; font-weight: 300;">360° INTERACTIVE VIEW</div>
                            <div style="font-size: 12px; opacity: 0.7; letter-spacing: 1px;">CLICK AND DRAG TO ROTATE • SCROLL TO ZOOM</div>
                        </div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 250px; height: 120px; border: 2px solid rgba(255,255,255,0.2); border-radius: 60px; opacity: 0.6;"></div>
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 80px; border: 1px solid rgba(255,255,255,0.3); border-radius: 40px; opacity: 0.4;"></div>
                        <div style="position: absolute; bottom: 20px; right: 20px; font-size: 10px; opacity: 0.5; letter-spacing: 1px; font-family: monospace;">IMMERSIVE EXPERIENCE</div>
                    </div>
                `;
            }
            
            viewer.innerHTML = viewerHTML;
            
            // Add interaction for fallback viewer only if no valid Impel URL
            if (!car || !car.view360Url || 
                !car.view360Url.includes('impel.') || 
                car.view360Url.includes('godaddy')) {
                console.log('🎮 Using fallback interactive viewer');
                this.addViewerInteraction();
            }
        }, 1500);
    }

    addViewerInteraction() {
        const viewerContent = this.container.querySelector('.viewer-360');
        let isDragging = false;
        let startX = 0;
        let rotation = 0;
        
        viewerContent.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            viewerContent.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            rotation += deltaX * 0.3;
            
            viewerContent.style.filter = `hue-rotate(${rotation}deg) brightness(${1 + Math.sin(rotation * 0.01) * 0.1})`;
            startX = e.clientX;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            viewerContent.style.cursor = 'grab';
        });
        
        // Touch events
        viewerContent.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - startX;
            rotation += deltaX * 0.3;
            viewerContent.style.filter = `hue-rotate(${rotation}deg) brightness(${1 + Math.sin(rotation * 0.01) * 0.1})`;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    async toggleEngine() {
        const engineBtn = this.container.querySelector('#immersive-engine');
        
        if (this.soundPlaying || this.isShuttingDown) {
            // Stop engine sound with realistic shutdown
            if (this.engineSound && this.engineSound.stopEngine && !this.isShuttingDown) {
                this.isShuttingDown = true;
                this.engineSound.stopEngine();
                
                // Update button to show shutdown state
                engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="6" height="6"/></svg>';
                engineBtn.title = 'Shutting Down Engine...';
                engineBtn.disabled = true;
                
                // Remove rev button immediately (can't rev during shutdown)
                this.removeRevButton();
                
                console.log('Engine shutdown initiated');
                
                // Wait for shutdown sequence to complete (2.5 seconds + buffer)
                setTimeout(() => {
                    this.isShuttingDown = false;
                    this.soundPlaying = false;
                    engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M18 14h.01"/></svg>';
                    engineBtn.title = 'Start Engine';
                    engineBtn.disabled = false;
                    console.log('Engine shutdown complete');
                }, 3000);
            }
        } else {
            // Start engine sound with realistic startup sequence
            console.log('Attempting to start engine sound...');
            engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>';
            engineBtn.title = 'Starting Engine...';
            engineBtn.disabled = true;
            
            // Add spinning animation during startup
            engineBtn.style.animation = 'engine-startup 1s linear infinite';
            
            try {
                if (this.engineSound && this.engineSound.startEngine) {
                    // Show startup phases
                    setTimeout(() => {
                        engineBtn.title = 'Starter Motor Engaged...';
                    }, 100);
                    
                    setTimeout(() => {
                        engineBtn.title = 'Engine Attempting Start...';
                    }, 500);
                    
                    setTimeout(() => {
                        engineBtn.title = 'Engine Caught - Warming Up...';
                    }, 1000);
                    
                    const success = await this.engineSound.startEngine();
                    
                    if (success) {
                        // Remove spinning animation
                        engineBtn.style.animation = '';
                        engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M18 14h.01"/></svg>';
                        engineBtn.title = 'Stop Engine';
                        engineBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                        engineBtn.disabled = false;
                        this.soundPlaying = true;
                        
                        // Add rev button after startup is complete
                        setTimeout(() => {
                            this.addRevButton();
                        }, 500);
                        
                        console.log('Engine startup sequence completed successfully');
                    } else {
                        throw new Error('Engine sound failed to start');
                    }
                } else {
                    throw new Error('Engine sound not available');
                }
            } catch (error) {
                console.error('Audio failed:', error);
                engineBtn.style.animation = '';
                engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg>';
                engineBtn.title = 'Engine Start Failed';
                engineBtn.disabled = false;
                
                // Reset button after showing error
                setTimeout(() => {
                    engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M18 14h.01"/></svg>';
                    engineBtn.title = 'Start Engine';
                    engineBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                }, 3000);
            }
        }
    }

    addRevButton() {
        const controls = this.container.querySelector('.immersive-controls');
        let revBtn = controls.querySelector('.rev-btn');
        
        if (!revBtn && this.soundPlaying) {
            revBtn = document.createElement('button');
            revBtn.className = 'control-btn rev-btn';
            revBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/><path d="M8 16l4-4 4 4"/></svg>';
            revBtn.title = 'Rev Engine';
            
            revBtn.addEventListener('click', () => {
                if (this.engineSound && this.soundPlaying && this.engineSound.revEngine) {
                    this.engineSound.revEngine();
                    console.log('Engine revved');
                    
                    // Visual feedback
                    revBtn.style.transform = 'scale(1.2)';
                    revBtn.style.background = 'rgba(255, 255, 255, 0.3)';
                    setTimeout(() => {
                        revBtn.style.transform = '';
                        revBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    }, 300);
                }
            });
            
            controls.insertBefore(revBtn, controls.lastElementChild);
        }
    }

    removeRevButton() {
        const revBtn = this.container.querySelector('.rev-btn');
        if (revBtn) {
            revBtn.remove();
        }
    }

    // Removed complex sound visualization

    // Removed RPM indicator

    // Removed RPM animation

    // Removed shutdown RPM animation

    // Removed sound visualization cleanup

    close() {
        this.container.classList.remove('visible');
        
        setTimeout(() => {
            this.container.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset specs
            const specs = this.container.querySelector('#immersive-specs');
            specs.classList.remove('visible');
            
            // Stop sound
            if (this.soundPlaying || this.isShuttingDown) {
                if (this.engineSound && this.engineSound.stopOscillators) {
                    this.engineSound.stopOscillators(); // Force immediate stop on close
                }
                this.soundPlaying = false;
                this.isShuttingDown = false;
                const engineBtn = this.container.querySelector('#immersive-engine');
                if (engineBtn) {
                    engineBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/><path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M18 14h.01"/></svg>';
                    engineBtn.title = 'Start Engine';
                    engineBtn.disabled = false;
                    engineBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                }
                this.removeRevButton();
            }
            
            // Reset viewer
            const viewer = this.container.querySelector('#immersive-viewer');
            viewer.innerHTML = `
                <div class="viewer-loading" id="viewer-loading">
                    <div class="loading-spinner"></div>
                    LOADING 360° VIEWER
                </div>
            `;
            
            // Clear current vehicle to prevent state issues
            this.currentCarId = null;
            
            // Refresh car data in case it was updated
            this.carData = this.getCarData();
            
            // Reset active state after a delay to allow for complete cleanup
            setTimeout(() => {
                isImmersiveViewerActive = false;
                console.log('✅ Immersive viewer fully closed and ready for next interaction');
            }, 100);
        }, 500);
    }
}

// Initialize immersive viewer
let immersiveViewerInstance;
let isImmersiveViewerActive = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    immersiveViewerInstance = new ImmersiveViewer();
    
    // Add click handlers to car images
    setTimeout(() => {
        addImmersiveClickHandlers();
    }, 500);
});

function addImmersiveClickHandlers() {
    console.log('🎯 Adding immersive click handlers...');
    
    // Remove existing handlers to prevent duplicates
    const existingHandlers = document.querySelectorAll('[data-immersive-handler]');
    existingHandlers.forEach(el => {
        el.removeAttribute('data-immersive-handler');
        // Clone and replace to remove all event listeners
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
    });
    
    let clickTimeout = null;
    
    // Homepage car items (both images and links)
    const homeCarItems = document.querySelectorAll('.car-item img, .car-card a[data-vehicle-id]');
    homeCarItems.forEach((element) => {
        element.style.cursor = 'pointer';
        element.setAttribute('data-immersive-handler', 'true');
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Debounce rapid clicks
            if (clickTimeout) return;
            clickTimeout = setTimeout(() => { clickTimeout = null; }, 1000);
            
            // Get vehicle ID from data attribute or use index
            const vehicleId = this.getAttribute('data-vehicle-id');
            const carId = vehicleId || (Array.from(document.querySelectorAll('.car-item img, .car-card')).indexOf(this.closest('.car-item, .car-card')) + 1);
            
            const sourceImg = this.tagName === 'IMG' ? this : this.closest('.car-card, .car-item').querySelector('img');
            immersiveViewerInstance.open(carId, sourceImg);
        });
    });
    
    // Inventory page car items - use event delegation to handle dynamically added items
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (inventoryGrid) {
        // Remove existing delegated listeners
        inventoryGrid.removeEventListener('click', handleInventoryClick);
        inventoryGrid.addEventListener('click', handleInventoryClick);
    }
}

function handleInventoryClick(e) {
    const img = e.target.closest('.inventory-item img');
    const viewBtn = e.target.closest('.view-details-btn');
    const inventoryItem = e.target.closest('.inventory-item');
    
    // If it's a view details button, let it redirect to product.html (don't handle here)
    if (viewBtn) {
        console.log('🔗 View Details button clicked - redirecting to product page');
        return; // Let the onclick handler do its job
    }
    
    // Only handle image clicks for immersive viewer
    if (!img) return;
    
    // Block all clicks if immersive viewer is active
    if (isImmersiveViewerActive) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚫 Immersive viewer active, blocking inventory click');
        return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    // Debounce rapid clicks
    if (img._clickTimeout) return;
    img._clickTimeout = setTimeout(() => { img._clickTimeout = null; }, 1000);
    
    const item = inventoryItem;
    const carId = extractCarIdFromItem(item);
    console.log('🚗 Opening immersive view for vehicle:', carId);
    immersiveViewerInstance.open(carId, img);
}

function extractCarIdFromItem(item) {
    // First try to get vehicle ID from data attribute
    const vehicleId = item.getAttribute('data-vehicle-id');
    if (vehicleId) {
        return vehicleId;
    }
    
    // Fallback: use position-based indexing
    const items = Array.from(document.querySelectorAll('.inventory-item'));
    return items.indexOf(item) + 1;
}

// Global function for external use
window.openImmersiveView = function(carId, sourceElement) {
    if (immersiveViewerInstance) {
        immersiveViewerInstance.open(carId, sourceElement);
    }
};