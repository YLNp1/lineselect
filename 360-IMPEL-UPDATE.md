# 🎬 360° Impel View & Auto Import Update

Het Line Select CMS is uitgebreid met 360° Impel ondersteuning en alle bestaande auto's uit je website zijn geïmporteerd!

## ✨ **Nieuwe Features:**

### 🎬 **360° Impel Integration**
- **360° View URL veld** - Voeg Impel embed URLs toe
- **Engine Sound URL** - Link naar motorgeluid bestanden  
- **Audio Upload** - Upload MP3/WAV files direct via drag & drop
- **Audio Player** - Ingebouwde audio controls in het CMS

### 📊 **Data Import Voltooid**
Alle bestaande voertuigen uit je website zijn geïmporteerd:

✅ **PORSCHE 911 GT3 (2023)**
- Prijs: €189,500 | 2,500 km | 510 HP
- Inclusief: Track Package, Carbon Fiber Aero Kit, Ceramic Brakes

✅ **McLAREN 720S (2022)**  
- Prijs: €295,000 | 1,800 km | 720 HP
- Inclusief: Carbon Fiber Body, Active Aerodynamics, McLaren Track Telemetry

✅ **LAMBORGHINI HURACÁN (2023)**
- Prijs: €225,000 | 900 km | 640 HP
- Inclusief: All-Wheel Drive, Magnetic Ride Control, Sport Exhaust

## 🚀 **Hoe te gebruiken:**

### 1. **360° View toevoegen:**
1. **Ga naar een voertuig bewerken**
2. **Scroll naar "360° View & Audio"**
3. **Voeg Impel embed URL toe:** `https://impel.app/embed/your-360-view-id`
4. **Sla op**

### 2. **Motorgeluid toevoegen:**
**Optie A: URL**
- Voeg directe link toe naar MP3/WAV bestand

**Optie B: Upload**
- Sleep audiobestand in de "Engine Sound" upload zone
- Automatische conversie en opslag

### 3. **Test de integratie:**
- Open je frontend website
- De 360° views worden automatisch geladen
- Motorgeluid speelt af via de frontend controls

## 🔧 **Technische Details:**

### **Database Updates:**
- `view360Url` veld toegevoegd voor Impel embed URLs
- `engineSoundUrl` veld voor audio links
- Media tabel ondersteunt audio files (MP3, WAV)

### **API Endpoints:**
- `/api/vehicles` - Alle voertuigdata inclusief 360° URLs
- `/api/media/upload/:vehicleId` - Ondersteunt audio upload
- `/uploads/audio/` - Audio files toegankelijk via URL

### **Frontend Integration:**
Gebruik deze data in je bestaande frontend:

```javascript
// Voorbeeld: Laad voertuig met 360° view
fetch('/api/vehicles/1')
  .then(res => res.json())
  .then(vehicle => {
    // 360° view laden
    if (vehicle.view360Url) {
      document.getElementById('impel-container').innerHTML = 
        `<iframe src="${vehicle.view360Url}" width="100%" height="500"></iframe>`;
    }
    
    // Motorgeluid laden  
    if (vehicle.engineSoundUrl) {
      document.getElementById('engine-sound').src = vehicle.engineSoundUrl;
    }
  });
```

## 📱 **Status Check:**

### ✅ **Backend (Port 5000):**
- 3 voertuigen geïmporteerd
- 360° view support actief
- Audio upload werkend

### ✅ **Admin Dashboard (Port 3001):**
- Nieuwe 360° & Audio velden beschikbaar
- Drag & drop audio upload
- Audio preview met controls

## 🎯 **Volgende Stappen:**

1. **Test de 360° views** - Voeg Impel URLs toe aan bestaande voertuigen
2. **Upload motorgeluiden** - Voeg authentieke engine sounds toe
3. **Frontend integratie** - Connect de 360° views met je bestaande website
4. **Afbeeldingen toevoegen** - Upload foto's voor de geïmporteerde voertuigen

Het CMS is nu volledig uitgerust voor immersive automotive experiences! 🚗🎬✨

### 🔗 **Toegang:**
- **Admin:** http://localhost:3001 
- **API:** http://localhost:5000/api
- **Login:** admin@lineselect.com / LineSelect2024!