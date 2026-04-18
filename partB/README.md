# Part B Teaching Learning Evaluation API

Node.js backend API for Faculty Part B Evaluation system using Firebase Firestore.

## Project Structure

```
faculty-partB/
├── config/
│   └── firebase.js         # Firebase configuration
├── middleware/
│   └── validation.js      # Input validation
├── routes/
│   └── partB.js           # Part B API routes
├── utils/
│   └── pointsCalculator.js  # Calculate marks
├── server.js             # Main server file
├── package.json          # Dependencies
├── .env.example          # Environment variables
└── README.md            # Documentation
```

## Complete Data Structure

### B.1 Courses (Array)
```json
{
  "semester": "Odd" | "Even",
  "course_title": "string",
  "success_rate": 0-100,
  "gpa": 0-10,
  "cos_attained": 0-5
}
```

### B.2 Feedback
```json
{
  "odd_feedback": 0-100,
  "even_feedback": 0-100
}
```

### B.3 Pedagogical (Arrays of objects with description + proof)
```json
{
  "ict_tools": [{ "description": "...", "proof": "..." }],
  "assessment_tools": [{ "description": "...", "proof": "..." }],
  "case_studies": [{ "description": "...", "proof": "..." }],
  "projects": [{ "description": "...", "proof": "..." }],
  "teaching_methods": [{ "description": "...", "proof": "..." }],
  "content_development": [{ "description": "...", "proof": "..." }],
  "obe_awareness": { "description": "500 words..." }
}
```

### B.4 Mentoring
```json
{
  "total_students": 0,
  "meeting_frequency": "Weekly" | "Fortnightly" | "Monthly",
  "cleared_odd": 0,
  "cleared_even": 0,
  "events_participated": 0,
  "awards": 0,
  "nptel": 0,
  "certifications": 0,
  "attendance": 0
}
```

---

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project → **Build > Firestore Database**
3. Create database → select location → start in **Test mode**
4. **Project Settings** → **Service accounts** → Generate new private key
5. Save as `config/serviceAccountKey.json`

### 2. Install & Run
```bash
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/part-b` | Create/Update Part B data |
| GET | `/api/part-b/:employee_id` | Get by employee ID |
| GET | `/api/part-b` | Get all records |
| PUT | `/api/part-b/:employee_id` | Update data |
| DELETE | `/api/part-b/:employee_id` | Delete record |

---

## Sample Request Bodies

### POST /api/part-b
```json
{
  "employee_id": "EMP001",
  "courses": [
    {
      "semester": "Odd",
      "course_title": "Data Structures - CS301",
      "success_rate": 85,
      "gpa": 7.5,
      "cos_attained": 5
    },
    {
      "semester": "Even",
      "course_title": "Database Management - CS302",
      "success_rate": 80,
      "gpa": 7.8,
      "cos_attained": 5
    }
  ],
  "feedback": {
    "odd_feedback": 82,
    "even_feedback": 85
  },
  "ict_tools": [
    { "description": "PowerPoint, YouTube, Google Classroom", "proof": "links here" }
  ],
  "assessment_tools": [
    { "description": "Online quizzes via Google Forms", "proof": "quiz links" }
  ],
  "case_studies": [
    { "description": "E-commerce database design case", "proof": "doc link" }
  ],
  "projects": [
    { "description": "Student record management system", "proof": "report link" }
  ],
  "teaching_methods": [
    { "description": "Think-Pair-Share, Flipped classroom", "proof": "notes" }
  ],
  "content_development": [
    { "description": "Video lecture on SQL joins", "proof": "video link" },
    { "description": "DBMS Lab manual", "proof": "doc link" }
  ],
  "obe_awareness": {
    "description": "OBE (Outcome-Based Education) is a student-centered approach..."
  },
  "mentoring": {
    "total_students": 30,
    "meeting_frequency": "Weekly",
    "cleared_odd": 25,
    "cleared_even": 27,
    "events_participated": 10,
    "awards": 3,
    "nptel": 5,
    "certifications": 8,
    "attendance": 28
  }
}
```

---

## Testing with Postman

1. Open Postman
2. Create new collection "Part B API"
3. Add requests for each endpoint
4. Set Content-Type: application/json
5. Use sample JSON above as body for POST/PUT

### Base URL
```
http://localhost:3000/api/part-b
```

---

## Points Calculation (Auto)

The API calculates points based on rubrics:
- **B.1**: Success rate >75% = 10pts, GPA/10*5, COs attained
- **B.2**: Feedback >=75% = 10pts each semester
- **B.3**: 2pts per tool/method, 2pts per case/project, 5pts per content, 4pts OBE
- **B.4**: (N1/N)*4 + (N2/N)*4 + 0.5*events + 1*awards + 0.5*nptel + 0.5*cert + (N3/N)*3

Max Total: 120 points