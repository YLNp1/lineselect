#!/bin/bash

echo "🚀 Starting Line Select CMS..."
echo "=================================="

# Check if node_modules exist
if [ ! -d "lineselect-backend/node_modules" ]; then
    echo "❌ Backend dependencies not found. Please run:"
    echo "   cd lineselect-backend && npm install"
    exit 1
fi

if [ ! -d "lineselect-admin/node_modules" ]; then
    echo "❌ Admin dashboard dependencies not found. Please run:"
    echo "   cd lineselect-admin && npm install"
    exit 1
fi

# Start backend server in background
echo "🔧 Starting backend server (port 5000)..."
cd lineselect-backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start admin dashboard
echo "🎨 Starting admin dashboard (port 3001)..."
cd ../lineselect-admin
npm run dev &
ADMIN_PID=$!

echo ""
echo "✅ Line Select CMS is starting!"
echo ""
echo "📊 Admin Dashboard: http://localhost:3001"
echo "🔌 Backend API:     http://localhost:5000/api"
echo ""
echo "🔑 Login credentials:"
echo "   Email:    admin@lineselect.com"
echo "   Password: LineSelect2024!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $ADMIN_PID; exit" INT
wait