# Part D and E: Firestore Subcollection Backend

## Overview
This module seamlessly integrates **Firestore** natively into your existing **Firebase Realtime Database (RTDB)** backend. 

While RTDB is exceptional at flat tree synchronized objects, Firestore expands this ecosystem organically by giving you a flexible, heavily-nested subcollection structure to store sprawling historical data objects independently of live trees (e.g., unlimited arrays of historical `trainings`, `certifications`, or sprawling `awards` documents). 

Both databases act as dual, perfectly isolated services managed seamlessly by `firebase-admin`, coexisting under the shared architectural constraint that **all Firestore document IDs map identically 1-to-1 against RTDB `employee_id` nodes.**

## Prerequisites
1. **Part A (RTDB)** backend must be fully cloned, installed (`npm install`), and configured.
2. The Firebase active project environment (`.env` file) must be connected.
3. Your Firebase Admin Service Account Key (`service-account-key.json`) must be authenticated inside the root filesystem.
4. Internal backend JWT Authentication via `auth.js` middlewares must be functional.

## Setup Steps
1. Assure `src/config/firebase.js` exports `firestore: admin.firestore()` alongside Realtime DB.
2. Run standard installation dependencies: `npm install`.
3. Start the application backend locally: `npm run dev` running on port 3000.
4. (Optional) Run the seeding script to hydrate baseline database states.

## API Usage
This application leverages generic, extensible endpoints.

### Creating Data (POST) - Admin Only
```http
POST /api/partD/:employee_id/:type
Body: { 
  "type": "Technical", 
  "title": "Cloud Security", 
  "duration": "1 week", 
  "proof": "cert_link.pdf" 
}
```
**Example**: `POST /api/partD/EMP001/trainings_attended`  
*Response: 201 Created (Creates subcollection document)*

### Reading Data (GET) - Self OR Admin
```http
GET /api/partD/:employee_id/:type
```
**Example**: `GET /api/partD/EMP001/workshops`  
*Response: Array object with defaults -> `[]` if none found.*

### Updating Data (PUT) - Self OR Admin
```http
PUT /api/partD/:employee_id/:type/:docId
Body: { "title": "Updated Title", ...args }
```
*Note: For single fields (e.g., `additional_info`, `institution_contribution`), no `:docId` is required.*

### Deleting Data (DELETE) - Admin Only
```http
DELETE /api/partD/:employee_id/:type/:docId
```

## Data Structure & Schema
The module supports 11 distinct data types grouped by persistence logic.

### 1. Subcollections (Array Logic)
Each entry is a unique document in a nested collection.
- `trainings_attended`: `[type, title, duration, proof]`
- `workshops`: `[title, duration, description, proof]`
- `certifications`: `[title, organization, description, duration, proof]`
- `training_conducted`: `[role, program_type, duration, count, proof]`
- `value_added_courses`: `[title, duration_hours, count, proof]`
- `professional_memberships`: `[society_name, membership_type, count, proof]`
- `interactions`: `[activity_type, description, add_on, proof]`
- `awards`: `[title, description, year, proof]`

### 2. Root Fields (Object/Merged Logic)
Stored as top-level fields within the employee document.
- `additional_info`: `{ bio, research_area }`
- `institution_contribution`: `{ description, principal_remarks }`
- `department_contribution`: `{ description, hod_remarks }`

### Validation Constraints
Every request undergoes a multi-stage validation pipeline:
1. **Authentication**: Verifies JWT token.
2. **Authorization**: Ensures proper role or record ownership.
3. **Database Existence (RTDB)**: Verifies that the `employee_id` exists in the Realtime Database `/users` node. If not found, a `404 Not Found` is returned.
4. **Schema Validation**: Ensures the payload matches the specific model for the requested `type`.

Single fields intelligently perform `merge` updates, ensuring data integrity across partial writes.

## Seeding Instructions
## Seeding Instructions
To kickstart your frontend iteration or backend inspection, a seeding script has been provided which hydrates Firestore precisely.

1. Ensure the development server allows connections.
2. Open your terminal in the root path.
3. Run: `npm run seed-firestore`
4. **Expected Output**:
   ```
   --- Starting Firestore Data Seeding ---
   Inserting dummy data for EMP001...
   Added training 1...
   ...
   --- Seeding Completed Successfully ---
   ```

## Security Design
This exact routing layer relies on perfectly intact Part A Middlewares seamlessly attached without modifications.
- **`authenticate` middleware**: Parses your headers checking for Firebase Bearer JWTs, and injects payload logic.
- **`authorize(['admin'])`**: Locks endpoints natively. If `PUT` operations aren't listed natively under them, Unauthorized requests are rejected with 403.
- **`selfOrAdmin` logic**: Parses `/:employee_id/` out of the endpoint URL, mapping against the token caller's injected ID. Thus, generic users fetching their own resources succeed (`EMP001` querying `EMP001`), whilst accessing unauthorized IDs crashes immediately returning `403`.
- **`validateEmployeeExists`**: Added as the final safety layer to ensure operations only occur for employees present in the Realtime Database.
