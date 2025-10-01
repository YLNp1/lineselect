// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinkElements = document.querySelectorAll('.nav-link');
    
    navLinkElements.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '#')) {
            link.classList.add('active');
        }
    });

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking a link
        const navLinkElements = document.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-container') && navLinks.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
});

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
    const cmsLoaded = await loadVehicles();
    
    // Then initialize page functionality
    initializeProductPage();
    initializeAudioControls();
    initializeSmoothScrolling();
    initializeVideoFallback();
    
    // Initialize inventory page if we're on it
    if (window.location.pathname.includes('inventory.html')) {
        console.log('🚗 Initializing inventory page...');
        // Save the original sale inventory HTML
        const inventoryGrid = document.querySelector('.inventory-grid');
        if (inventoryGrid) {
            saleInventoryHTML = inventoryGrid.innerHTML;
        }
        
        // Initialize filter functionality
        initializeInventoryFilters();
        console.log('🔧 Filter functionality initialized');
        
        // Make sure rent cars are hidden on page load
        setTimeout(() => {
            // Set initial state for inventory grid
            const inventoryGrid = document.querySelector('.inventory-grid');
            if (inventoryGrid) {
                inventoryGrid.classList.add('active');
            }
            showSaleInventory();
        }, 100);
    }
    
    // Only update car cards if we successfully loaded from CMS
    // Otherwise keep the static HTML content
    if (cmsLoaded) {
        updateCarCards();
    } else {
        console.log('📌 Keeping static HTML content since CMS is unavailable');
    }
});

// Product page functionality
function initializeProductPage() {
    // Only run on product page
    if (!window.location.pathname.includes('product.html')) {
        return;
    }
    
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
        // Only clear if we have data to replace it with
        if (Object.keys(carData).length === 0) {
            console.log('⚠️ No car data available, keeping existing content');
            return;
        }
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
    const brandFilterRent = document.getElementById('brand-filter-rent');
    const priceFilterRent = document.getElementById('price-filter-rent');

    function filterInventory() {
        console.log('🔍 Filter inventory called');
        
        // Get active tab type
        const currentTab = document.querySelector('.car-tab.active');
        const activeTabType = currentTab ? currentTab.getAttribute('data-tab') : 'sale';
        console.log('📋 Active tab type:', activeTabType);
        
        // Get active filters based on tab
        const activeBrandFilter = activeTabType === 'sale' ? brandFilter : brandFilterRent;
        const activePriceFilter = activeTabType === 'sale' ? priceFilter : priceFilterRent;
        
        const selectedBrand = activeBrandFilter?.value || '';
        const selectedPrice = activePriceFilter?.value || '';
        
        console.log('🏷️ Selected brand:', selectedBrand);
        console.log('💰 Selected price:', selectedPrice);
        
        const inventoryCards = document.querySelectorAll('.inventory-card');
        console.log('🚗 Found cards:', inventoryCards.length);
        
        // First, add filtering-out class to all visible cards
        inventoryCards.forEach((card, index) => {
            if (!card.classList.contains('filtered-hidden')) {
                console.log(`⏳ Adding filtering-out to card ${index}`);
                setTimeout(() => {
                    card.classList.add('filtering-out');
                }, index * 30); // Staggered animation
            }
        });
        
        // Then apply filters after animation
        setTimeout(() => {
            inventoryCards.forEach((card, index) => {
                const cardType = card.getAttribute('data-type');
                const itemBrand = card.getAttribute('data-brand');
                const itemPrice = parseInt(card.getAttribute('data-price'));
                
                console.log(`🔍 Checking card ${index}: type=${cardType}, brand=${itemBrand}, price=${itemPrice}`);
                
                let showItem = true;

                // Filter by tab type first
                if (cardType !== activeTabType) {
                    showItem = false;
                    console.log(`❌ Card ${index} hidden due to tab type`);
                }

                // Brand filter
                if (showItem && selectedBrand && selectedBrand !== '' && itemBrand !== selectedBrand) {
                    showItem = false;
                    console.log(`❌ Card ${index} hidden due to brand filter`);
                }

                // Price filter
                if (showItem && selectedPrice && selectedPrice !== '') {
                    switch (selectedPrice) {
                        case '0-300000':
                            if (itemPrice >= 300000) showItem = false;
                            break;
                        case '300000-400000':
                            if (itemPrice < 300000 || itemPrice > 400000) showItem = false;
                            break;
                        case '400000+':
                            if (itemPrice < 400000) showItem = false;
                            break;
                        // Rent price filters
                        case '0-1000':
                            if (itemPrice >= 1000) showItem = false;
                            break;
                        case '1000-2000':
                            if (itemPrice < 1000 || itemPrice > 2000) showItem = false;
                            break;
                        case '2000+':
                            if (itemPrice < 2000) showItem = false;
                            break;
                    }
                    if (!showItem) {
                        console.log(`❌ Card ${index} hidden due to price filter`);
                    }
                }

                // Remove all animation classes first
                card.classList.remove('filtering-out', 'filtering-in');
                
                // Apply visibility with animation
                if (showItem) {
                    console.log(`✅ Card ${index} will be shown`);
                    card.classList.remove('filtered-hidden');
                    // Add filtering-in class with delay for staggered effect
                    setTimeout(() => {
                        card.classList.add('filtering-in');
                        setTimeout(() => {
                            card.classList.remove('filtering-in');
                        }, 300);
                    }, index * 50);
                } else {
                    console.log(`🚫 Card ${index} will be hidden`);
                    setTimeout(() => {
                        card.classList.add('filtered-hidden');
                    }, 400);
                }
            });
            
            // Update inventory count
            setTimeout(() => {
                updateInventoryCount();
            }, 500);
        }, 400);
    }

    // Make filterInventory available globally for inventory.html
    window.filterInventory = filterInventory;

    if (brandFilter) brandFilter.addEventListener('change', filterInventory);
    if (priceFilter) priceFilter.addEventListener('change', filterInventory);
    if (brandFilterRent) brandFilterRent.addEventListener('change', filterInventory);
    if (priceFilterRent) priceFilterRent.addEventListener('change', filterInventory);
}

// Update inventory count based on visible cards
function updateInventoryCount() {
    const visibleCards = document.querySelectorAll('.inventory-card:not(.filtered-hidden)');
    const inventoryCount = document.getElementById('inventory-count');
    const activeTab = document.querySelector('.car-tab.active');
    
    if (inventoryCount && activeTab) {
        const tabType = activeTab.getAttribute('data-tab');
        const suffix = tabType === 'rent' ? ' AUTO\'S TE HUUR' : ' AUTO\'S OP VOORRAAD';
        inventoryCount.textContent = visibleCards.length + suffix;
    }
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

// Sale cars data (backup for switching back from rent)
let saleInventoryHTML = '';

// Store the original sale inventory HTML when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const inventoryGrid = document.querySelector('.inventory-grid');
        if (inventoryGrid && !saleInventoryHTML) {
            saleInventoryHTML = inventoryGrid.innerHTML;
        }
    }, 200);
});

// Inventory tab functionality
window.showSaleInventory = function(skipTransition = false) {
    const tabs = document.querySelectorAll('.car-tab');
    const inventoryCount = document.getElementById('inventory-count');
    const saleFilters = document.querySelector('.sale-filters');
    const rentFilters = document.querySelector('.rent-filters');
    const inventoryGrid = document.querySelector('.inventory-grid');
    
    if (!inventoryGrid) {
        console.error('Inventory grid not found');
        return;
    }
    
    // Skip transition on initial load
    if (skipTransition) {
        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[data-tab="sale"]').classList.add('active');
        
        // Show/hide appropriate filters
        if (saleFilters) saleFilters.style.display = 'flex';
        if (rentFilters) rentFilters.style.display = 'none';
        
        // Update count
        const saleCars = document.querySelectorAll('[data-type="sale"]');
        if (inventoryCount) {
            inventoryCount.textContent = saleCars.length + ' AUTO\'S OP VOORRAAD';
        }
        
        // Ensure grid is active
        inventoryGrid.classList.add('active');
        return;
    }
    
    // Remove any existing transition classes first
    inventoryGrid.classList.remove('active', 'transitioning-in');
    
    // Add transition effect
    inventoryGrid.classList.add('transitioning-out');
    
    setTimeout(() => {
        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[data-tab="sale"]').classList.add('active');
        
        // Show/hide appropriate filters
        if (saleFilters) saleFilters.style.display = 'flex';
        if (rentFilters) rentFilters.style.display = 'none';
        
        // Restore sale inventory
        if (saleInventoryHTML) {
            inventoryGrid.innerHTML = saleInventoryHTML;
        }
        
        // Update count
        const saleCars = document.querySelectorAll('[data-type="sale"]');
        if (inventoryCount) {
            inventoryCount.textContent = saleCars.length + ' AUTO\'S OP VOORRAAD';
        }
        
        // Prepare for fade in
        inventoryGrid.classList.remove('transitioning-out');
        inventoryGrid.classList.add('transitioning-in');
        
        // Trigger fade in
        setTimeout(() => {
            inventoryGrid.classList.remove('transitioning-in');
            inventoryGrid.classList.add('active');
        }, 50);
    }, 400);
}

// Rental cars data
const rentalCars = [
    {
        brand: 'mclaren',
        price: 1500,
        year: 2022,
        name: 'MCLAREN 720S',
        variant: 'Coupe • Carbon Fiber Package',
        specs: ['2022', 'MIN. 3 DAGEN', '720 PK', '341 KM/H'],
        displayPrice: '€1.500/dag',
        image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop&q=80',
        id: 'mclaren-720s-rent'
    },
    {
        brand: 'lamborghini',
        price: 1800,
        year: 2023,
        name: 'LAMBORGHINI HURACÁN EVO',
        variant: 'Spyder • Performance Package',
        specs: ['2023', 'MIN. 2 DAGEN', '640 PK', '325 KM/H'],
        displayPrice: '€1.800/dag',
        image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&h=600&fit=crop&q=80',
        id: 'lamborghini-huracan-rent'
    }
];

window.showRentInventory = function() {
    const tabs = document.querySelectorAll('.car-tab');
    const inventoryCount = document.getElementById('inventory-count');
    const saleFilters = document.querySelector('.sale-filters');
    const rentFilters = document.querySelector('.rent-filters');
    const inventoryGrid = document.querySelector('.inventory-grid');
    
    
    if (!inventoryGrid) {
        console.error('Inventory grid not found');
        return;
    }
    
    // Remove any existing transition classes first
    inventoryGrid.classList.remove('active', 'transitioning-in');
    
    // Add transition effect
    inventoryGrid.classList.add('transitioning-out');
    
    setTimeout(() => {
        // Update active tab
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('[data-tab="rent"]').classList.add('active');
        
        // Show/hide appropriate filters
        if (saleFilters) saleFilters.style.display = 'none';
        if (rentFilters) rentFilters.style.display = 'flex';
        
        // Clear inventory and add rental cars
        if (inventoryGrid) {
            inventoryGrid.innerHTML = '';
        
        rentalCars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'inventory-card';
            carCard.setAttribute('data-brand', car.brand);
            carCard.setAttribute('data-price', car.price);
            carCard.setAttribute('data-year', car.year);
            carCard.setAttribute('data-type', 'rent');
            
            carCard.innerHTML = `
                <div class="car-image-container">
                    <img src="${car.image}" alt="${car.name}" class="car-image">
                </div>
                <div class="car-details">
                    <div class="car-title">
                        <h3 class="car-name">${car.name}</h3>
                        <p class="car-variant">${car.variant}</p>
                    </div>
                    <div class="car-specs">
                        ${car.specs.map(spec => `
                            <div class="spec-item">
                                <span class="spec-label">${spec}</span>
                            </div>
                        `).join('')}
                    </div>
                    <p class="car-price">${car.displayPrice}</p>
                    <button class="btn-details" onclick="transitionToProduct('${car.id}')">BEKIJK DETAILS</button>
                </div>
            `;
            
            inventoryGrid.appendChild(carCard);
        });
        }
        
        // Update count
        if (inventoryCount) {
            inventoryCount.textContent = rentalCars.length + ' AUTO\'S TE HUUR';
        }
        
        // Prepare for fade in
        inventoryGrid.classList.remove('transitioning-out');
        inventoryGrid.classList.add('transitioning-in');
        
        // Trigger fade in
        setTimeout(() => {
            inventoryGrid.classList.remove('transitioning-in');
            inventoryGrid.classList.add('active');
        }, 50);
    }, 400);
}

