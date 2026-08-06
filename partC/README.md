# Part C - Research and Development API

A separate API for managing Part C (Research and Development) data with its own Firebase credentials.

## Folder Structure

```
partC/
├── config/
│   └── firebase.js          # Firebase configuration (separate credentials)
├── middleware/
│   └── validation.js        # Input validation
├── routes/
│   └── partC.js             # API endpoints
├── .env.example             # Environment variables template
├── package.json             # Dependencies
└── server.js                # Server entry point
```

## Setup Instructions

### Step 1: Create Firebase Project for Part C

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new Firebase project (e.g., "Employee-PartC")
3. Enable Firestore Database
4. Create a service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the file as `serviceAccountKey.json`

### Step 2: Place Credentials

Place your `serviceAccountKey.json` in the `partC/config/` folder.

**Important:** Add this to `.gitignore` to prevent committing credentials:
```
partC/config/serviceAccountKey.json
```

### Step 3: Install Dependencies

```bash
cd partC
npm install
```

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update `PORT` if needed (default is 3001 to avoid conflict with Part B).

### Step 5: Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/part-c` | Create Part C data |
| GET | `/api/part-c/:employee_id` | Get Part C data by employee |
| PUT | `/api/part-c/:employee_id` | Update Part C data |
| GET | `/api/part-c` | Get all Part C records |
| DELETE | `/api/part-c/:employee_id` | Delete Part C data |

## Data Schema

```json
{
  "employee_id": "string (required)",
  
  // C.1 Research Papers
  "conferences": [{ "title", "conference_name", "indexing", "author_position", "year", "proof" }],
  "journals": [{ "title", "journal_name", "indexing", "quartile", "author_position", "year", "proof" }],
  "citations": [{ "year", "q1_count", "other_count", "source" }],
  "book_chapters": [{ "chapter_title", "book_title", "indexing", "author_position" }],
  "textbooks": [{ "book_title", "isbn", "author_position" }],
  
  // C.2 Projects
  "research_projects": [{ "title", "funding_amount", "role", "status", "duration", "proof" }],
  "project_outcomes": [{ "project_title", "outcome_type", "role", "proof" }],
  
  // C.3 Products & Patents
  "products": [{ "product_name", "type", "description", "proof" }],
  "patents": [{ "title", "status", "patent_number", "proof" }],
  "patent_revenue": [{ "title", "amount", "year", "proof" }],
  "startups": [{ "startup_name", "investment", "role", "proof" }],
  
  // C.4 Consultancy
  "consultancy": [{ "activity_type", "description", "amount", "year", "proof" }],
  
  // C.5 PhD Supervision
  "phd_supervision": [{ "scholar_name", "status", "year", "proof" }],
  
  // C.6 Student Projects
  "student_projects": [{ "title", "students", "department", "status", "year", "proof" }]
}
```

## Test Mode

### Using cURL

```bash
# Test server is running
curl http://localhost:3001/

# Create Part C data
curl -X POST http://localhost:3001/api/part-c \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "conferences": [
      {
        "title": "AI Research Conference",
        "conference_name": "IEEE International Conference",
        "indexing": "SCOPUS",
        "author_position": "First Author",
        "year": 2024,
        "proof": "https://example.com/proof"
      }
    ],
    "journals": [
      {
        "title": "Machine Learning Study",
        "journal_name": "Nature",
        "indexing": "SCI",
        "quartile": "Q1",
        "author_position": "Corresponding Author",
        "year": 2023,
        "proof": "https://example.com/proof"
      }
    ],
    "research_projects": [
      {
        "title": "AI Research Grant",
        "funding_amount": 500000,
        "role": "Principal Investigator",
        "status": "ongoing",
        "duration": "2 years",
        "proof": "https://example.com/proof"
      }
    ],
    "patents": [
      {
        "title": "AI Algorithm Patent",
        "status": "granted",
        "patent_number": "US123456789",
        "proof": "https://example.com/proof"
      }
    ],
    "phd_supervision": [
      {
        "scholar_name": "John Doe",
        "status": "ongoing",
        "year": 2023,
        "proof": "https://example.com/proof"
      }
    ]
  }'

# Get Part C data by employee
curl http://localhost:3001/api/part-c/EMP001

# Get all Part C records
curl http://localhost:3001/api/part-c

# Update Part C data
curl -X PUT http://localhost:3001/api/part-c/EMP001 \
  -H "Content-Type: application/json" \
  -d '{
    "conferences": [
      {
        "title": "New Conference",
        "conference_name": "ACM Conference",
        "indexing": "SCOPUS",
        "author_position": "First Author",
        "year": 2025,
        "proof": "https://example.com/proof2"
      }
    ]
  }'

# Delete Part C data
curl -X DELETE http://localhost:3001/api/part-c/EMP001
```

### Using Postman/Insomnia

1. Import the endpoints above
2. Set Content-Type header to `application/json`
3. Send requests to `http://localhost:3001/api/part-c`

## Firestore Security Rules

In your Firebase Console, set up Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /part_c/{employeeId} {
      allow read, write: if true; // Adjust as needed
    }
  }
}
```

## Complete Test Data Sample

```json
{
  "employee_id": "EMP001",
  "conferences": [
    {
      "title": "International Conference on AI",
      "conference_name": "ICAI 2024",
      "indexing": "SCOPUS, Web of Science",
      "author_position": "First Author",
      "year": 2024,
      "proof": "https://firebase.storage.com/proofs/conf1.pdf"
    }
  ],
  "journals": [
    {
      "title": "Deep Learning Advances",
      "journal_name": "Journal of Machine Learning",
      "indexing": "SCI, SCOPUS",
      "quartile": "Q1",
      "author_position": "Corresponding Author",
      "year": 2023,
      "proof": "https://firebase.storage.com/proofs/journal1.pdf"
    }
  ],
  "citations": [
    {
      "year": 2024,
      "q1_count": 45,
      "other_count": 120,
      "source": "Google Scholar"
    }
  ],
  "book_chapters": [
    {
      "chapter_title": "Neural Networks Basics",
      "book_title": "AI Handbook",
      "indexing": "SCOPUS",
      "author_position": "Co-Author"
    }
  ],
  "textbooks": [
    {
      "book_title": "Introduction to ML",
      "isbn": "978-3-123456-78-9",
      "author_position": "First Author"
    }
  ],
  "research_projects": [
    {
      "title": "AI for Healthcare",
      "funding_amount": 5000000,
      "role": "Principal Investigator",
      "status": "ongoing",
      "duration": "36 months",
      "proof": "https://firebase.storage.com/proofs/project1.pdf"
    }
  ],
  "project_outcomes": [
    {
      "project_title": "AI for Healthcare",
      "outcome_type": "publication",
      "role": "Principal Investigator",
      "proof": "https://firebase.storage.com/proofs/outcome1.pdf"
    }
  ],
  "products": [
    {
      "product_name": "HealthAI Tool",
      "type": "Software",
      "description": "AI-powered health monitoring",
      "proof": "https://firebase.storage.com/proofs/product1.pdf"
    }
  ],
  "patents": [
    {
      "title": "Method for AI Health Prediction",
      "status": "granted",
      "patent_number": "US20240156789",
      "proof": "https://firebase.storage.com/proofs/patent1.pdf"
    }
  ],
  "patent_revenue": [
    {
      "title": "Method for AI Health Prediction",
      "amount": 100000,
      "year": 2024,
      "proof": "https://firebase.storage.com/proofs/revenue1.pdf"
    }
  ],
  "startups": [
    {
      "startup_name": "TechInnovate Pvt Ltd",
      "investment": 5000000,
      "role": "Co-Founder",
      "proof": "https://firebase.storage.com/proofs/startup1.pdf"
    }
  ],
  "consultancy": [
    {
      "activity_type": "Technical Consulting",
      "description": "AI implementation consulting",
      "amount": 250000,
      "year": 2024,
      "proof": "https://firebase.storage.com/proofs/consult1.pdf"
    }
  ],
  "phd_supervision": [
    {
      "scholar_name": "Alice Johnson",
      "status": "ongoing",
      "year": 2022,
      "proof": "https://firebase.storage.com/proofs/phd1.pdf"
    }
  ],
  "student_projects": [
    {
      "title": "Smart Attendance System",
      "students": "5",
      "department": "Computer Science",
      "status": "completed",
      "year": 2024,
      "proof": "https://firebase.storage.com/proofs/studentproj1.pdf"
    }
  ]
}
```