

trap 'kill $(jobs -p)' EXIT  # Auto-kill background jobs on exit

echo "🚀 Starting Digital Rchiving System in development mode..."

# 1. Frontend Setup
echo "📦 Installing frontend dependencies..."
cd frontend/archive-system
npm install

# 2. Backend Setup
cd ../../backend
echo "📦 Installing backend dependencies..."
npm install

echo "🟢 Starting backend on port 5000..."
npm run dev &  # start backend in background

# 3. Start Frontend Dev Server
cd ../frontend/archive-system
echo "🌐 Starting frontend on port 3000..."
npm run dev
