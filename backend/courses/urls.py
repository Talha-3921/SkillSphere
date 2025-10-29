"""URL configuration for courses app."""
from django.urls import path
from .views import (
    CategoryListView, CategoryCreateView,
    InstructorCourseListView, CourseCreateView, CourseUpdateView, CourseDeleteView,
    PublicCourseListView, PublicCourseDetailView,
    PendingCoursesListView, CourseReviewView, CourseApprovalView,
    LessonListView, LessonCreateView, LessonUpdateView, LessonDeleteView,
    admin_dashboard_stats, instructor_dashboard_stats
)

urlpatterns = [
    # Categories
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('categories/create/', CategoryCreateView.as_view(), name='category-create'),
    
    # Instructor course management
    path('instructor/my-courses/', InstructorCourseListView.as_view(), name='instructor-courses'),
    path('instructor/create/', CourseCreateView.as_view(), name='course-create'),
    path('instructor/<uuid:pk>/update/', CourseUpdateView.as_view(), name='course-update'),
    path('instructor/<uuid:pk>/delete/', CourseDeleteView.as_view(), name='course-delete'),
    path('instructor/dashboard/stats/', instructor_dashboard_stats, name='instructor-dashboard-stats'),
    
    # Public course catalog
    path('catalog/', PublicCourseListView.as_view(), name='public-course-list'),
    path('catalog/<uuid:id>/', PublicCourseDetailView.as_view(), name='public-course-detail'),
    
    # Admin course approval
    path('admin/pending/', PendingCoursesListView.as_view(), name='pending-courses'),
    path('admin/review/<uuid:id>/', CourseReviewView.as_view(), name='course-review'),
    path('admin/approve/<uuid:id>/', CourseApprovalView.as_view(), name='course-approval'),
    path('admin/dashboard/stats/', admin_dashboard_stats, name='admin-dashboard-stats'),
    
    # Lessons
    path('<uuid:course_id>/lessons/', LessonListView.as_view(), name='lesson-list'),
    path('<uuid:course_id>/lessons/create/', LessonCreateView.as_view(), name='lesson-create'),
    path('lessons/<uuid:id>/update/', LessonUpdateView.as_view(), name='lesson-update'),
    path('lessons/<uuid:id>/delete/', LessonDeleteView.as_view(), name='lesson-delete'),
]
