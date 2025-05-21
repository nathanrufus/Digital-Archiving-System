# PowerShell script to start frontend and backend dev servers

Write-Host "`n🚀 Starting Digital Rchiving System in development mode..."

# 1. Frontend Setup
Write-Host "📦 Installing frontend dependencies..."
cd frontend\archive-system
npm install

# 2. Backend Setup
cd ..\..\backend
Write-Host "📦 Installing backend dependencies..."
npm install

# 3. Start backend in a separate PowerShell window
Write-Host "🟢 Starting backend on port 5000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $(pwd); npm run dev"

# 4. Start frontend (in this window)
cd ..\frontend\archive-system
Write-Host "🌐 Starting frontend on port 3000..."
npm run dev
