# BACKEND PRD PART 2
# Authentication, User Management, Database Design & File Management

---

# 1. Authentication Module

The authentication module is responsible for securing the application and ensuring only authorized users can access protected resources.

Authentication Features

• User Registration

• User Login

• User Logout

• Access Token

• Refresh Token

• JWT Authentication

• Password Encryption

• Session Validation

• Session Expiration

• Auto Token Refresh

• Protected Routes

• Role Verification

Authentication Flow

Student

↓

Register

↓

Email Validation

↓

Password Hashing

↓

Store User

↓

Login

↓

JWT Generated

↓

Frontend Stores Token

↓

Protected API Access

---

# 2. User Registration API

Endpoint

POST /api/v1/auth/register

Purpose

Create a new student account.

Required Fields

• Full Name

• Email

• Password

• Confirm Password

• College

• Course

• Semester

• Profile Image (Optional)

Validation

• Email must be unique.

• Password length ≥ 8 characters.

• Password should contain uppercase, lowercase, number, and special character.

• Confirm Password must match.

Response

• Success Message

• User Details

• Access Token

• Refresh Token

---

# 3. Login API

Endpoint

POST /api/v1/auth/login

Purpose

Authenticate existing users.

Request Fields

• Email

• Password

Validation

• Email Exists

• Correct Password

• Active Account

Response

• JWT Access Token

• Refresh Token

• User Profile

• Login Timestamp

---

# 4. Logout API

Endpoint

POST /api/v1/auth/logout

Responsibilities

• Invalidate Session

• Clear Refresh Token

• Return Success Response

---

# 5. Refresh Token API

Endpoint

POST /api/v1/auth/refresh

Purpose

Generate a new access token without requiring the user to log in again.

---

# 6. Password Management

Features

• Forgot Password

• Reset Password

• Change Password

• Password Validation

• Password Hashing

• Password Strength Checking

---

# 7. JWT Security

Requirements

• Access Token

• Refresh Token

• Token Expiration

• Secure Secret Key

• Signature Verification

• Invalid Token Detection

• Expired Token Handling

---

# 8. Role Management

Supported Roles

• Student

Future Roles

• Teacher

• Admin

• Super Admin

Every API should verify user permissions before processing requests.

---

# 9. User Profile Module

Features

• View Profile

• Update Profile

• Change Avatar

• Update College

• Update Semester

• Update Preferences

• Delete Account

---

# 10. MongoDB Database Design

Collections

Users

Subjects

Documents

Chats

Quiz

Flashcards

StudyPlanner

Analytics

Notifications

Settings

Indexes

Email

User ID

Document ID

Chat ID

Subject ID

Created Date

---

# 11. Users Collection

Fields

• User ID

• Full Name

• Email

• Password Hash

• College

• Course

• Semester

• Avatar

• Role

• Status

• Created At

• Updated At

• Last Login

---

# 12. Subjects Collection

Fields

• Subject ID

• User ID

• Subject Name

• Subject Code

• Color

• Icon

• Created Date

---

# 13. Documents Collection

Fields

• Document ID

• User ID

• Subject ID

• File Name

• Original Name

• File Type

• File Size

• Total Pages

• Upload Date

• Storage Path

• Processing Status

• OCR Status

• Embedding Status

---

# 14. Chat Collection

Fields

• Chat ID

• User ID

• Title

• Messages

• Created At

• Updated At

• Total Questions

• Total Tokens

---

# 15. Quiz Collection

Fields

• Quiz ID

• User ID

• Subject ID

• Difficulty

• Total Questions

• Score

• Percentage

• Duration

• Created Date

---

# 16. Flashcards Collection

Fields

• Flashcard ID

• User ID

• Subject ID

• Question

• Answer

• Difficulty

• Created Date

---

# 17. Study Planner Collection

Fields

• Planner ID

• User ID

• Exam Date

• Daily Hours

• Study Schedule

• Progress

• Completion Status

---

# 18. Analytics Collection

Fields

• Analytics ID

• User ID

• Total Study Hours

• Total Chats

• Quiz Average

• Weak Topics

• Strong Topics

• Learning Streak

---

# 19. File Upload Module

Supported Formats

Documents

• PDF

• DOCX

• TXT

Images

• PNG

• JPG

• JPEG

Maximum Upload Size

• Configurable through Environment Variables

Upload Features

• Single Upload

• Multiple Upload

• Drag & Drop Support (Frontend)

• Progress Tracking

• Upload Status

• Retry Upload

• Cancel Upload

---

# 20. File Validation

Backend must validate

• File Extension

• MIME Type

• File Size

• Empty File

• Duplicate File

• Corrupted File

• Virus Scan (Future)

Invalid files must be rejected before storage.

---

# 21. File Storage

Responsibilities

• Store Files

• Generate Unique Filename

• Prevent Duplicate Names

• Maintain Metadata

• Generate Download URL

• Delete Files

• Rename Files

---

# 22. CRUD Operations

Every module must support

Create

Read

Update

Delete

Soft Delete where appropriate.

---

# 23. Database Relationships

User

↓

Subjects

↓

Documents

↓

Embeddings

↓

AI Chat

↓

Quiz

↓

Flashcards

↓

Study Planner

Every record should reference its owner using User ID.

---

# 24. Validation Standards

Every API should validate

• Required Fields

• Data Types

• Empty Values

• Invalid Formats

• Duplicate Data

• Invalid IDs

Validation must occur before business logic execution.

---

# 25. Error Handling

Authentication Errors

• Invalid Credentials

• Expired Token

• Unauthorized Access

Database Errors

• Duplicate Email

• Missing Record

• Connection Failure

Upload Errors

• Unsupported File

• Upload Failed

• File Too Large

Every error response should include

• Status

• Error Code

• User Friendly Message

• Timestamp

---

# 26. Backend Acceptance Criteria

This module will be considered complete when

✓ User registration works correctly.

✓ Login and logout are secure.

✓ JWT authentication is implemented.

✓ Refresh token flow is functional.

✓ MongoDB collections are created.

✓ CRUD operations work for all entities.

✓ File upload and validation are implemented.

✓ Database relationships are maintained.

✓ API responses follow a standard format.

✓ All authentication and database APIs are tested successfully.

---

# END OF BACKEND PRD PART 2