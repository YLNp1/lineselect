# Line Select - Luxury Car Dealership CMS

Een complete backend CMS oplossing voor Line Select, een exclusieve autoverkoop website. Het systeem bestaat uit een Node.js/Express backend API en een React admin dashboard.

## 🚀 Functies

### Backend API
- **Beveiligde authenticatie** met JWT tokens
- **Voertuig management** - CRUD operaties voor supercars
- **Media upload systeem** - Automatische afbeelding optimalisatie naar WebP
- **Content management** - Beheer van statische pagina content
- **360° view ondersteuning** - Integratie voor Impel 360 views
- **Audio upload** - Motorgeluid bestanden
- **Responsive images** - Automatische thumbnail generatie

### Admin Dashboard
- **Modern React interface** met Tailwind CSS
- **Gebruiksvriendelijke UI** - Intuïtieve navigatie
- **Real-time updates** met React Query
- **Drag & drop** media upload
- **Content editor** voor pagina beheer
- **Mobielvriendelijk** responsive design

## 📋 Vereisten

- Node.js 18+ 
- MySQL 8.0+
- NPM of Yarn

## 🛠️ Installatie

### 1. Backend Setup

```bash
cd lineselect-backend

# Installeer dependencies
npm install

# Kopieer environment configuratie
cp .env.example .env

# Bewerk .env met jouw database gegevens
nano .env
```

**Belangrijke .env instellingen:**
```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lineselect_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Secret (gebruik een sterke random string)
JWT_SECRET=your_very_secure_random_jwt_secret_key

# Admin account (voor eerste keer)
ADMIN_EMAIL=admin@lineselect.com
ADMIN_PASSWORD=your_secure_password
```

### 2. Database Setup

```bash
# Maak database aan
mysql -u root -p
CREATE DATABASE lineselect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Start backend server (dit synchroniseert de database automatisch)
npm run dev

# In een nieuwe terminal, maak admin gebruiker aan
node migrations/create-admin-user.js
```

### 3. Admin Dashboard Setup

```bash
cd ../lineselect-admin

# Installeer dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Gebruik

### Backend API (Port 5000)
- API Base URL: `http://localhost:5000/api`
- Health check: `GET /api/health`

### Admin Dashboard (Port 3001)
- Dashboard URL: `http://localhost:3001`
- Login met de admin credentials uit je .env

### Eerste Stappen

1. **Login** met admin credentials
2. **Voeg je eerste voertuig toe** via "Vehicles" → "New Vehicle"
3. **Upload media** - afbeeldingen worden automatisch geoptimaliseerd
4. **Beheer content** via de "Content" sectie
5. **Check dashboard** voor overzicht en statistieken

## 📁 Project Structuur

```
lineselect/
├── lineselect-backend/          # Node.js API Server
│   ├── src/
│   │   ├── models/             # Database modellen
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Auth & upload middleware
│   │   └── services/           # Business logic
│   ├── config/                 # Database configuratie
│   ├── migrations/             # Database setup scripts
│   └── public/uploads/         # Geüploade bestanden
│
├── lineselect-admin/           # React Admin Dashboard
│   ├── src/
│   │   ├── components/         # Herbruikbare componenten
│   │   ├── pages/              # Dashboard pagina's
│   │   ├── hooks/              # Custom React hooks
│   │   └── services/           # API communicatie
│   └── public/                 # Statische bestanden
│
└── [bestaande frontend files]  # Jouw huidige website
```

## 🔒 Beveiliging

- JWT authenticatie met refresh tokens
- Wachtwoord hashing met bcrypt
- File upload validatie en beperking
- CORS configuratie
- Rate limiting
- Helmet.js security headers
- Input validatie met express-validator

## 📱 API Endpoints

### Authenticatie
- `POST /api/auth/login` - Inloggen
- `GET /api/auth/me` - Huidige gebruiker
- `POST /api/auth/change-password` - Wachtwoord wijzigen

### Voertuigen
- `GET /api/vehicles` - Alle voertuigen (public)
- `POST /api/vehicles` - Voertuig toevoegen (admin)
- `PUT /api/vehicles/:id` - Voertuig bijwerken (admin)
- `DELETE /api/vehicles/:id` - Voertuig verwijderen (admin)
- `PATCH /api/vehicles/:id/status` - Status wijzigen (admin)

### Media
- `POST /api/media/upload/:vehicleId` - Bestanden uploaden
- `GET /api/media/vehicle/:vehicleId` - Media van voertuig
- `PUT /api/media/reorder` - Media volgorde wijzigen
- `PATCH /api/media/:id/main` - Hoofdafbeelding instellen

### Content
- `GET /api/content/:page` - Pagina content
- `PUT /api/content/:page` - Bulk content update
- `PUT /api/content/:page/:section/:key` - Specifieke content update

## 🎨 Integratie met Frontend

Om je bestaande frontend te verbinden met de CMS:

1. **Vervang statische data** met API calls naar `http://localhost:5000/api`
2. **Update je JavaScript** om voertuigen dynamisch te laden:

```javascript
// Voorbeeld: Voertuigen laden
const loadVehicles = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/vehicles');
    const data = await response.json();
    const vehicles = data.data;
    
    // Update je bestaande DOM manipulation code
    displayVehicles(vehicles);
  } catch (error) {
    console.error('Error loading vehicles:', error);
  }
};
```

3. **Content management** voor dynamische teksten:

```javascript
// Voorbeeld: Pagina content laden
const loadPageContent = async (page) => {
  try {
    const response = await fetch(`http://localhost:5000/api/content/${page}`);
    const data = await response.json();
    
    // Update teksten dynamisch
    document.querySelector('.hero-title').textContent = data.hero.title.value;
    document.querySelector('.hero-subtitle').textContent = data.hero.subtitle.value;
  } catch (error) {
    console.error('Error loading content:', error);
  }
};
```

## 🔧 Productie Deployment

### Backend
```bash
# Build en start productie server
NODE_ENV=production npm start

# Of met PM2
npm install -g pm2
pm2 start server.js --name lineselect-backend
```

### Admin Dashboard
```bash
# Build voor productie
npm run build

# Serve statische bestanden (bijvoorbeeld met nginx)
```

### Database
- Gebruik producties MySQL/PostgreSQL
- Configureer backups
- SSL verbindingen aanbevolen

## 🤝 Support

Voor vragen of ondersteuning, raadpleeg de documentatie of neem contact op.

## 📝 Licentie

Copyright © 2024 Line Select. Alle rechten voorbehouden.