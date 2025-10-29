"""Models for courses app."""
from django.db import models
from django.core.validators import MinValueValidator, FileExtensionValidator
from users.models import User
import uuid


class Category(models.Model):
    """Category model for course classification."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'Categories'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Course(models.Model):
    """Course model."""
    
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='courses_teaching',
        limit_choices_to={'role': 'INSTRUCTOR'}
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='courses'
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    syllabus = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    thumbnail_url = models.ImageField(
        upload_to='course_thumbnails/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])]
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='DRAFT',
        db_index=True
    )
    admin_comment = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['instructor', 'status']),
            models.Index(fields=['category']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.title} by {self.instructor.full_name}"
    
    @property
    def is_free(self):
        """Check if course is free."""
        return self.price == 0
    
    @property
    def lesson_count(self):
        """Get total number of lessons."""
        return self.lessons.count()
    
    @property
    def total_duration(self):
        """Get total duration of all lessons in minutes."""
        return self.lessons.aggregate(
            total=models.Sum('duration')
        )['total'] or 0
    
    @property
    def enrollment_count(self):
        """Get total number of enrollments."""
        return self.enrollments.count()


class Lesson(models.Model):
    """Lesson model for course content."""
    
    MEDIA_TYPE_CHOICES = [
        ('VIDEO', 'Video'),
        ('EXTERNAL', 'External Link'),
        ('DOCUMENT', 'Document'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='lessons'
    )
    
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    duration = models.PositiveIntegerField(
        default=0,
        help_text='Duration in minutes'
    )
    
    # Media fields
    media_type = models.CharField(
        max_length=20,
        choices=MEDIA_TYPE_CHOICES,
        default='VIDEO'
    )
    video_url = models.FileField(
        upload_to='lesson_videos/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['mp4', 'mov', 'avi', 'mkv'])]
    )
    external_link = models.URLField(blank=True, max_length=500)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'lessons'
        ordering = ['course', 'order']
        indexes = [
            models.Index(fields=['course', 'order']),
        ]
        unique_together = ['course', 'order']
    
    def __str__(self):
        return f"{self.course.title} - Lesson {self.order}: {self.title}"
