# Firebase Realtime Database Schema for Employee Management System

## 1. Data Modeling (NoSQL for RTDB)

### Design Principles
- **Flat JSON Tree Structure**: Avoid deep nesting (max 2-3 levels)
- **Primary Key**: Use `employee_id` as the primary key under `employees` node
- **Separation**: Maintain separate `users` and `employees` nodes
- **Data Types**: Use appropriate data types (timestamps for dates, numbers for numeric fields)

## 2. Complete JSON Schema Structure

```json
{
  "users": {
    "EMP001": {
      "email": "john.doe@company.com",
      "role": "employee",
      "created_at": 1672531200000,
      "last_login": 1672617600000,
      "is_active": true
    },
    "EMP002": {
      "email": "jane.smith@company.com", 
      "role": "admin",
      "created_at": 1672531200000,
      "last_login": 1672617600000,
      "is_active": true
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
    },
    "EMP002": {
      "name": "Jane Smith",
      "department": "HR",
      "designation": "HR Manager", 
      "mobile": "9876543211",
      "qualification": "MBA HR",
      "joining_date": 1609372800000,
      "total_service": 3.0,
      "cbit_experience": 2.0,
      "created_at": 1672531200000,
      "updated_at": 1672617600000,
      "created_by": "EMP002"
    }
  },
  "departments": {
    "Engineering": {
      "name": "Engineering",
      "head": "EMP003",
      "employee_count": 25
    },
    "HR": {
      "name": "HR", 
      "head": "EMP002",
      "employee_count": 5
    }
  },
  "designations": {
    "Senior Developer": {
      "name": "Senior Developer",
      "level": "L3",
      "base_salary": 1500000
    },
    "HR Manager": {
      "name": "HR Manager",
      "level": "L2", 
      "base_salary": 1200000
    }
  }
}
```

## 3. Relationships and Data Linking

### Reference Strategy
- **Primary Link**: `employee_id` serves as the foreign key between `/users` and `/employees`
- **Denormalization**: Employee name is duplicated in both nodes for faster reads
- **Lookup Pattern**: Use `employee_id` to fetch complete user profile when needed

### Relationship Benefits
- **Fast Reads**: Common queries don't require multiple lookups
- **Consistency**: Employee ID ensures data integrity across nodes
- **Scalability**: Flat structure supports efficient pagination and filtering

## 4. Indexing Rules (Firebase Realtime Database Rules)

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'",
    
    "employees": {
      ".indexOn": ["department", "designation", "total_service", "joining_date"],
      "$employee_id": {
        ".read": "auth != null",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || auth.uid === $employee_id)",
        ".validate": "
          newData.hasChildren(['name', 'department', 'designation', 'mobile', 'qualification', 'joining_date']) &&
          newData.child('mobile').isString() && newData.child('mobile').val().matches(/^[0-9]{10}$/) &&
          newData.child('total_service').isNumber() && newData.child('total_service').val() >= 0 &&
          newData.child('cbit_experience').isNumber() && newData.child('cbit_experience').val() >= 0 &&
          newData.child('joining_date').isNumber() && newData.child('joining_date').val() > 0
        "
      }
    },
    
    "users": {
      "$employee_id": {
        ".read": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || auth.uid === $employee_id)",
        ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || auth.uid === $employee_id)",
        ".validate": "
          newData.hasChildren(['email', 'role']) &&
          newData.child('email').isString() && newData.child('email').val().matches(/^[^@]+@[^@]+\.[^@]+$/) &&
          (newData.child('role').val() === 'admin' || newData.child('role').val() === 'employee')
        "
      }
    },
    
    "departments": {
      ".indexOn": ["name"],
      "$department": {
        ".read": "auth != null",
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    
    "designations": {
      ".indexOn": ["name", "level"],
      "$designation": {
        ".read": "auth != null", 
        ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    }
  }
}
```

## 5. Cloud Functions for Advanced Features

### Function 1: Calculate Total Service Automatically

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Calculate total_service when employee is created or updated
exports.calculateTotalService = functions.database
  .ref('/employees/{employeeId}')
  .onWrite(async (change, context) => {
    const employeeData = change.after.val();
    
    if (!employeeData) return null; // Employee deleted
    
    const joiningDate = employeeData.joining_date;
    const currentDate = Date.now();
    
    // Calculate service in years
    const totalService = (currentDate - joiningDate) / (1000 * 60 * 60 * 24 * 365);
    
    // Update only if total_service is different
    if (Math.abs(totalService - employeeData.total_service) > 0.01) {
      return change.after.ref.update({
        total_service: Math.round(totalService * 100) / 100,
        updated_at: admin.database.ServerValue.TIMESTAMP
      });
    }
    
    return null;
  });

// Validate employee data before write
exports.validateEmployeeData = functions.database
  .ref('/employees/{employeeId}')
  .onCreate(async (snapshot, context) => {
    const employeeData = snapshot.val();
    const employeeId = context.params.employeeId;
    
    // Check if user exists
    const userSnapshot = await admin.database()
      .ref(`/users/${employeeId}`)
      .once('value');
    
    if (!userSnapshot.exists()) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Employee ID must exist in users collection'
      );
    }
    
    // Validate mobile format
    if (!/^[0-9]{10}$/.test(employeeData.mobile)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Mobile number must be exactly 10 digits'
      );
    }
    
    // Update department employee count
    await admin.database()
      .ref(`/departments/${employeeData.department}/employee_count`)
      .admin.database.ServerValue.increment(1);
    
    return null;
  });

// Audit trail for employee updates
exports.auditEmployeeChanges = functions.database
  .ref('/employees/{employeeId}')
  .onUpdate(async (change, context) => {
    const beforeData = change.before.val();
    const afterData = change.after.val();
    const employeeId = context.params.employeeId;
    
    const auditLog = {
      employee_id: employeeId,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      changed_by: context.auth.uid,
      changes: {}
    };
    
    // Track changes
    Object.keys(afterData).forEach(key => {
      if (beforeData[key] !== afterData[key]) {
        auditLog.changes[key] = {
          from: beforeData[key],
          to: afterData[key]
        };
      }
    });
    
    // Only log if there are actual changes
    if (Object.keys(auditLog.changes).length > 0) {
      await admin.database()
        .ref(`/audit_logs/${employeeId}`)
        .push(auditLog);
    }
    
    return null;
  });
```

## 6. Query Optimization Examples

### JavaScript SDK Examples

```javascript
// Initialize Firebase
const firebase = require('firebase/app');
const database = require('firebase/database');

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 1. Create Employee
async function createEmployee(employeeId, employeeData) {
  const timestamp = Date.now();
  
  const newEmployee = {
    ...employeeData,
    joining_date: new Date(employeeData.joining_date).getTime(),
    total_service: 0, // Will be calculated by Cloud Function
    created_at: timestamp,
    updated_at: timestamp
  };
  
  await db.ref(`employees/${employeeId}`).set(newEmployee);
  console.log(`Employee ${employeeId} created successfully`);
}

// 2. Update Employee
async function updateEmployee(employeeId, updates) {
  const updateData = {
    ...updates,
    updated_at: Date.now()
  };
  
  await db.ref(`employees/${employeeId}`).update(updateData);
  console.log(`Employee ${employeeId} updated successfully`);
}

// 3. Fetch Employees by Department
async function getEmployeesByDepartment(department) {
  const snapshot = await db.ref('employees')
    .orderByChild('department')
    .equalTo(department)
    .once('value');
  
  const employees = snapshot.val() || {};
  console.log(`Found ${Object.keys(employees).length} employees in ${department}`);
  return employees;
}

// 4. Get Employees by Experience Range
async function getEmployeesByExperience(minYears, maxYears) {
  const snapshot = await db.ref('employees')
    .orderByChild('total_service')
    .startAt(minYears)
    .endAt(maxYears)
    .once('value');
  
  const employees = snapshot.val() || {};
  console.log(`Found ${Object.keys(employees).length} employees with ${minYears}-${maxYears} years experience`);
  return employees;
}

// 5. Get Employee with User Details
async function getEmployeeWithUser(employeeId) {
  const [employeeSnapshot, userSnapshot] = await Promise.all([
    db.ref(`employees/${employeeId}`).once('value'),
    db.ref(`users/${employeeId}`).once('value')
  ]);
  
  const employee = employeeSnapshot.val();
  const user = userSnapshot.val();
  
  return {
    ...employee,
    user: user
  };
}

// 6. Delete Employee
async function deleteEmployee(employeeId) {
  // Get department before deletion for count update
  const employeeSnapshot = await db.ref(`employees/${employeeId}`).once('value');
  const employee = employeeSnapshot.val();
  
  // Delete employee
  await db.ref(`employees/${employeeId}`).remove();
  
  // Update department count
  await db.ref(`departments/${employee.department}/employee_count`)
    .transaction(currentCount => (currentCount || 0) - 1);
  
  console.log(`Employee ${employeeId} deleted successfully`);
}

// 7. Paginated Employee List
async function getEmployeesPaginated(pageSize = 20, startKey = null) {
  let query = db.ref('employees')
    .orderByChild('name')
    .limitToFirst(pageSize);
  
  if (startKey) {
    query = query.startAt(startKey);
  }
  
  const snapshot = await query.once('value');
  return snapshot.val() || {};
}

// 8. Search Employees by Name
async function searchEmployeesByName(searchTerm) {
  const snapshot = await db.ref('employees')
    .orderByChild('name')
    .startAt(searchTerm)
    .endAt(searchTerm + '\uf8ff')
    .once('value');
  
  return snapshot.val() || {};
}
```

### Python SDK Examples

```python
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from datetime import datetime
import re

# Initialize Firebase
cred = credentials.Certificate("service-account-key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://your-project-default-rtdb.firebaseio.com'
})

ref = db.reference()

# 1. Create Employee
def create_employee(employee_id, employee_data):
    timestamp = int(datetime.now().timestamp() * 1000)
    
    new_employee = {
        **employee_data,
        'joining_date': int(datetime.strptime(employee_data['joining_date'], '%Y-%m-%d').timestamp() * 1000),
        'total_service': 0,  # Will be calculated by Cloud Function
        'created_at': timestamp,
        'updated_at': timestamp
    }
    
    ref.child(f'employees/{employee_id}').set(new_employee)
    print(f"Employee {employee_id} created successfully")

# 2. Update Employee
def update_employee(employee_id, updates):
    update_data = {
        **updates,
        'updated_at': int(datetime.now().timestamp() * 1000)
    }
    
    ref.child(f'employees/{employee_id}').update(update_data)
    print(f"Employee {employee_id} updated successfully")

# 3. Fetch Employees by Department
def get_employees_by_department(department):
    employees = ref.child('employees')\
        .order_by_child('department')\
        .equal_to(department)\
        .get()
    
    if employees.val():
        print(f"Found {len(employees.val())} employees in {department}")
        return employees.val()
    return {}

# 4. Get Employees by Experience Range
def get_employees_by_experience(min_years, max_years):
    employees = ref.child('employees')\
        .order_by_child('total_service')\
        .start_at(min_years)\
        .end_at(max_years)\
        .get()
    
    if employees.val():
        print(f"Found {len(employees.val())} employees with {min_years}-{max_years} years experience")
        return employees.val()
    return {}

# 5. Delete Employee
def delete_employee(employee_id):
    # Get department before deletion
    employee = ref.child(f'employees/{employee_id}').get()
    
    if employee.val():
        department = employee.val()['department']
        
        # Delete employee
        ref.child(f'employees/{employee_id}').delete()
        
        # Update department count
        dept_ref = ref.child(f'departments/{department}/employee_count')
        current_count = dept_ref.get().val() or 0
        dept_ref.set(max(0, current_count - 1))
        
        print(f"Employee {employee_id} deleted successfully")
    else:
        print(f"Employee {employee_id} not found")
```

## 7. Scalability Considerations

### Performance Optimizations
- **Flat Structure**: Maximum 2-3 levels nesting reduces data transfer
- **Strategic Indexing**: Indexes on frequently queried fields (department, designation, total_service)
- **Pagination**: Implement cursor-based pagination for large datasets
- **Caching**: Use Firebase's built-in caching and implement client-side caching

### Scaling to 100K+ Records
- **Sharding Strategy**: Consider sharding by department for very large datasets
- **Read Optimization**: Duplicate frequently accessed data to avoid multiple reads
- **Write Distribution**: Use Cloud Functions to distribute write operations
- **Monitoring**: Implement performance monitoring and query optimization

## 8. Sample Data for Testing

```json
{
  "users": {
    "EMP001": {
      "email": "john.doe@company.com",
      "role": "employee",
      "created_at": 1672531200000,
      "last_login": 1672617600000,
      "is_active": true
    },
    "EMP002": {
      "email": "jane.smith@company.com",
      "role": "admin", 
      "created_at": 1672531200000,
      "last_login": 1672617600000,
      "is_active": true
    },
    "EMP003": {
      "email": "mike.wilson@company.com",
      "role": "employee",
      "created_at": 1672531200000,
      "last_login": 1672617600000,
      "is_active": true
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
    },
    "EMP002": {
      "name": "Jane Smith",
      "department": "HR",
      "designation": "HR Manager",
      "mobile": "9876543211", 
      "qualification": "MBA HR",
      "joining_date": 1609372800000,
      "total_service": 3.0,
      "cbit_experience": 2.0,
      "created_at": 1672531200000,
      "updated_at": 1672617600000,
      "created_by": "EMP002"
    },
    "EMP003": {
      "name": "Mike Wilson",
      "department": "Engineering",
      "designation": "DevOps Engineer",
      "mobile": "9876543212",
      "qualification": "B.Sc IT",
      "joining_date": 1625097600000,
      "total_service": 1.2,
      "cbit_experience": 0.8,
      "created_at": 1672531200000,
      "updated_at": 1672617600000,
      "created_by": "EMP002"
    }
  }
}
```

## 9. Design Decisions Explained

### Why This Structure?

1. **Flat Hierarchy**: RTDB performs better with shallow structures
2. **Employee ID as Key**: Ensures uniqueness and enables direct lookups
3. **Separate Users Node**: Maintains authentication data separately from employee data
4. **Timestamps**: Uses milliseconds for consistent date handling across platforms
5. **Strategic Denormalization**: Balances read performance with data consistency

### Trade-offs Considered

- **Storage vs Read Performance**: Duplicated name field increases storage but improves read speed
- **Security Complexity**: Granular rules increase setup complexity but provide better data protection
- **Function Overhead**: Cloud Functions add slight delay but ensure data consistency

### Future Extensibility

- **Department Analytics**: Departments node enables easy aggregation
- **Designation Management**: Separate designations node supports salary bands and career paths
- **Audit Trail**: Structure supports comprehensive change tracking
- **Multi-tenant Ready**: Can be extended for multiple companies/organizations

This schema provides a robust, scalable foundation for an Employee Management System using Firebase Realtime Database, balancing performance, security, and maintainability.
