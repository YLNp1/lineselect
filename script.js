// Multilingual Support
const translations = {
    en: {
        brand: "LINE SELECT",
        inventory: "INVENTORY",
        about: "ABOUT",
        contact: "CONTACT",
        tagline: "EXCEPTIONAL AUTOMOTIVE EXCELLENCE",
        subtitle: "Where luxury meets performance",
        "view-inventory": "VIEW INVENTORY",
        price: "€189,500",
        "play-sound": "PLAY SOUND",
        "mute-sound": "MUTE",
        "price-label": "PRICE",
        "year-label": "YEAR",
        "power-label": "POWER",
        "mileage-label": "MILEAGE",
        "request-info": "REQUEST INFO",
        "schedule-viewing": "SCHEDULE VIEWING",
        "inventory-title": "CURRENT INVENTORY",
        "all-brands": "ALL BRANDS",
        "all-prices": "ALL PRICES",
        "view-details": "VIEW DETAILS",
        "about-title": "ABOUT LINE SELECT",
        "brand-story": "Line Select represents the intersection of automotive excellence and curatorial precision. We specialize in hand-selected performance vehicles that embody both engineering mastery and aesthetic perfection. Every car in our collection has been chosen for its ability to deliver an uncompromising driving experience while maintaining the highest standards of craftsmanship and design integrity.",
        "founders-title": "FOUNDERS",
        "founder-title-1": "CO-FOUNDER & CURATOR",
        "founder-bio-1": "Former automotive journalist with 15 years of experience in performance car evaluation. Specializes in identifying vehicles that combine technical excellence with emotional resonance. Graduated from TU Delft with a focus on automotive engineering and design philosophy.",
        "founder-title-2": "CO-FOUNDER & OPERATIONS",
        "founder-bio-2": "Former luxury retail director with expertise in high-end customer experience design. Brings precision to every aspect of the client journey, from initial consultation to delivery. Passionate about creating seamless interactions that match the quality of our vehicles.",
        "philosophy-title": "PHILOSOPHY",
        "philosophy-text": "We believe that exceptional cars deserve exceptional presentation. Our approach combines the meticulous attention to detail of a museum curator with the passion of true automotive enthusiasts. Each vehicle is more than a machine – it's a statement of intent, a work of art that happens to move.",
        "contact-title": "CONTACT",
        "name-label": "NAME",
        "email-label": "EMAIL",
        "phone-label": "PHONE (OPTIONAL)",
        "message-label": "MESSAGE",
        "submit-btn": "SEND MESSAGE",
        "location-title": "LOCATION",
        "location-text": "Parkstad\nNetherlands",
        "phone-title": "PHONE",
        "whatsapp-title": "WHATSAPP",
        "email-title": "EMAIL"
    },
    nl: {
        brand: "LINE SELECT",
        inventory: "INVENTARIS",
        about: "OVER ONS",
        contact: "CONTACT",
        tagline: "UITZONDERLIJKE AUTOMOTIVE EXCELLENTIE",
        subtitle: "Waar luxe en prestaties samenkomen",
        "view-inventory": "BEKIJK INVENTARIS",
        price: "€189.500",
        "play-sound": "GELUID AFSPELEN",
        "mute-sound": "DEMPEN",
        "price-label": "PRIJS",
        "year-label": "JAAR",
        "power-label": "VERMOGEN",
        "mileage-label": "KILOMETERSTAND",
        "request-info": "INFORMATIE AANVRAGEN",
        "schedule-viewing": "BEZICHTIGING PLANNEN"
    },
    de: {
        brand: "LINE SELECT",
        inventory: "INVENTAR",
        about: "ÜBER UNS",
        contact: "KONTAKT",
        tagline: "AUSSERGEWÖHNLICHE AUTOMOTIVE EXZELLENZ",
        subtitle: "Wo Luxus auf Leistung trifft",
        "view-inventory": "INVENTAR ANSEHEN",
        price: "€189.500",
        "play-sound": "SOUND ABSPIELEN",
        "mute-sound": "STUMM",
        "price-label": "PREIS",
        "year-label": "JAHR",
        "power-label": "LEISTUNG",
        "mileage-label": "LAUFLEISTUNG",
        "request-info": "INFO ANFORDERN",
        "schedule-viewing": "BESICHTIGUNG PLANEN"
    }
};

// Car database
const carData = {
    1: {
        name: "PORSCHE 911 GT3",
        price: "€189,500",
        year: "2023",
        power: "510 HP",
        mileage: "2,500 KM",
        description: {
            en: "This exceptional GT3 represents the pinnacle of Porsche's racing heritage. With its naturally aspirated engine and precision-tuned suspension, it delivers an uncompromising driving experience that connects you directly to the road.",
            nl: "Deze uitzonderlijke GT3 vertegenwoordigt het hoogtepunt van Porsche's raceheritagee. Met zijn atmosferische motor en precisie-afgestelde ophanging levert het een compromisloze rijervaring die je direct met de weg verbindt.",
            de: "Dieser außergewöhnliche GT3 repräsentiert den Höhepunkt von Porsches Rennheritage. Mit seinem Saugmotor und der präzisionsabgestimmten Aufhängung liefert er ein kompromissloses Fahrerlebnis, das Sie direkt mit der Straße verbindet."
        }
    },
    2: {
        name: "McLAREN 720S",
        price: "€295,000",
        year: "2022",
        power: "720 HP",
        mileage: "1,800 KM",
        description: {
            en: "The McLaren 720S embodies the perfect fusion of cutting-edge technology and raw performance. Its carbon fiber construction and twin-turbo V8 engine deliver breathtaking acceleration and handling precision.",
            nl: "De McLaren 720S belichaamt de perfecte fusie van geavanceerde technologie en pure prestaties. Zijn carbon fiber constructie en twin-turbo V8 motor leveren adembenemende acceleratie en handling precisie.",
            de: "Der McLaren 720S verkörpert die perfekte Fusion aus modernster Technologie und roher Leistung. Seine Kohlefaserkonstruktion und der Twin-Turbo-V8-Motor liefern atemberaubende Beschleunigung und Handling-Präzision."
        }
    },
    3: {
        name: "LAMBORGHINI HURACÁN",
        price: "€225,000",
        year: "2023",
        power: "640 HP",
        mileage: "900 KM",
        description: {
            en: "The Huracán represents Italian automotive artistry at its finest. Every curve and line has been sculpted to perfection, housing a naturally aspirated V10 that sings with unmistakable passion.",
            nl: "De Huracán vertegenwoordigt Italiaans automotive kunstenaarschap op zijn best. Elke curve en lijn is tot perfectie gebeeldhouwd, met een atmosferische V10 die zingt met onmiskenbare passie.",
            de: "Der Huracán repräsentiert italienische Automobilkunst vom Feinsten. Jede Kurve und Linie wurde zur Perfektion geformt und beherbergt einen Saugmotor V10, der mit unverkennbarer Leidenschaft singt."
        }
    }
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSelector();
    initializeProductPage();
    initializeAudioControls();
    initializeSmoothScrolling();
    initializeVideoFallback();
});

// Language functionality
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
}

function changeLanguage(lang) {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update product description if on product page
    const productDesc = document.getElementById('product-desc');
    if (productDesc) {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('id') || '1';
        if (carData[carId] && carData[carId].description[lang]) {
            productDesc.textContent = carData[carId].description[lang];
        }
    }
}

// Product page functionality
function initializeProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id') || '1';
    
    if (carData[carId]) {
        const car = carData[carId];
        
        // Update product details
        const productName = document.getElementById('product-name');
        const productPrice = document.getElementById('product-price');
        const productYear = document.getElementById('product-year');
        const productPower = document.getElementById('product-power');
        const productMileage = document.getElementById('product-mileage');
        const productDesc = document.getElementById('product-desc');
        
        if (productName) productName.textContent = car.name;
        if (productPrice) productPrice.textContent = car.price;
        if (productYear) productYear.textContent = car.year;
        if (productPower) productPower.textContent = car.power;
        if (productMileage) productMileage.textContent = car.mileage;
        if (productDesc) productDesc.textContent = car.description.en;
        
        // Update page title
        document.title = `LINE SELECT - ${car.name}`;
    }
}

// Audio controls
function initializeAudioControls() {
    const playButton = document.getElementById('play-sound');
    const muteButton = document.getElementById('mute-sound');
    const engineSound = document.getElementById('engine-sound');
    
    if (playButton && muteButton && engineSound) {
        playButton.addEventListener('click', function() {
            engineSound.play().catch(e => {
                console.log('Audio play failed:', e);
                // Fallback: show visual feedback
                this.textContent = 'SOUND UNAVAILABLE';
                setTimeout(() => {
                    this.textContent = 'PLAY SOUND';
                }, 2000);
            });
            playButton.style.display = 'none';
            muteButton.style.display = 'inline-block';
        });
        
        muteButton.addEventListener('click', function() {
            engineSound.pause();
            engineSound.currentTime = 0;
            muteButton.style.display = 'none';
            playButton.style.display = 'inline-block';
        });
        
        // Auto-hide mute button when sound ends
        engineSound.addEventListener('ended', function() {
            muteButton.style.display = 'none';
            playButton.style.display = 'inline-block';
        });
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form handlers for product actions
document.addEventListener('DOMContentLoaded', function() {
    const requestInfoBtn = document.querySelector('[data-translate="request-info"]');
    const scheduleViewingBtn = document.querySelector('[data-translate="schedule-viewing"]');
    
    if (requestInfoBtn) {
        requestInfoBtn.addEventListener('click', function() {
            // In a real application, this would open a contact form
            alert('Request info functionality would be implemented here');
        });
    }
    
    if (scheduleViewingBtn) {
        scheduleViewingBtn.addEventListener('click', function() {
            // In a real application, this would open a scheduling interface
            alert('Schedule viewing functionality would be implemented here');
        });
    }
});

// 360° Viewer simulation (placeholder functionality)
function initialize360Viewer() {
    const viewerContainer = document.querySelector('.viewer-container');
    if (viewerContainer) {
        let isDragging = false;
        let startX = 0;
        let currentRotation = 0;
        
        viewerContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            startX = e.clientX;
            this.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            currentRotation += deltaX * 0.5;
            
            // Update visual feedback (in a real implementation, this would control the 360° view)
            const viewer = viewerContainer.querySelector('.viewer-placeholder');
            if (viewer) {
                viewer.style.transform = `rotateY(${currentRotation}deg)`;
            }
            
            startX = e.clientX;
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
            viewerContainer.style.cursor = 'grab';
        });
        
        // Touch events for mobile
        viewerContainer.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - startX;
            currentRotation += deltaX * 0.5;
            
            const viewer = viewerContainer.querySelector('.viewer-placeholder');
            if (viewer) {
                viewer.style.transform = `rotateY(${currentRotation}deg)`;
            }
            
            startX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', function() {
            isDragging = false;
        });
    }
}

// Initialize 360° viewer after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initialize360Viewer, 1500);
});

// Video fallback functionality
function initializeVideoFallback() {
    const video = document.querySelector('.hero-video');
    const fallback = document.querySelector('.hero-fallback');
    
    if (video && fallback) {
        video.addEventListener('error', function() {
            video.style.display = 'none';
            fallback.style.display = 'block';
        });
        
        // Check if video loads within 3 seconds
        setTimeout(function() {
            if (video.readyState === 0) {
                video.style.display = 'none';
                fallback.style.display = 'block';
            }
        }, 3000);
    }
}