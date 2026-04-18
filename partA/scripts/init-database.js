const { db } = require('../src/config/firebase');

const initialData = {
  users: {
    "EMP001": {
      email: "john.doe@company.com",
      role: "employee",
      created_at: 1672531200000,
      last_login: 1672617600000,
      is_active: true
    },
    "EMP002": {
      email: "jane.smith@company.com",
      role: "admin",
      created_at: 1672531200000,
      last_login: 1672617600000,
      is_active: true
    },
    "EMP003": {
      email: "mike.wilson@company.com",
      role: "employee",
      created_at: 1672531200000,
      last_login: 1672617600000,
      is_active: true
    }
  },
  employees: {
    "EMP001": {
      name: "John Doe",
      department: "Engineering",
      designation: "Senior Developer",
      mobile: "9876543210",
      qualification: "B.Tech Computer Science",
      joining_date: 1609459200000,
      total_service: 2.5,
      cbit_experience: 1.5,
      created_at: 1672531200000,
      updated_at: 1672617600000,
      created_by: "EMP002"
    },
    "EMP002": {
      name: "Jane Smith",
      department: "HR",
      designation: "HR Manager",
      mobile: "9876543211",
      qualification: "MBA HR",
      joining_date: 1609372800000,
      total_service: 3.0,
      cbit_experience: 2.0,
      created_at: 1672531200000,
      updated_at: 1672617600000,
      created_by: "EMP002"
    },
    "EMP003": {
      name: "Mike Wilson",
      department: "Engineering",
      designation: "DevOps Engineer",
      mobile: "9876543212",
      qualification: "B.Sc IT",
      joining_date: 1625097600000,
      total_service: 1.2,
      cbit_experience: 0.8,
      created_at: 1672531200000,
      updated_at: 1672617600000,
      created_by: "EMP002"
    }
  },
  departments: {
    "Engineering": {
      name: "Engineering",
      head: "EMP003",
      employee_count: 2
    },
    "HR": {
      name: "HR",
      head: "EMP002",
      employee_count: 1
    }
  },
  designations: {
    "Senior Developer": {
      name: "Senior Developer",
      level: "L3",
      base_salary: 1500000
    },
    "HR Manager": {
      name: "HR Manager",
      level: "L2",
      base_salary: 1200000
    },
    "DevOps Engineer": {
      name: "DevOps Engineer",
      level: "L2",
      base_salary: 1300000
    }
  }
};

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing Firebase Realtime Database...');
    
    // Clear existing data (optional - remove if you want to preserve existing data)
    console.log('🗑️  Clearing existing data...');
    await db.ref('/').set(null);
    
    // Set initial data
    console.log('📊 Setting up initial data...');
    await db.ref('/').set(initialData);
    
    console.log('✅ Database initialized successfully!');
    console.log('\n📋 Sample data created:');
    console.log('   - 3 users (2 employees, 1 admin)');
    console.log('   - 3 employees');
    console.log('   - 2 departments');
    console.log('   - 3 designations');
    console.log('\n🔑 Admin credentials:');
    console.log('   Email: jane.smith@company.com');
    console.log('   Role: admin');
    console.log('   Employee ID: EMP002');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('\n🎉 Database initialization complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase, initialData };
