"""Views for courses app."""
from rest_framework import status, generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.core.mail import send_mail
from django.conf import settings

from .models import Category, Course, Lesson
from .serializers import (
    CategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseCreateSerializer, CourseApprovalSerializer, LessonSerializer
)
from users.permissions import IsInstructor, IsAdmin, IsInstructorOrAdmin


# Category Views
class CategoryListView(generics.ListAPIView):
    """List all categories."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryCreateView(generics.CreateAPIView):
    """Create a new category (admin only)."""
    
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdmin]


# Course Views for Instructors
class InstructorCourseListView(generics.ListAPIView):
    """List all courses for the current instructor."""
    
    serializer_class = CourseListSerializer
    permission_classes = [IsInstructor]
    
    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user)


class CourseCreateView(generics.CreateAPIView):
    """Create a new course (instructor only)."""
    
    serializer_class = CourseCreateSerializer
    permission_classes = [IsInstructor]
    
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class CourseUpdateView(generics.UpdateAPIView):
    """Update a course (instructor can only update draft courses)."""
    
    serializer_class = CourseCreateSerializer
    permission_classes = [IsInstructor]
    
    def get_queryset(self):
        return Course.objects.filter(
            instructor=self.request.user,
            status='DRAFT'
        )


class CourseDeleteView(generics.DestroyAPIView):
    """Delete a course (instructor can only delete draft courses)."""
    
    permission_classes = [IsInstructor]
    
    def get_queryset(self):
        return Course.objects.filter(
            instructor=self.request.user,
            status='DRAFT'
        )


# Public Course Views
class PublicCourseListView(generics.ListAPIView):
    """List all approved courses (public)."""
    
    serializer_class = CourseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'price']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Course.objects.filter(status='APPROVED')
        
        # Custom filter for free/paid courses
        is_free = self.request.query_params.get('is_free', None)
        if is_free is not None:
            if is_free.lower() == 'true':
                queryset = queryset.filter(price=0)
            elif is_free.lower() == 'false':
                queryset = queryset.exclude(price=0)
        
        # Multiple category filter
        categories = self.request.query_params.getlist('category')
        if categories:
            queryset = queryset.filter(category__id__in=categories)
        
        return queryset


class PublicCourseDetailView(generics.RetrieveAPIView):
    """Get course details (public for approved courses)."""
    
    serializer_class = CourseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'
    
    def get_queryset(self):
        # Allow instructors and admins to view any course
        if self.request.user.is_authenticated:
            if self.request.user.is_admin():
                return Course.objects.all()
            elif self.request.user.is_instructor():
                return Course.objects.filter(
                    Q(status='APPROVED') | Q(instructor=self.request.user)
                )
        
        # Public can only view approved courses
        return Course.objects.filter(status='APPROVED')


# Admin Views for Course Approval
class PendingCoursesListView(generics.ListAPIView):
    """List all pending courses for admin review."""
    
    serializer_class = CourseDetailSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['category', 'instructor']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        return Course.objects.filter(status='PENDING')


class CourseReviewView(generics.RetrieveAPIView):
    """Get detailed course information for admin review."""
    
    serializer_class = CourseDetailSerializer
    permission_classes = [IsAdmin]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Course.objects.filter(status='PENDING')


class CourseApprovalView(APIView):
    """Approve or reject a course (admin only)."""
    
    permission_classes = [IsAdmin]
    
    def post(self, request, id):
        try:
            course = Course.objects.get(id=id, status='PENDING')
        except Course.DoesNotExist:
            return Response({
                'error': 'Course not found or not in pending status'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CourseApprovalSerializer(course, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        
        # Send email notification to instructor
        action = 'approved' if course.status == 'APPROVED' else 'rejected'
        try:
            send_mail(
                subject=f'Course {action.title()} - SkillSphere',
                message=f'Your course "{course.title}" has been {action}.\n\n'
                        f'{"Admin comment: " + course.admin_comment if course.admin_comment else ""}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[course.instructor.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        return Response({
            'message': f'Course {action} successfully',
            'course': CourseDetailSerializer(course).data
        }, status=status.HTTP_200_OK)


# Lesson Views
class LessonListView(generics.ListAPIView):
    """List lessons for a course."""
    
    serializer_class = LessonSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return Lesson.objects.filter(course_id=course_id).order_by('order')


class LessonCreateView(generics.CreateAPIView):
    """Add a lesson to a course (instructor only)."""
    
    serializer_class = LessonSerializer
    permission_classes = [IsInstructor]
    
    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        course = Course.objects.get(
            id=course_id,
            instructor=self.request.user,
            status='DRAFT'
        )
        serializer.save(course=course)


class LessonUpdateView(generics.UpdateAPIView):
    """Update a lesson (instructor only, draft courses only)."""
    
    serializer_class = LessonSerializer
    permission_classes = [IsInstructor]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Lesson.objects.filter(
            course__instructor=self.request.user,
            course__status='DRAFT'
        )


class LessonDeleteView(generics.DestroyAPIView):
    """Delete a lesson (instructor only, draft courses only)."""
    
    permission_classes = [IsInstructor]
    lookup_field = 'id'
    
    def get_queryset(self):
        return Lesson.objects.filter(
            course__instructor=self.request.user,
            course__status='DRAFT'
        )


# Dashboard Statistics
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_dashboard_stats(request):
    """Get statistics for admin dashboard."""
    
    total_courses = Course.objects.count()
    pending_courses = Course.objects.filter(status='PENDING').count()
    approved_courses = Course.objects.filter(status='APPROVED').count()
    rejected_courses = Course.objects.filter(status='REJECTED').count()
    total_instructors = Course.objects.values('instructor').distinct().count()
    
    return Response({
        'total_courses': total_courses,
        'pending_courses': pending_courses,
        'approved_courses': approved_courses,
        'rejected_courses': rejected_courses,
        'total_instructors': total_instructors
    })


@api_view(['GET'])
@permission_classes([IsInstructor])
def instructor_dashboard_stats(request):
    """Get statistics for instructor dashboard."""
    
    courses = Course.objects.filter(instructor=request.user)
    
    stats = {
        'total_courses': courses.count(),
        'draft_courses': courses.filter(status='DRAFT').count(),
        'pending_courses': courses.filter(status='PENDING').count(),
        'approved_courses': courses.filter(status='APPROVED').count(),
        'rejected_courses': courses.filter(status='REJECTED').count(),
    }
    
    return Response(stats)
