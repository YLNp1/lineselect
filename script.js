// API Configuration
const API_URL = 'http://localhost:5000/api';

// Car data cache
let carData = {};
let vehiclesLoaded = false;

// Fetch vehicles from CMS
async function loadVehicles() {
    try {
        console.log('🚗 Loading vehicles from CMS...');
        const response = await fetch(`${API_URL}/vehicles`);
        console.log('📡 API Response status:', response.status);
        const data = await response.json();
        console.log('📊 API Data:', data);
        
        if (data.success && data.data) {
            // Convert API data to our format
            carData = {};
            
            // Media is already included in the vehicle response, no need to fetch separately
            for (const vehicle of data.data) {
                console.log(`🚗 Vehicle ${vehicle.brand} ${vehicle.model} has ${vehicle.media ? vehicle.media.length : 0} media items`);
                
                carData[vehicle.id] = {
                    id: vehicle.id,
                    name: `${vehicle.brand} ${vehicle.model}`,
                    price: `€${vehicle.price.toLocaleString()}`,
                    year: vehicle.year.toString(),
                    power: vehicle.power || 'N/A',
                    mileage: `${vehicle.mileage.toLocaleString()} KM`,
                    description: vehicle.description || '',
                    engineType: vehicle.engineType,
                    transmission: vehicle.transmission,
                    exteriorColor: vehicle.exteriorColor,
                    interiorColor: vehicle.interiorColor,
                    features: vehicle.features || [],
                    featuredImage: vehicle.featuredImage,
                    view360Url: vehicle.view360Url,
                    engineSoundUrl: vehicle.engineSoundUrl,
                    media: vehicle.media || []
                };
            }
            
            vehiclesLoaded = true;
            return true;
        }
    } catch (error) {
        console.error('❌ Failed to load vehicles from CMS:', error);
        console.log('🔄 Using fallback static data...');
        // Fallback to static data
        carData = {
            1: {
                name: "PORSCHE 911 GT3",
                price: "€189,500",
                year: "2023",
                power: "510 HP",
                mileage: "2,500 KM",
                description: "This exceptional GT3 represents the pinnacle of Porsche's racing heritage."
            },
            2: {
                name: "McLAREN 720S",
                price: "€295,000",
                year: "2022",
                power: "720 HP",
                mileage: "1,800 KM",
                description: "The McLaren 720S embodies the perfect fusion of cutting-edge technology and raw performance."
            },
            3: {
                name: "LAMBORGHINI HURACÁN",
                price: "€225,000",
                year: "2023",
                power: "640 HP",
                mileage: "900 KM",
                description: "The Huracán represents Italian automotive artistry at its finest."
            }
        };
    }
    return false;
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 LINE SELECT - Starting application...');
    console.log('🌐 Current page:', window.location.pathname);
    
    // Load vehicles from CMS first
    await loadVehicles();
    
    // Then initialize page functionality
    initializeProductPage();
    initializeAudioControls();
    initializeSmoothScrolling();
    initializeVideoFallback();
    
    // If on homepage or inventory, update car cards
    updateCarCards();
});

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
        if (productDesc) productDesc.textContent = car.description;
        
        // Update additional details if available
        if (car.engineType) {
            const engineTypeEl = document.getElementById('engine-type');
            if (engineTypeEl) engineTypeEl.textContent = car.engineType;
        }
        
        if (car.transmission) {
            const transmissionEl = document.getElementById('transmission');
            if (transmissionEl) transmissionEl.textContent = car.transmission;
        }
        
        // Update 360° view if available
        if (car.view360Url) {
            const viewerContainer = document.querySelector('.viewer-container');
            if (viewerContainer) {
                viewerContainer.innerHTML = `<iframe src="${car.view360Url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
            }
        }
        
        // Update engine sound if available
        if (car.engineSoundUrl) {
            const engineSound = document.getElementById('engine-sound');
            if (engineSound) {
                engineSound.src = car.engineSoundUrl;
            }
        }
        
        // Update images from media
        if (car.media && car.media.length > 0) {
            const images = car.media.filter(m => m.type === 'image');
            const audio = car.media.filter(m => m.type === 'audio');
            
            // Handle audio files by category
            if (audio.length > 0) {
                const engineRevAudio = audio.find(a => a.audioCategory === 'engine_rev');
                if (engineRevAudio) {
                    const engineSound = document.getElementById('engine-sound');
                    if (engineSound) {
                        engineSound.src = `http://localhost:5000${engineRevAudio.url}`;
                    }
                }
            }
        }
        
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
    const requestInfoBtn = document.querySelector('.btn-primary');
    const scheduleViewingBtn = document.querySelector('.btn:not(.btn-primary)');
    
    if (requestInfoBtn) {
        requestInfoBtn.addEventListener('click', function() {
            // In a real application, this would open a contact form
            alert('Request info functionality would be implemented here');
        });
    }
    
    if (scheduleViewingBtn) {
        scheduleViewingBtn.addEventListener('click', function() {
            // Redirect to inventory page to view available vehicles
            window.location.href = 'inventory.html';
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

// Update car cards on homepage and inventory
function updateCarCards() {
    console.log('🔄 Updating car cards...');
    console.log('🚗 Available car data:', Object.keys(carData));
    
    // Update inventory items if on inventory page
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (inventoryGrid) {
        console.log('📋 Found inventory grid, updating...');
        // Clear existing items
        inventoryGrid.innerHTML = '';
        
        // Collect unique brands for filter
        const brands = new Set();
        
        // Add vehicles from CMS
        Object.values(carData).forEach(vehicle => {
            const brand = vehicle.name.split(' ')[0].toLowerCase();
            brands.add(brand);
            
            // Find the main image from media array or use featuredImage
            let mainImageUrl = vehicle.featuredImage;
            if (vehicle.media && vehicle.media.length > 0) {
                console.log(`🖼️ Vehicle ${vehicle.name} has ${vehicle.media.length} media items:`, vehicle.media);
                const mainImage = vehicle.media.find(m => m.type === 'image' && m.isMain);
                if (mainImage) {
                    console.log(`✅ Found main image for ${vehicle.name}:`, mainImage.url);
                    mainImageUrl = mainImage.url;
                } else {
                    // If no main image, use the first image
                    const firstImage = vehicle.media.find(m => m.type === 'image');
                    if (firstImage) {
                        console.log(`📷 Using first image for ${vehicle.name}:`, firstImage.url);
                        mainImageUrl = firstImage.url;
                    }
                }
            } else {
                console.log(`⚠️ No media found for ${vehicle.name}, using featuredImage:`, vehicle.featuredImage);
            }
            
            const itemHTML = `
                <div class="inventory-item" data-brand="${brand}" data-price="${vehicle.price.replace(/[^0-9]/g, '')}" data-vehicle-id="${vehicle.id}">
                    <div class="item-image">
                        <img src="${mainImageUrl ? `http://localhost:5000${mainImageUrl}` : `https://via.placeholder.com/800x600/1a1a1a/ffffff?text=${encodeURIComponent(vehicle.name)}`}" alt="${vehicle.name}">
                    </div>
                    <div class="item-info">
                        <h3 class="heading-card">${vehicle.name}</h3>
                        <p class="item-year text-xs">${vehicle.year} • ${vehicle.mileage} • ${vehicle.engineType || vehicle.power}</p>
                        <p class="item-price">${vehicle.price}</p>
                        <button class="btn view-details-btn" onclick="window.location.href='product.html?id=${vehicle.id}'">VIEW DETAILS</button>
                    </div>
                </div>
            `;
            inventoryGrid.insertAdjacentHTML('beforeend', itemHTML);
        });
        
        // Update brand filter options
        const brandFilter = document.getElementById('brand-filter');
        if (brandFilter) {
            // Keep "All Marques" option and add dynamic brands
            const currentValue = brandFilter.value;
            brandFilter.innerHTML = '<option value="all">ALL MARQUES</option>';
            
            // Add sorted brands
            Array.from(brands).sort().forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand.toUpperCase();
                brandFilter.appendChild(option);
            });
            
            // Restore previous selection if it still exists
            if (currentValue && brandFilter.querySelector(`option[value="${currentValue}"]`)) {
                brandFilter.value = currentValue;
            }
        }
        
        // Re-initialize filter functionality
        initializeInventoryFilters();
        
        // Re-initialize immersive click handlers after inventory update
        if (typeof addImmersiveClickHandlers === 'function') {
            setTimeout(() => {
                addImmersiveClickHandlers();
            }, 100);
        }
    }
    
    // Update featured cars on homepage if they exist
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach((card, index) => {
        const carId = card.getAttribute('data-car-id') || Object.keys(carData)[index];
        const vehicle = carData[carId];
        
        if (vehicle) {
            // Update card content
            const nameElement = card.querySelector('.car-name');
            const priceElement = card.querySelector('.car-price');
            const yearElement = card.querySelector('.car-year');
            const powerElement = card.querySelector('.car-power');
            const mileageElement = card.querySelector('.car-mileage');
            
            if (nameElement) nameElement.textContent = vehicle.name;
            if (priceElement) priceElement.textContent = vehicle.price;
            if (yearElement) yearElement.textContent = vehicle.year;
            if (powerElement) powerElement.textContent = vehicle.power;
            if (mileageElement) mileageElement.textContent = vehicle.mileage;
            
            // Remove any product.html links - use immersive viewer only
            const links = card.querySelectorAll('a[href*="product.html"]');
            links.forEach(link => {
                link.removeAttribute('href');
                link.setAttribute('data-vehicle-id', vehicle.id);
                link.style.cursor = 'pointer';
            });
            
            // Update image if available
            const imgElement = card.querySelector('.car-image');
            if (imgElement) {
                // Find the main image from media array or use featuredImage
                let mainImageUrl = vehicle.featuredImage;
                if (vehicle.media && vehicle.media.length > 0) {
                    const mainImage = vehicle.media.find(m => m.type === 'image' && m.isMain);
                    if (mainImage) {
                        mainImageUrl = mainImage.url;
                    } else {
                        // If no main image, use the first image
                        const firstImage = vehicle.media.find(m => m.type === 'image');
                        if (firstImage) {
                            mainImageUrl = firstImage.url;
                        }
                    }
                }
                
                if (mainImageUrl) {
                    imgElement.src = `http://localhost:5000${mainImageUrl}`;
                    imgElement.alt = vehicle.name;
                }
            }
        }
    });
}

// Initialize inventory filters
function initializeInventoryFilters() {
    const brandFilter = document.getElementById('brand-filter');
    const priceFilter = document.getElementById('price-filter');
    const inventoryItems = document.querySelectorAll('.inventory-item');

    function filterInventory() {
        const selectedBrand = brandFilter?.value || 'all';
        const selectedPrice = priceFilter?.value || 'all';

        inventoryItems.forEach(item => {
            const itemBrand = item.getAttribute('data-brand');
            const itemPrice = parseInt(item.getAttribute('data-price'));
            
            let showItem = true;

            // Brand filter
            if (selectedBrand !== 'all' && itemBrand !== selectedBrand) {
                showItem = false;
            }

            // Price filter
            if (selectedPrice !== 'all') {
                switch (selectedPrice) {
                    case 'under-200':
                        if (itemPrice >= 200000) showItem = false;
                        break;
                    case '200-300':
                        if (itemPrice < 200000 || itemPrice >= 300000) showItem = false;
                        break;
                    case '300-500':
                        if (itemPrice < 300000 || itemPrice >= 500000) showItem = false;
                        break;
                    case 'over-500':
                        if (itemPrice < 500000) showItem = false;
                        break;
                }
            }

            // Show/hide item with smooth transition
            if (showItem) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 10);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    if (brandFilter) brandFilter.addEventListener('change', filterInventory);
    if (priceFilter) priceFilter.addEventListener('change', filterInventory);
}

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