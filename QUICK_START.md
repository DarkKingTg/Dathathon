# 🚀 Quick Start Guide - KSP-Chanakya

## ✅ What's Running

### Frontend (RUNNING ✓)
- **URL**: http://localhost:3000
- **Status**: ✅ Running successfully!
- **Technology**: React 19 + Vite + Express
- **Features**: 
  - AI-powered voice/text interface
  - Gemini API integration
  - Multi-language support (Kannada/English)

### Backend API (NEEDS DATABASE SETUP)
- **URL**: http://localhost:5000 (when running)
- **Status**: ⚠️ Requires database configuration
- **Technology**: Node.js 24 + Express 5 + TypeScript

---

## 📋 Current Status

✅ **WORKING:**
- Frontend is running on port 3000
- Development environment is set up
- Dependencies are installed
- Configuration files are created

⚠️ **NEEDS SETUP:**
- PostgreSQL database
- Neo4j graph database  
- Qdrant vector database
- Backend server compilation

---

## 🎯 How to View the Frontend

### Option 1: Direct Access
1. Open your browser
2. Navigate to: **http://localhost:3000**
3. The KSP-Chanakya interface should load

### Option 2: Check Terminal
The frontend terminal shows:
```
KSP-Chanakya Tactical Server running on http://0.0.0.0:3000
```

---

## 🔧 To Run Backend (Requires Database Setup)

### Step 1: Install Databases

#### PostgreSQL
```bash
# Download and install PostgreSQL from:
# https://www.postgresql.org/download/windows/

# Or using Chocolatey:
choco install postgresql

# Or using Scoop:
scoop install postgresql
```

#### Neo4j
```bash
# Download and install Neo4j from:
# https://neo4j.com/download/

# Or using Chocolatey:
choco install neo4j-community
```

#### Qdrant
```bash
# Run using Docker:
docker run -p 6333:6333 qdrant/qdrant

# Or download from:
# https://qdrant.tech/documentation/quick-start/
```

### Step 2: Configure Backend

Edit `Backend/.env` with your database credentials:
```env
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/law_enforcement_db
NEO4J_URI=bolt://localhost:7687
NEO4J_PASSWORD=your_neo4j_password
QDRANT_URL=http://localhost:6333
```

### Step 3: Initialize Databases

```powershell
cd Backend
pnpm --filter @workspace/db run push
```

### Step 4: Run Backend

```powershell
cd Backend/artifacts/api-server
$env:PORT="5000"
$env:NODE_ENV="development"
pnpm exec tsx src/index.ts
```

---

## 🖥️ For Hackathon Demo (Frontend Only)

Since the frontend is already running with AI capabilities, you can demonstrate:

### ✅ Available Features:
1. **AI Query Interpretation**
   - Endpoint: `POST /api/ai/interpret-query`
   - Translates Kannada/English queries
   - Generates Cypher queries for graph database
   
2. **Dossier Note Generation**
   - Endpoint: `POST /api/ai/generate-dossier-notes`
   - Auto-generates case notes using Gemini AI

3. **Multi-Language Interface**
   - Voice input support
   - Kannada-English code-switching
   - Real-time translation

### 🎨 Frontend Features:
- Modern UI with Tailwind CSS
- Lucide React icons
- Motion animations
- Responsive design

---

## 📝 Alternative: Mock Backend for Demo

If you want to demo without databases, the frontend already includes:
- Mock/fallback responses for AI endpoints
- Sample data for demonstrations
- Simulated query interpretations

The frontend `server.ts` includes fallback responses when Gemini API isn't available.

---

## 🎬 Demo Scenarios

### Scenario 1: Voice Query (Kannada)
```
Query: "ಮಲ್ಲೇಶ್ವರಂ 8ನೇ ಕ್ರಾಸ್‌ನಲ್ಲಿ ಶಂಕಿತ ವ್ಯಕ್ತಿಯನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ"
Translation: "Locate suspect at Malleshwaram 8th cross"
Result: Cypher query generated + confidence score
```

### Scenario 2: Case Dossier Generation
```
Input: Case reference, suspect details, evidence
Output: AI-generated formal analyst summary for court
```

### Scenario 3: Multi-Language Interface
```
Demonstrate: Code-switching between Kannada and English
Show: Real-time query interpretation and intent detection
```

---

## 📂 Project Documentation

- **Full Documentation**: `HACKATHON_DOCUMENTATION.md`
- **Detailed README**: `README.md`
- **Frontend Code**: `frontend/src/`
- **Backend Code**: `Backend/artifacts/api-server/src/`

---

## 🆘 Troubleshooting

### Frontend Not Loading?
```powershell
# Check if port 3000 is available
netstat -ano | findstr :3000

# Restart frontend
cd frontend
npm run dev
```

### Check Frontend Status
```powershell
# Test health endpoint
curl http://localhost:3000/api/health
```

### View Frontend Logs
Check the running terminal for:
- Vite dev server messages
- API request logs  
- Error messages

---

## 🎯 For Judges/Reviewers

### What's Working Now:
✅ React frontend with modern UI
✅ AI-powered query interpretation (Gemini API)
✅ Multi-language support (Kannada/English)
✅ Automated dossier generation
✅ Mock/fallback responses for demos

### What Needs Database Setup:
⚠️ Graph relationship queries (Neo4j)
⚠️ Vector similarity search (Qdrant)
⚠️ Persistent data storage (PostgreSQL)
⚠️ Full backend API endpoints

### Demo Without Databases:
You can still demonstrate:
- Frontend UI/UX
- AI query interpretation
- Multi-language processing
- Code architecture and design
- Security features (JWT, ABAC, audit logging) in code

---

## 📞 Quick Commands Reference

### Frontend
```powershell
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
```

### Backend (when databases are ready)
```powershell
cd Backend
pnpm install                              # Install dependencies
pnpm --filter @workspace/db run push      # Initialize database
pnpm --filter @workspace/api-server run dev  # Run server
```

---

## 🎉 Success!

**Frontend is live and ready for demo!**

Visit: **http://localhost:3000**

---

**Built for Karnataka State Police | Datathon 2025**
