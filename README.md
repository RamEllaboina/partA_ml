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
