# SkillSphere - Quick Start Guide

## 🎯 Welcome to SkillSphere!

This guide will help you get started with SkillSphere in just a few minutes.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Python 3.10 or higher installed
- [ ] Node.js 18 or higher installed
- [ ] MySQL 8.0 or higher installed and running
- [ ] Git installed
- [ ] A code editor (VS Code recommended)
- [ ] Gmail account for SMTP (optional, for email features)

## 🚀 Step-by-Step Setup

### Step 1: Get the Code

The project has been initialized in:

```
c:\Users\HS TRADER\Downloads\SkillSphere
```

To push to GitHub (if repository doesn't exist yet, create it first on GitHub):

```bash
cd "c:\Users\HS TRADER\Downloads\SkillSphere"
git push -u origin main
```

### Step 2: Setup Backend (Django)

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**

   ```bash
   # Copy .env.example to .env
   copy .env.example .env

   # Edit .env file with your settings:
   # - Set SECRET_KEY to a random string
   # - Set DB_PASSWORD to your MySQL password
   # - Configure EMAIL settings if you want email notifications
   ```

5. **Create MySQL database**

   ```sql
   # Open MySQL command line or MySQL Workbench
   CREATE DATABASE skillsphere_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. **Run migrations**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

7. **Create superuser (Admin account)**

   ```bash
   python manage.py createsuperuser
   # Enter email, password, first name, last name
   # Role will be automatically set to ADMIN
   ```

8. **Create sample categories (optional)**

   ```bash
   python manage.py shell
   ```

   ```python
   from courses.models import Category
   categories = [
       'Programming',
       'Data Science',
       'Web Development',
       'Mobile Development',
       'Design',
       'Business',
       'Marketing',
   ]
   for cat in categories:
       Category.objects.get_or_create(name=cat, description=f'{cat} courses')
   exit()
   ```

9. **Run the development server**

   ```bash
   python manage.py runserver
   ```

   ✅ Backend is now running at http://localhost:8000

### Step 3: Setup Frontend (React)

1. **Open a new terminal and navigate to frontend**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment (optional)**

   ```bash
   # Copy .env.example to .env
   copy .env.example .env

   # Default API URL is already set to http://localhost:8000/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   ✅ Frontend is now running at http://localhost:3000

### Step 4: Access the Application

Open your browser and go to: **http://localhost:3000**

## 👥 Test User Accounts

After setup, you can create test accounts:

### Create Test Instructor

1. Go to http://localhost:3000/register
2. Fill in details and select "Instructor" role
3. Click "Sign Up"

### Create Test Student

1. Go to http://localhost:3000/register
2. Fill in details and select "Student" role
3. Click "Sign Up"

### Use Admin Account

Use the superuser account you created in Step 2.7

## 📖 Usage Scenarios

### Scenario 1: Instructor Creates a Course

1. Login as Instructor
2. Go to Instructor Dashboard
3. Click "Create Course"
4. Fill in:
   - Title: "Introduction to Python"
   - Description: "Learn Python from scratch"
   - Category: "Programming"
   - Price: 0 (for free course)
   - Upload a thumbnail image
5. Click "Save as Draft" (to save without submitting)
6. Or click "Submit for Approval" (to send to admin)

### Scenario 2: Admin Approves Course

1. Login as Admin
2. Go to Admin Dashboard
3. Click "Pending Courses"
4. Click "Review" on a pending course
5. Review the content
6. Click "Approve" or "Reject" with comments
7. Instructor receives email notification (if SMTP configured)

### Scenario 3: Student Enrolls in Course

1. Login as Student
2. Go to "Courses" from navigation
3. Browse approved courses
4. Click on a course
5. Click "Enroll Now" (for free courses)
6. Go to "My Courses" to see enrolled courses
7. Track your progress

## 🎨 Features to Explore

### For Students

- ✅ Browse course catalog
- ✅ Search and filter courses
- ✅ Enroll in free courses
- ✅ View course details
- ✅ Track learning progress
- ✅ Dashboard with statistics

### For Instructors

- ✅ Create courses with rich content
- ✅ Upload course thumbnails
- ✅ Add video lessons
- ✅ Save courses as drafts
- ✅ Submit for approval
- ✅ Track course status
- ✅ Dashboard with analytics

### For Admins

- ✅ Review pending courses
- ✅ Approve/reject courses
- ✅ Add feedback comments
- ✅ System statistics
- ✅ Content moderation

## 🔧 Common Issues & Solutions

### Issue: MySQL Connection Error

**Solution:**

- Ensure MySQL is running
- Check DB_PASSWORD in .env
- Verify database exists: `SHOW DATABASES;`
- Check DB_USER has permissions

### Issue: Port Already in Use

**Solution:**

```bash
# Backend (8000)
python manage.py runserver 8001

# Frontend (3000)
npm run dev -- --port 3001
```

### Issue: Module Not Found

**Solution:**

```bash
# Backend
pip install -r requirements.txt

# Frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Error

**Solution:**

- Check CORS_ALLOWED_ORIGINS in settings.py
- Ensure frontend URL matches (http://localhost:3000)

## 📚 Next Steps

1. ✅ **Read the Full Documentation**

   - README.md - Project overview
   - docs/DEVELOPER_GUIDE.md - Technical details
   - SPRINT_1_PROGRESS.md - Implementation status

2. ✅ **Explore the Admin Panel**

   - Go to http://localhost:8000/admin
   - Login with superuser credentials
   - Manage users, courses, enrollments

3. ✅ **API Documentation**

   - API endpoints documented in DEVELOPER_GUIDE.md
   - Test APIs using Postman or Thunder Client
   - API root: http://localhost:8000/api

4. ✅ **Customize the Design**
   - Edit CSS variables in frontend/src/index.css
   - Modify TailwindCSS config in tailwind.config.js
   - Update components in frontend/src/components

## 🆘 Getting Help

If you encounter any issues:

1. Check the documentation files
2. Review error messages carefully
3. Check browser console (F12) for frontend errors
4. Check terminal output for backend errors
5. Search GitHub Issues: https://github.com/Talha-3921/SkillSphere/issues

## 🎉 Success!

You're all set! Start exploring SkillSphere and building your learning platform.

**Happy Learning! 🚀**

---

## 📞 Quick Reference

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin
- **GitHub Repo**: https://github.com/Talha-3921/SkillSphere

## 🔑 Default Credentials

Remember to change these after first login!

- **Admin**: (Created during setup)
- **Test Instructor**: (Register at /register)
- **Test Student**: (Register at /register)
