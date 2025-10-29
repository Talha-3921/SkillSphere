# SkillSphere Developer Guide

## 📚 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Development Workflow](#development-workflow)
- [Deployment Guide](#deployment-guide)

## 🏗️ Architecture Overview

SkillSphere follows a modern three-tier architecture:

### Frontend (React + Vite)
- **Component-Based Architecture**: Reusable UI components with Tailwind CSS
- **State Management**: Zustand for global state (auth)
- **API Communication**: Axios with interceptors for token refresh
- **Routing**: React Router v6 with protected routes

### Backend (Django + DRF)
- **RESTful API**: Django REST Framework with token authentication
- **Authentication**: JWT tokens (access + refresh)
- **Database**: MySQL with Django ORM
- **File Storage**: Local media storage (configurable for S3)

### Database (MySQL)
- **Relational Model**: Proper foreign keys and constraints
- **Indexing**: Strategic indexes for query optimization
- **Migrations**: Version-controlled schema changes

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') DEFAULT 'STUDENT',
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);
```

### Courses Table
```sql
CREATE TABLE courses (
    id VARCHAR(36) PRIMARY KEY,
    instructor_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    syllabus TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    thumbnail_url VARCHAR(500),
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_instructor_status (instructor_id, status),
    INDEX idx_status (status),
    INDEX idx_category (category_id)
);
```

### Lessons Table
```sql
CREATE TABLE lessons (
    id VARCHAR(36) PRIMARY KEY,
    course_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_url VARCHAR(500),
    external_link VARCHAR(500),
    media_type ENUM('VIDEO', 'EXTERNAL', 'DOCUMENT') DEFAULT 'VIDEO',
    `order` INT NOT NULL,
    duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_order (course_id, `order`),
    UNIQUE KEY unique_course_order (course_id, `order`)
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    course_id VARCHAR(36) NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_student (student_id),
    INDEX idx_course (course_id),
    UNIQUE KEY unique_student_course (student_id, course_id)
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);
```

### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
    id VARCHAR(36) PRIMARY KEY,
    enrollment_id VARCHAR(36) NOT NULL,
    lesson_id VARCHAR(36) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    time_spent INT DEFAULT 0,
    last_position INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_enrollment (enrollment_id),
    UNIQUE KEY unique_enrollment_lesson (enrollment_id, lesson_id)
);
```

## 🔌 API Reference

### Authentication Endpoints

#### Register
```http
POST /api/users/register/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "password_confirm": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "role": "STUDENT"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "user": { ... },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login
```http
POST /api/users/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "...",
  "refresh_token": "..."
}
```

#### Refresh Token
```http
POST /api/users/refresh/
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Course Endpoints

#### List Public Courses
```http
GET /api/courses/catalog/
Query Parameters:
  - search: string (title/description search)
  - category: uuid (filter by category)
  - is_free: boolean (true/false)
  - ordering: string (created_at, price, title)

Response: 200 OK
{
  "results": [
    {
      "id": "uuid",
      "title": "Course Title",
      "description": "...",
      "price": 49.99,
      "is_free": false,
      "thumbnail_url": "...",
      "instructor_name": "John Doe",
      "lesson_count": 15,
      "total_duration": 900
    }
  ]
}
```

#### Create Course (Instructor)
```http
POST /api/courses/instructor/create/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
  - title: string (required)
  - description: string (required)
  - syllabus: string
  - category: uuid (required)
  - price: decimal
  - thumbnail_url: file
  - status: enum (DRAFT/PENDING)

Response: 201 Created
{
  "id": "uuid",
  "title": "New Course",
  ...
}
```

#### Approve/Reject Course (Admin)
```http
POST /api/courses/admin/approve/{course_id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "APPROVED",
  "admin_comment": "Great course!"
}

Response: 200 OK
{
  "message": "Course approved successfully",
  "course": { ... }
}
```

### Enrollment Endpoints

#### Enroll in Course
```http
POST /api/enrollments/enroll/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "course": "course-uuid"
}

Response: 201 Created
{
  "message": "Enrolled successfully",
  "enrollment": { ... }
}
```

#### Update Lesson Progress
```http
POST /api/enrollments/{enrollment_id}/progress/{lesson_id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "completed": true,
  "time_spent": 1800,
  "last_position": 0
}

Response: 200 OK
{
  "message": "Progress updated successfully",
  "lesson_progress": { ... },
  "enrollment_progress": 33.33
}
```

## 🔐 Authentication Flow

### JWT Token Structure
```
Access Token (30 min expiry):
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "STUDENT",
  "exp": 1234567890,
  "iat": 1234567860
}

Refresh Token (7 days expiry):
{
  "user_id": "uuid",
  "exp": 1234567890,
  "iat": 1234567860,
  "type": "refresh"
}
```

### Token Refresh Flow
1. Client makes API request with expired access token
2. API returns 401 Unauthorized
3. Axios interceptor catches error
4. Client automatically requests new access token using refresh token
5. New access token stored and original request retried
6. If refresh token also expired, redirect to login

## 🔄 Development Workflow

### 1. Setting Up Development Environment
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# Frontend
cd frontend
npm install
```

### 2. Running Development Servers
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 3. Making Database Changes
```bash
# After modifying models
python manage.py makemigrations
python manage.py migrate

# Create a data migration
python manage.py makemigrations --empty app_name
```

### 4. Testing
```bash
# Backend tests
python manage.py test

# Coverage report
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### 5. Code Quality
```bash
# Python linting
pip install flake8 black
flake8 .
black .

# JavaScript linting
npm run lint
npm run format
```

## 🚀 Deployment Guide

### Backend Deployment (Django)

#### 1. Production Settings
```python
# settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

#### 2. Static Files
```bash
python manage.py collectstatic
```

#### 3. Gunicorn Setup
```bash
pip install gunicorn
gunicorn skillsphere.wsgi:application --bind 0.0.0.0:8000
```

#### 4. Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /media/ {
        alias /path/to/media/;
    }
    
    location /static/ {
        alias /path/to/static/;
    }
}
```

### Frontend Deployment (React)

#### 1. Build for Production
```bash
cd frontend
npm run build
```

#### 2. Deploy to Static Hosting
```bash
# Option 1: Netlify
netlify deploy --prod --dir=dist

# Option 2: Vercel
vercel --prod

# Option 3: AWS S3
aws s3 sync dist/ s3://your-bucket/
```

### Database Backup
```bash
# Backup
mysqldump -u root -p skillsphere_db > backup.sql

# Restore
mysql -u root -p skillsphere_db < backup.sql
```

## 🐛 Debugging Tips

### Backend Debugging
```python
# Django shell
python manage.py shell

# Query debugging
from django.db import connection
print(connection.queries)

# Logging
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

### Frontend Debugging
```javascript
// Redux DevTools
// React DevTools
// Network tab for API calls
// Console.log strategically
```

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/Talha-3921/SkillSphere/issues
- Email: support@skillsphere.com

---

**Happy Coding! 🚀**
