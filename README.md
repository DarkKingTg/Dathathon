# KSP-Chanakya: Law Enforcement Intelligence System

> A sophisticated AI-powered intelligence platform for Karnataka State Police, designed for advanced criminal investigation, relationship mapping, and multi-language query processing.

![Status](https://img.shields.io/badge/Status-Hackathon%20Project-blue)
![Node](https://img.shields.io/badge/Node.js-24-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19-cyan)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 24+** (Required)
- **pnpm** (Package manager)
- **PostgreSQL** (Database)
- **Neo4j** (Graph database)
- **Qdrant** (Vector database)

### Installation & Running

#### 1️⃣ Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../Backend
pnpm install
```

#### 2️⃣ Configure Environment Variables

**Frontend** (`frontend/.env` or use `frontend/env.local`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
APP_URL=http://localhost:3000
```

**Backend** (Create `Backend/.env`):
```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/law_enforcement_db

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_MO_COLLECTION=modus_operandi
QDRANT_VECTOR_SIZE=768

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

#### 3️⃣ Initialize Databases

```bash
cd Backend

# Push database schema to PostgreSQL
pnpm --filter @workspace/db run push

# Neo4j and Qdrant will auto-initialize on first run
```

#### 4️⃣ Run the Application

**Open two separate terminals:**

**Terminal 1 - Backend API Server:**
```bash
cd Backend
pnpm --filter @workspace/api-server run dev
```
✅ Backend runs on: **http://localhost:5000**

**Terminal 2 - Frontend React App:**
```bash
cd frontend
npm run dev
```
✅ Frontend runs on: **http://localhost:3000**

---

## 📁 Project Structure

```
Datathon/
├── Backend/                      # Backend API Server
│   ├── artifacts/
│   │   ├── api-server/          # Express API server (Port 5000)
│   │   │   ├── src/
│   │   │   │   ├── routes/      # API endpoints
│   │   │   │   ├── lib/         # Core libraries
│   │   │   │   ├── middlewares/ # Auth & ABAC
│   │   │   │   └── app.ts
│   │   │   └── package.json
│   │   └── mockup-sandbox/      # Testing sandbox
│   ├── lib/
│   │   ├── db/                  # PostgreSQL schemas (Drizzle ORM)
│   │   ├── api-spec/            # OpenAPI spec & codegen
│   │   ├── api-client-react/    # React query hooks
│   │   └── api-zod/             # Zod validation schemas
│   ├── scripts/                 # Build & automation
│   ├── package.json
│   └── pnpm-workspace.yaml
│
├── frontend/                     # React Frontend
│   ├── src/                     # React components
│   ├── assets/                  # Static assets
│   ├── server.ts                # Express + Vite dev server
│   ├── vite.config.ts           # Vite configuration
│   └── package.json
│
└── README.md                     # This file
```

---

## 🎯 System Overview

### The Problem
Law enforcement agencies struggle with:
- Managing massive investigation data (FIRs, suspects, evidence)
- Identifying criminal network patterns
- Multi-language query processing (Kannada/English)
- Maintaining audit trails for legal compliance
- Secure role-based data access

### Our Solution
**KSP-Chanakya** integrates:
- 🗣️ **AI-powered natural language interface** (Kannada & English)
- 🕸️ **Graph-based relationship mapping** (Neo4j)
- 🔍 **Semantic crime pattern search** (Qdrant)
- 🔐 **Enterprise-grade security** (ABAC, MFA, JWT)
- 📊 **Comprehensive audit logging**
- 📄 **Automated dossier generation**

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite | Modern responsive UI |
| **Backend** | Node.js 24 + Express 5 | REST API server |
| **Language** | TypeScript 5.9 | Type-safe development |
| **Database** | PostgreSQL + Drizzle ORM | Structured data (FIRs, persons, vehicles) |
| **Graph DB** | Neo4j | Criminal network relationships |
| **Vector DB** | Qdrant | Semantic MO (Modus Operandi) search |
| **AI** | Google Gemini 2.5 | NL query interpretation |
| **Auth** | JWT + MFA | Stateless authentication |
| **Validation** | Zod v4 | Schema validation |
| **Logging** | Pino | High-performance logging |
| **Build** | esbuild | Fast compilation |
| **Package Manager** | pnpm (Backend), npm (Frontend) | Dependency management |

### System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)                    │
│        Voice/Text Input → AI Interpretation → Visualization      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST API
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Express API Server (Port 5000)                      │
│   Auth → ABAC → Query Processing → Audit Logging                │
└──────────────┬──────────────┬──────────────┬────────────────────┘
               │              │              │
       ┌───────▼──────┐  ┌───▼────┐   ┌────▼────┐
       │  PostgreSQL  │  │ Neo4j  │   │ Qdrant  │
       │  (FIR Data)  │  │(Graphs)│   │(Vectors)│
       └──────────────┘  └────────┘   └─────────┘
```

---

## 🔐 Security Features

### 1. Authentication & Authorization
- **JWT tokens** (access + refresh)
- **Multi-Factor Authentication (MFA)** for sensitive operations
- **Token rotation** for security

### 2. Attribute-Based Access Control (ABAC)
- **Station-level users**: Limited to home district data
- **Leadership users**: Cross-district visibility
- **Clearance levels**: Hierarchical access control

### 3. Privacy Protection
- **PII Redaction**: Automatic anonymization
- **Query Filtering**: Jurisdiction-based restrictions
- **Data Masking**: Sensitive field protection

### 4. Audit & Compliance
- **Complete audit trail** for all operations
- **Merkle tree verification** for log integrity
- **Tamper-proof logging**

---

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | System health check |
| `/v1/auth/token` | POST | Generate JWT tokens |
| `/v1/auth/refresh` | POST | Rotate refresh token |
| `/v1/query/natural-languageInputs` | POST | Natural language query |
| `/v1/query/graphInputs` | POST | Execute Cypher graph queries |
| `/v1/search/moInputs` | POST | Modus Operandi semantic search |
| `/v1/dossier/exportInputs` | POST | Generate investigation reports |
| `/v1/audit/logs` | GET | Retrieve audit logs |

### Frontend API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Frontend health check |
| `/api/ai/interpret-query` | POST | AI query interpretation (Gemini) |
| `/api/ai/generate-dossier-notes` | POST | Auto-generate case notes |

---

## 🗄️ Database Schema

### PostgreSQL Tables

1. **firs** - First Information Reports
   - FIR ID, district, station code, BNS section, IPC section, incident date, status

2. **persons** - Person records
   - Person ID, full name, DOB, gender, father name, clearance level

3. **locations** - Incident locations
   - Location ID, FIR ID, latitude, longitude, address, district

4. **vehicles** - Vehicle records
   - Vehicle ID, FIR ID, registration number, type, model

5. **phone_accounts** - Phone tracking
   - Phone ID, FIR ID, phone number, IMEI

6. **bank_accounts** - Financial tracking
   - Account ID, FIR ID, bank name, account number, IFSC code

### Neo4j Graph Schema

**Nodes**: `Person`, `FIR`, `Location`, `Vehicle`, `PhoneAccount`, `BankAccount`

**Relationships**: Dynamic connections enable complex queries like:
- Find all persons linked to a specific FIR
- Identify common vehicles across incidents
- Map phone number networks
- Track geographic crime patterns

### Qdrant Vector Database

**Collection**: `modus_operandi`
- **Vector Size**: 768 dimensions
- **Distance Metric**: Cosine similarity
- **Purpose**: Semantic search for crime pattern matching

---

## 🎨 Key Features

### 1. 🗣️ Multi-Language Voice/Text Interface
- Kannada and English support
- Code-switching recognition
- Voice-to-text conversion
- AI-powered intent understanding

### 2. 🔍 Natural Language Query
Investigators can query in natural language:
```
Example (Kannada): "ಮಲ್ಲೇಶ್ವರಂ 8ನೇ ಕ್ರಾಸ್‌ನಲ್ಲಿ ಶಂಕಿತ ವ್ಯಕ್ತಿಯನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ"
Translation: "Locate suspect at Malleshwaram 8th cross"

Generated Cypher Query:
MATCH (s:Suspect)-[:SPOTTED_AT]->(l:Location {name: 'Malleshwaram 8th Cross'})
RETURN s, l;
```

### 3. 🕸️ Graph-Based Investigation
- Multi-hop relationship traversal
- Network analysis & visualization
- Community detection
- Shortest path between entities

### 4. 🔎 Modus Operandi (MO) Search
- AI-powered pattern matching
- Vector similarity search
- Cross-district pattern detection
- Historical crime analysis

### 5. 📄 Automated Dossier Generation
- Court-ready PDF reports
- Digital signatures & watermarking
- Evidence compilation
- Citation metadata

### 6. 🔒 Role-Based Access Control
- Jurisdiction filtering
- Clearance level enforcement
- MFA for sensitive operations
- Automatic query restrictions

---

## 💻 Development Commands

### Backend

```bash
# Type check all packages
pnpm run typecheck

# Build all packages
pnpm run build

# Run API server in dev mode
pnpm --filter @workspace/api-server run dev

# Regenerate API schemas from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push database schema changes
pnpm --filter @workspace/db run push

# Force push DB schema (CAUTION: may drop data)
pnpm --filter @workspace/db run push-force
```

### Frontend

```bash
# Run development server (Vite + Express)
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type check
npm run lint

# Clean build artifacts
npm run clean
```

---

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Frontend Health Check
```bash
curl http://localhost:3000/api/health
```

### Test Authentication
```bash
curl -X POST http://localhost:5000/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "officer_123",
    "role": "station",
    "home_district": "Bangalore Urban",
    "clearance_level": 2,
    "mfa_verified": true
  }'
```

---

## 🚀 Use Cases

### 1. Criminal Investigation
- Link suspects across multiple FIRs
- Identify vehicle and phone patterns
- Map criminal networks
- Track geographic crime patterns

### 2. Pattern Analysis
- Identify similar crime methods (MO)
- Detect crime series
- Predict crime hotspots
- Temporal pattern analysis

### 3. Multi-Language Operations
- Voice commands in Kannada
- Automatic translation to English
- Code-switching support
- Query intent recognition

### 4. Intelligence Sharing
- Cross-district collaboration
- Hierarchical information flow
- Secure data sharing
- Controlled access to sensitive data

---

## 🎯 Innovation Highlights

1. ✅ **Multi-Database Architecture**: PostgreSQL + Neo4j + Qdrant
2. ✅ **AI-Powered Interface**: Google Gemini for NL understanding
3. ✅ **Multi-Language Support**: Kannada/English voice & text
4. ✅ **Enterprise Security**: ABAC + MFA + JWT + Audit logging
5. ✅ **Graph Intelligence**: Complex relationship mapping
6. ✅ **Semantic Search**: Vector-based pattern matching
7. ✅ **Type-Safe Development**: End-to-end TypeScript
8. ✅ **Modern Stack**: Latest versions of Node.js, React, TypeScript

---

## 🔮 Future Enhancements

- [ ] Real-time crime alerts
- [ ] Mobile app for field officers
- [ ] Predictive analytics using ML
- [ ] Advanced data visualization dashboards
- [ ] Integration with national crime databases
- [ ] Facial recognition integration
- [ ] Voice-based response system (TTS)
- [ ] Automated case prioritization
- [ ] Cross-border crime tracking
- [ ] Live location tracking

---

## 👥 Target Users

- **Police Officers**: Station-level investigators
- **Crime Analysts**: Pattern analysis specialists
- **Senior Officers**: Leadership with cross-district visibility
- **Forensic Teams**: Evidence correlation
- **Legal Teams**: Case preparation and documentation

---

## 📈 Impact & Benefits

- ⚡ **Faster Investigations**: Reduced time to identify criminal connections
- 🎯 **Improved Accuracy**: AI-assisted pattern recognition
- 🔐 **Enhanced Security**: Enterprise-grade access controls
- 🤝 **Better Collaboration**: Cross-district intelligence sharing
- ⚖️ **Legal Compliance**: Automated audit trails & documentation
- 🌐 **Language Accessibility**: Native language support for officers

---

## 🛠️ Troubleshooting

### Backend won't start?
```bash
# Check if port 5000 is available
netstat -ano | findstr :5000

# Verify database connections
# PostgreSQL: Check DATABASE_URL
# Neo4j: Check NEO4J_URI
# Qdrant: Check QDRANT_URL
```

### Frontend won't start?
```bash
# Check if port 3000 is available
netstat -ano | findstr :3000

# Verify Gemini API key
echo %GEMINI_API_KEY%

# Clear cache and reinstall
npm run clean
rm -rf node_modules
npm install
```

### Database initialization fails?
```bash
# Ensure PostgreSQL is running
pg_isready

# Ensure Neo4j is running
# Check http://localhost:7474

# Ensure Qdrant is running
# Check http://localhost:6333
```

---

## 📝 Environment Setup Checklist

- [ ] Node.js 24+ installed
- [ ] pnpm installed globally (`npm install -g pnpm`)
- [ ] PostgreSQL running
- [ ] Neo4j running
- [ ] Qdrant running
- [ ] Frontend `.env` configured
- [ ] Backend `.env` configured
- [ ] Database schema pushed
- [ ] Dependencies installed (both frontend & backend)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

This is a hackathon project. For contributions or questions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📞 Support & Contact

**Project**: KSP-Chanakya Intelligence System  
**Hackathon**: Datathon 2025  
**Team**: [Add your team name]  
**Contact**: [Add your contact information]

---

## 🙏 Acknowledgments

- Karnataka State Police for domain knowledge
- Google Gemini AI for natural language processing
- Neo4j for graph database capabilities
- Qdrant for vector search technology
- Open source community for excellent tools

---

**Built with ❤️ for Karnataka State Police**

*Empowering law enforcement through AI and data intelligence*
