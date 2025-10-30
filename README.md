# SkillSphere - Learning Management System

![SkillSphere](https://img.shields.io/badge/Version-1.0.0-94C705?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)

## 🎯 Overview

SkillSphere is a comprehensive Learning Management System (LMS) that enables instructors to create and manage courses, students to enroll and learn, and administrators to moderate content. Built with Django REST Framework and React, it provides a modern, scalable platform for online education.

## ✨ Features

### 👨‍🎓 For Students

- Browse and search course catalog
- Free course enrollment
- Track learning progress
- View completed courses and certificates
- Interactive dashboard with statistics

### 👨‍🏫 For Instructors

- Create and manage courses
- Upload video lessons and external links
- Save courses as drafts
- Submit courses for admin approval
- Track course status (Draft/Pending/Approved/Rejected)
- Instructor dashboard with analytics

### 👨‍💼 For Administrators

- Review pending courses
- Approve or reject courses with feedback
- Email notifications to instructors
- Admin dashboard with system statistics
- Content moderation tools

## 🛠️ Tech Stack

### Backend

- **Django 5.0** - Web framework
- **Django REST Framework** - API development
- **MySQL** - Database
- **JWT** - Authentication
- **SMTP** - Email notifications
- **Pillow** - Image processing
- **ReportLab** - PDF generation

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Zustand** - State management
- **React Router** - Navigation
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/Talha-3921/SkillSphere.git
cd SkillSphere/backend
```

2. **Create virtual environment**

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Configure environment**

```bash
copy .env.example .env
# Edit .env with your settings
```

5. **Create MySQL database**

```sql
CREATE DATABASE skillsphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. **Run migrations**

```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser**

```bash
python manage.py createsuperuser
```

8. **Run development server**

```bash
python manage.py runserver
```

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
copy .env.example .env
# Edit .env if needed
```

4. **Run development server**

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🚀 Quick Start

1. **Access the application**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin

2. **Register an account**

   - Choose Student or Instructor role
   - Verify email (if configured)

3. **For Instructors**

   - Create a course from the dashboard
   - Add lessons and content
   - Submit for approval

4. **For Students**

   - Browse course catalog
   - Enroll in free courses
   - Track your progress

5. **For Admins**
   - Review pending courses
   - Approve/reject with feedback

## 📁 Project Structure

```
SkillSphere/
├── backend/
│   ├── skillsphere/          # Django project settings
│   ├── users/                # User authentication & management
│   ├── courses/              # Course & lesson management
│   ├── enrollments/          # Student enrollments & progress
│   ├── media/                # Uploaded files
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── layouts/          # Layout components
│   │   ├── lib/              # Utilities & API
│   │   ├── store/            # State management
│   │   └── App.jsx
│   ├── public/
│   └── package.json
└── docs/                     # Documentation
```

## 🎨 Design System

SkillSphere uses a custom design system with the following color palette:

- **Primary**: `#94C705` (Lime Green) - Headings, icons, CTAs
- **Background**: `#1a1a1a` (Charcoal Black)
- **Card Fill**: `#161616` (Dark)
- **Text Secondary**: `#999999` (Gray)
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`

## 📚 API Documentation

### Authentication

- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `GET /api/users/me/` - Get current user
- `POST /api/users/password/reset/` - Request password reset

### Courses

- `GET /api/courses/catalog/` - List approved courses (public)
- `GET /api/courses/catalog/:id/` - Course details
- `GET /api/courses/categories/` - List categories
- `GET /api/courses/instructor/my-courses/` - Instructor's courses
- `POST /api/courses/instructor/create/` - Create course
- `PUT /api/courses/instructor/:id/update/` - Update course
- `GET /api/courses/admin/pending/` - Pending courses (admin)
- `POST /api/courses/admin/approve/:id/` - Approve/reject course

### Enrollments

- `POST /api/enrollments/enroll/` - Enroll in course
- `GET /api/enrollments/my-courses/` - Student's enrollments
- `GET /api/enrollments/check/:id/` - Check enrollment status
- `POST /api/enrollments/:enrollment_id/progress/:lesson_id/` - Update progress



## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Project Link: [https://github.com/Talha-3921/SkillSphere](https://github.com/Talha-3921/SkillSphere)

## 🙏 Acknowledgments

- Django REST Framework
- React Community
- TailwindCSS
- Lucide Icons

---

**Made with ❤️ by the SkillSphere Team**
