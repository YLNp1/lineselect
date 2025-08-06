const { Vehicle } = require('./src/models');
const { generateSlug } = require('./src/utils/helpers');

const existingCars = [
  {
    brand: "PORSCHE",
    model: "911 GT3", 
    year: 2023,
    price: 189500,
    mileage: 2500,
    power: "510 HP",
    engineType: "Naturally Aspirated Flat-6",
    transmission: "7-Speed PDK",
    exteriorColor: "Guards Red",
    interiorColor: "Black Leather",
    description: "This exceptional GT3 represents the pinnacle of Porsche's racing heritage. With its naturally aspirated engine and precision-tuned suspension, it delivers an uncompromising driving experience that connects you directly to the road.",
    features: [
      "Track Package",
      "Carbon Fiber Aero Kit", 
      "Ceramic Brakes",
      "Roll Cage",
      "Racing Seats",
      "Michelin Pilot Sport Cup 2 Tires"
    ],
    status: "active"
  },
  {
    brand: "McLAREN",
    model: "720S",
    year: 2022, 
    price: 295000,
    mileage: 1800,
    power: "720 HP",
    engineType: "Twin-Turbo V8",
    transmission: "7-Speed SSG",
    exteriorColor: "McLaren Orange",
    interiorColor: "Carbon Black Alcantara",
    description: "The McLaren 720S embodies the perfect fusion of cutting-edge technology and raw performance. Its carbon fiber construction and twin-turbo V8 engine deliver breathtaking acceleration and handling precision.",
    features: [
      "Carbon Fiber Body",
      "Adaptive Suspension",
      "Active Aerodynamics", 
      "Pirelli P Zero Corsa Tires",
      "McLaren Track Telemetry",
      "Bowers & Wilkins Audio"
    ],
    status: "active"
  },
  {
    brand: "LAMBORGHINI", 
    model: "HURACÁN",
    year: 2023,
    price: 225000,
    mileage: 900,
    power: "640 HP", 
    engineType: "Naturally Aspirated V10",
    transmission: "7-Speed Dual-Clutch",
    exteriorColor: "Arancio Borealis",
    interiorColor: "Nero Alde Leather",
    description: "The Huracán represents Italian automotive artistry at its finest. Every curve and line has been sculpted to perfection, housing a naturally aspirated V10 that sings with unmistakable passion.",
    features: [
      "All-Wheel Drive",
      "Carbon Ceramic Brakes",
      "Magnetic Ride Control",
      "Pirelli P Zero Tires",
      "Sport Exhaust System",
      "Alcantara Interior Package"
    ],
    status: "active"
  }
];

async function importCars() {
  try {
    console.log('🚗 Importing existing vehicles from website...');
    
    for (const carData of existingCars) {
      // Generate unique slug
      carData.slug = await generateSlug(`${carData.brand} ${carData.model} ${carData.year}`);
      
      // Check if car already exists
      const existing = await Vehicle.findOne({
        where: { slug: carData.slug }
      });
      
      if (existing) {
        console.log(`⚠️  ${carData.brand} ${carData.model} already exists, skipping...`);
        continue;
      }
      
      // Create vehicle
      const vehicle = await Vehicle.create(carData);
      console.log(`✅ Added: ${vehicle.brand} ${vehicle.model} (${vehicle.year})`);
    }
    
    console.log('\n🎉 Import completed successfully!');
    console.log(`Total vehicles added: ${existingCars.length}`);
    
    // Show summary
    const totalVehicles = await Vehicle.count();
    console.log(`📊 Total vehicles in database: ${totalVehicles}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    process.exit();
  }
}

importCars();