#!/bin/bash

echo "🧪 Testing Line Select CMS Installation..."
echo "=========================================="

# Test backend health
echo "🔧 Testing backend server..."
cd /home/yln/Desktop/lineselect/lineselect-backend

# Start backend in background
npm run dev &
BACKEND_PID=$!

# Wait for server to start
sleep 5

# Test health endpoint
if curl -s http://localhost:5000/api/health | grep -q "OK"; then
    echo "✅ Backend server: OK"
else
    echo "❌ Backend server: FAILED"
fi

# Test admin creation
echo "🔑 Testing admin user creation..."
if node migrations/create-admin-user.js | grep -q "Admin user"; then
    echo "✅ Admin user: OK"
else
    echo "❌ Admin user: FAILED"
fi

# Stop backend
kill $BACKEND_PID

echo ""
echo "🎯 Installation Test Complete!"
echo ""
echo "To start the CMS, run:"
echo "   ./start-cms.sh"
echo ""
echo "Or manually:"
echo "   Terminal 1: cd lineselect-backend && npm run dev"
echo "   Terminal 2: cd lineselect-admin && npm run dev"
echo "=========================================="