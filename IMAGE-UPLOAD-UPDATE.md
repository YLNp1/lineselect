# 📸 Image Upload Feature Added!

Het Line Select CMS heeft nu volledige image upload functionaliteit!

## ✨ **Nieuwe Features:**

### 🖼️ **Image Upload Systeem**
- **Drag & Drop** - Sleep afbeeldingen direct in het formulier
- **Multi-upload** - Upload meerdere afbeeldingen tegelijk
- **Automatische optimalisatie** - Afbeeldingen worden geconverteerd naar WebP
- **Thumbnail generatie** - Automatische thumbnails voor snelle weergave
- **Hoofdafbeelding instellen** - Kies welke afbeelding als hoofdfoto dient

### 🔧 **Technische Features**
- **Bestandstypen**: JPG, JPEG, PNG, WebP
- **Max bestandsgrootte**: 10MB per afbeelding
- **Responsive images**: Automatische thumbnails (400x300px)
- **Geoptimaliseerd**: Hoofdafbeeldingen (max 1920x1080px)

## 🚀 **Hoe te gebruiken:**

### 1. **Voertuig toevoegen:**
1. Ga naar **Vehicles** → **Add Vehicle**
2. Vul de basisgegevens in (merk, model, jaar, etc.)
3. Klik **"Create Vehicle"**

### 2. **Afbeeldingen uploaden:**
1. Na het opslaan verschijnt de **"Vehicle Images"** sectie
2. **Sleep afbeeldingen** in het upload gebied of **klik om te selecteren**
3. Afbeeldingen worden automatisch geüpload en geoptimaliseerd
4. **Hover over afbeeldingen** om acties te zien:
   - **"Set Main"** - Hoofdafbeelding instellen
   - **❌** - Afbeelding verwijderen

### 3. **Klaar:**
- Klik **"Done - View All Vehicles"** om terug te gaan
- De hoofdafbeelding wordt automatisch getoond in het overzicht

## 🎯 **Features in werking:**

- ✅ **Upload** - Meerdere afbeeldingen tegelijk
- ✅ **Drag & Drop** - Gebruiksvriendelijke interface  
- ✅ **Optimalisatie** - WebP conversie + thumbnails
- ✅ **Hoofdafbeelding** - Selecteer de belangrijkste foto
- ✅ **Preview** - Direct zien wat je geüpload hebt
- ✅ **Verwijderen** - Ongewenste afbeeldingen weghalen
- ✅ **Responsive** - Werkt op desktop en mobiel

## 📁 **Waar worden afbeeldingen opgeslagen:**

```
lineselect-backend/public/uploads/
├── vehicles/           # Hoofdafbeeldingen (geoptimaliseerd)
└── vehicles/thumbnails/ # Kleine preview afbeeldingen
```

## 🌐 **URLs:**
- **Admin Dashboard:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **Afbeeldingen:** http://localhost:5000/uploads/vehicles/

## 🎉 **Je kunt nu:**
1. Supercars toevoegen met complete fotogalerijen
2. Hoofdafbeelding per voertuig instellen
3. Afbeeldingen beheren via drag & drop
4. Automatisch geoptimaliseerde afbeeldingen krijgen

Het CMS is nu volledig uitgerust voor professioneel autobeheer! 🚗✨