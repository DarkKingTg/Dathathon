# Law Enforcement Intelligence System - Hackathon Documentation

## Project Overview

A sophisticated **Law Enforcement Intelligence Platform** designed to assist police departments and law enforcement agencies with advanced data analysis, relationship mapping, and criminal investigation workflows. The system integrates multiple databases and AI-powered search capabilities to provide comprehensive investigative tools while maintaining strict security, privacy, and audit compliance.

---

## 🎯 Problem Statement

Law enforcement agencies face challenges in:
- Managing and correlating massive amounts of investigation data (FIRs, suspects, locations, vehicles)
- Identifying patterns and relationships between criminals, incidents, and evidence
- Maintaining data security with role-based access controls
- Ensuring audit trails for legal compliance
- Searching historical crime patterns (Modus Operandi)
- Generating comprehensive investigation reports (dossiers)

---

## 💡 Solution

An integrated intelligence platform that combines:
- **Multi-database architecture** for structured and graph-based data
- **AI-powered semantic search** for pattern matching
- **Attribute-Based Access Control (ABAC)** for data security
- **Natural language query interface** for intuitive investigation
- **Automated audit logging** with cryptographic verification
- **Graph visualization** for relationship mapping

---

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Runtime** | Node.js 24 | High-performance JavaScript runtime |
| **Language** | TypeScript 5.9 | Type-safe development |
| **API Framework** | Express 5 | RESTful API server |
| **Primary Database** | PostgreSQL | Structured data (FIRs, persons, vehicles, etc.) |
| **Graph Database** | Neo4j | Relationship mapping and graph queries |
| **Vector Database** | Qdrant | Semantic search for Modus Operandi patterns |
| **ORM** | Drizzle ORM | Type-safe database queries |
| **Validation** | Zod v4 | Schema validation |
| **Authentication** | JWT | Stateless token-based auth |
| **Logging** | Pino | High-performance structured logging |
| **Build Tool** | esbuild | Fast bundling |
| **Package Manager** | pnpm | Efficient workspace management |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Server (Express)                    │
│                         Port: 5000                           │
└───────────────────┬─────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────────────────────┐
    │               │                               │
    ▼               ▼                               ▼
┌─────────┐   ┌──────────┐                   ┌──────────┐
│PostgreSQL│   │  Neo4j   │                   │  Qdrant  │
│(FIR Data)│   │ (Graphs) │                   │(Vectors) │
└─────────┘   └──────────┘                   └──────────┘
```

---

## 📊 Database Schema

### PostgreSQL Schema

#### FIRs (First Information Reports)
- `fir_id` - Unique identifier
- `district` - Jurisdiction district
- `station_code` - Police station code
- `bns_section` - Bharatiya Nyaya Sanhita section
- `ipc_section_legacy` - Legacy IPC section
- `incident_date` - Date of incident
- `status` - Investigation status

#### Persons
- `person_id` - Unique identifier
- `full_name` - Full name
- `dob` - Date of birth
- `gender` - Gender
- `father_name` - Father's name
- `clearance_level` - Data access level

#### Locations
- `location_id` - Unique identifier
- `fir_id` - Associated FIR
- `latitude`, `longitude` - Coordinates
- `address` - Full address
- `district` - District name

#### Vehicles
- `vehicle_id` - Unique identifier
- `fir_id` - Associated FIR
- `registration_number` - Vehicle registration
- `vehicle_type` - Type of vehicle
- `model` - Vehicle model

#### Phone Accounts
- `phone_id` - Unique identifier
- `fir_id` - Associated FIR
- `phone_number` - Phone number
- `imei` - Device IMEI

#### Bank Accounts
- `account_id` - Unique identifier
- `fir_id` - Associated FIR
- `bank_name` - Bank name
- `account_number` - Account number
- `ifsc_code` - IFSC code

### Neo4j Graph Schema

Nodes: `Person`, `FIR`, `Location`, `Vehicle`, `PhoneAccount`, `BankAccount`

Relationships enable complex queries like:
- Find all persons connected to a specific FIR
- Identify common locations across multiple incidents
- Track vehicle movements across districts
- Map phone number networks

---

## 🔐 Security Features

### 1. Authentication & Authorization
- **JWT-based authentication** with access and refresh tokens
- **Multi-Factor Authentication (MFA)** requirement for sensitive operations
- **Token rotation** for enhanced security

### 2. Attribute-Based Access Control (ABAC)
- **Station-level users**: Access only to their district's data
- **Leadership-level users**: Access to all data across districts
- **Clearance levels**: Hierarchical data access based on classification

### 3. Privacy Protection
- **PII Redaction**: Automatic removal of personally identifiable information
- **Data Anonymization**: Text anonymization for logs and queries
- **Query Filtering**: Automatic filtering based on user jurisdiction

### 4. Audit & Compliance
- **Comprehensive audit logging** for all operations
- **Merkle tree verification** for audit log integrity
- **Immutable audit trail** for legal compliance
- Logged actions include:
  - Authentication events
  - Query executions
  - Data exports
  - Graph queries
  - Search operations

---

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/token` - Issue access and refresh tokens
- `POST /api/v1/auth/refresh` - Rotate refresh token

### Query
- `POST /api/v1/query/natural-languageInputs` - Natural language query interface
  - Multi-language support
  - Automatic PII redaction
  - Session context management
  - Citation metadata

### Graph Operations
- `POST /api/v1/query/graphInputs` - Execute Cypher queries on Neo4j
  - Relationship mapping
  - Pattern detection
  - Network analysis

### Search
- `POST /api/v1/search/moInputs` - Modus Operandi semantic search
  - Vector similarity search
  - District filtering
  - Configurable similarity threshold

### Dossier Generation
- `POST /api/v1/dossier/exportInputs` - Generate investigation reports
  - PDF export with digital signatures
  - Watermarking
  - Multi-graph snapshot support

### Audit
- `GET /api/v1/audit/logs` - Retrieve audit logs
  - Merkle root verification
  - Tamper detection

### Health Check
- `GET /api/health` - System health status

---

## 🎨 Key Features

### 1. Natural Language Query Interface
Investigators can query the system in natural language:
- "Show me all FIRs related to vehicle theft in Mumbai district"
- "Find connections between person X and person Y"
- Automatic translation to database queries

### 2. Modus Operandi (MO) Search
AI-powered pattern matching to identify similar crimes:
- Vector embeddings of crime descriptions
- Semantic similarity search
- Historical pattern identification
- Cross-district pattern detection

### 3. Graph-Based Investigation
Neo4j enables complex relationship queries:
- Multi-hop relationship traversal
- Community detection
- Shortest path analysis
- Network centrality analysis

### 4. Role-Based Data Access
Ensures data security through:
- Jurisdiction-based filtering
- Clearance level enforcement
- MFA requirements for sensitive data
- Automatic query restriction

### 5. Audit Trail & Compliance
Every action is logged for:
- Legal compliance
- Forensic analysis
- Performance monitoring
- Security auditing

---

## 📦 Project Structure

```
Backend/
├── artifacts/
│   ├── api-server/          # Main API server
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── lib/         # Core libraries
│   │   │   ├── middlewares/ # Express middlewares
│   │   │   ├── app.ts       # Express app config
│   │   │   └── index.ts     # Entry point
│   │   └── package.json
│   └── mockup-sandbox/      # Testing environment
├── lib/
│   ├── db/                  # Database schemas & ORM
│   ├── api-spec/            # OpenAPI specification
│   ├── api-client-react/    # React client library
│   └── api-zod/             # Zod validation schemas
├── scripts/                 # Build & utility scripts
└── package.json             # Workspace config
```

---

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_MO_COLLECTION=modus_operandi
QDRANT_VECTOR_SIZE=768

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 24+
- pnpm
- PostgreSQL
- Neo4j
- Qdrant

### Installation

```bash
# Install dependencies
pnpm install

# Initialize databases
pnpm --filter @workspace/db run push

# Run the server
pnpm --filter @workspace/api-server run dev
```

### Development Commands

```bash
# Type check
pnpm run typecheck

# Build all packages
pnpm run build

# Regenerate API schemas
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push
```

---

## 🎯 Use Cases

### 1. Criminal Investigation
- Link suspects across multiple FIRs
- Identify vehicle and phone patterns
- Map criminal networks
- Track geographic patterns

### 2. Pattern Analysis
- Identify similar Modus Operandi
- Detect crime series
- Predict crime hotspots
- Analyze temporal patterns

### 3. Report Generation
- Generate comprehensive dossiers
- Export investigation summaries
- Create court-ready documentation
- Maintain chain of custody

### 4. Intelligence Sharing
- Cross-district collaboration
- Hierarchical information flow
- Secure data sharing
- Controlled access to sensitive data

---

## 🏆 Innovation Highlights

1. **Multi-Database Integration**: Combines relational, graph, and vector databases for comprehensive analysis
2. **AI-Powered Search**: Semantic understanding of crime patterns
3. **Security-First Design**: ABAC, MFA, PII protection, and audit logging
4. **Developer-Friendly**: Type-safe, well-documented, modular architecture
5. **Scalable Architecture**: Microservices-ready with clear separation of concerns
6. **Legal Compliance**: Built-in audit trails and data integrity verification

---

## 🔮 Future Enhancements

- Real-time crime alerts and notifications
- Predictive analytics using machine learning
- Mobile app for field officers
- Advanced data visualization dashboards
- Integration with national crime databases
- Facial recognition integration
- Voice-based query interface
- Automated case prioritization
- Cross-border crime tracking

---

## 👥 Target Users

- **Police Officers**: Station-level investigators
- **Crime Analysts**: Pattern analysis and intelligence
- **Senior Officers**: Leadership with cross-district visibility
- **Forensic Teams**: Evidence correlation and analysis
- **Legal Teams**: Case preparation and documentation

---

## 📈 Impact

- **Faster Investigations**: Reduced time to identify connections
- **Improved Accuracy**: AI-assisted pattern matching
- **Enhanced Security**: Role-based access and audit trails
- **Better Collaboration**: Cross-district intelligence sharing
- **Legal Compliance**: Automated audit and documentation

---

## 📝 Technical Highlights for Judges

- **Type Safety**: End-to-end TypeScript with Zod validation
- **Performance**: esbuild compilation, Pino logging, optimized queries
- **Security**: JWT + MFA + ABAC + PII redaction + audit logging
- **Scalability**: Microservices architecture with workspace management
- **Code Quality**: Drizzle ORM for type-safe queries, automated code generation
- **Modern Stack**: Latest versions of Node.js, Express, TypeScript

---

## 🤝 Team & Contact

[Add your team information here]

---

## 📜 License

MIT License

---

**Built for the Datathon Hackathon with ❤️ and TypeScript**
