# Firebase Employee Management System

A scalable and optimized Firebase Realtime Database schema for employee management with Node.js API backend.

## 🚀 Features

- **Real-time Database**: Optimized flat JSON structure for Firebase RTDB
- **Security Rules**: Role-based access control with data validation
- **RESTful API**: Complete CRUD operations for employee management
- **Authentication**: Firebase Auth integration with role-based permissions
- **Data Validation**: Joi validation for all inputs
- **Scalability**: Designed to handle 100K+ employee records
- **Audit Trail**: Track all employee changes
- **Statistics**: Department and experience analytics

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Realtime Database
- Firebase service account key

## 🛠️ Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```
Edit `.env` with your Firebase configuration:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_KEY=./service-account-key.json
```

3. **Add Firebase service account key**
Place your service account JSON file in the project root as `service-account-key.json`

4. **Initialize database**
```bash
npm run init-db
```

5. **Deploy Firebase rules**
```bash
firebase deploy --only database
```

## 🚀 Start Development

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication
All API endpoints require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Endpoints

#### Employees
- `GET /api/employees` - Get all employees (admin only)
- `POST /api/employees` - Create new employee (admin only)
- `GET /api/employees/:employee_id` - Get employee by ID (self or admin)
- `PUT /api/employees/:employee_id` - Update employee (self or admin)
- `DELETE /api/employees/:employee_id` - Delete employee (admin only)
- `GET /api/employees/search?q=<query>` - Search employees by name (admin only)
- `GET /api/employees/department/:department` - Get employees by department (admin only)
- `GET /api/employees/experience?min_years=<min>&max_years=<max>` - Get by experience range (admin only)
- `GET /api/employees/stats` - Get employee statistics (admin only)

#### Health Check
- `GET /health` - API health status

### Example Requests

#### Create Employee
```bash
curl -X POST http://localhost:3000/api/employees \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP004",
    "user_data": {
      "email": "new.employee@company.com",
      "role": "employee"
    },
    "employee_data": {
      "name": "New Employee",
      "department": "Engineering",
      "designation": "Developer",
      "mobile": "9876543213",
      "qualification": "B.Tech",
      "joining_date": "2024-01-15"
    }
  }'
```

#### Get All Employees
```bash
curl -X GET http://localhost:3000/api/employees \
  -H "Authorization: Bearer <token>"
```

#### Get Employees by Department
```bash
curl -X GET http://localhost:3000/api/employees/department/Engineering \
  -H "Authorization: Bearer <token>"
```

## 📊 Database Schema

### Structure
```
{
  "users": {
    "EMP001": {
      "email": "john.doe@company.com",
      "role": "employee",
      "is_active": true,
      "created_at": 1672531200000,
      "last_login": 1672617600000
    }
  },
  "employees": {
    "EMP001": {
      "name": "John Doe",
      "department": "Engineering",
      "designation": "Senior Developer",
      "mobile": "9876543210",
      "qualification": "B.Tech Computer Science",
      "joining_date": 1609459200000,
      "total_service": 2.5,
      "cbit_experience": 1.5,
      "created_at": 1672531200000,
      "updated_at": 1672617600000,
      "created_by": "EMP002"
    }
  },
  "departments": {
    "Engineering": {
      "name": "Engineering",
      "head": "EMP003",
      "employee_count": 2
    }
  },
  "designations": {
    "Senior Developer": {
      "name": "Senior Developer",
      "level": "L3",
      "base_salary": 1500000
    }
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

## 🔒 Security Features

- **Role-based access**: Admin and employee roles
- **Data validation**: Mobile format, required fields, data types
- **Self-service**: Employees can update their own data
- **Audit logging**: Track all changes with timestamps
- **Firebase security rules**: Server-side validation

## 📈 Performance Optimizations

- **Flat structure**: Maximum 2-3 levels nesting
- **Strategic indexing**: Department, designation, experience, name
- **Pagination**: Cursor-based for large datasets
- **Efficient queries**: Avoid full database scans
- **Caching**: Leverages Firebase built-in caching

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Firebase Hosting
```bash
# Deploy all services
npm run deploy-all

# Deploy only functions
npm run deploy-functions

# Deploy only hosting
npm run deploy-hosting
```

### Environment Setup
- Development: Set `NODE_ENV=development`
- Production: Set `NODE_ENV=production`

## 📝 Sample Data

The system comes with pre-configured sample data:
- **3 users**: 2 employees, 1 admin
- **3 employees**: Sample employee records
- **2 departments**: Engineering and HR
- **3 designations**: Senior Developer, HR Manager, DevOps Engineer

**Admin Credentials:**
- Email: jane.smith@company.com
- Employee ID: EMP002
- Role: admin

## 🔧 Configuration

### Firebase Configuration
Update `firebase.json` for your project structure:
- Database rules location
- Functions source directory
- Hosting public directory

### Security Rules
Database rules are in `database.rules.json`:
- Authentication requirements
- Role-based permissions
- Data validation rules
- Indexing configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the [FAQ](#faq)
2. Review [API Documentation](#api-documentation)
3. Create an issue in the repository

## FAQ

**Q: How do I add custom fields to employees?**
A: Update the validation schema in `src/models/Employee.js` and add the new fields to the database rules.

**Q: Can I use this with Firestore instead of Realtime Database?**
A: This is specifically designed for Realtime Database. For Firestore, the schema and queries would need significant changes.

**Q: How do I implement password reset?**
A: Use Firebase Auth's built-in password reset functionality with the client SDK.

**Q: Can I integrate with external HR systems?**
A: Yes, the API can be extended to sync with external systems using webhooks or scheduled jobs.
=======
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
