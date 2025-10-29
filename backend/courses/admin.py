"""Admin configuration for courses app."""
from django.contrib import admin
from .models import Category, Course, Lesson


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


class LessonInline(admin.TabularInline):
    """Inline admin for lessons."""
    model = Lesson
    extra = 1
    fields = ['title', 'order', 'duration', 'media_type']
    ordering = ['order']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    """Admin configuration for Course model."""
    
    list_display = ['title', 'instructor', 'category', 'price', 'status', 'lesson_count', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'description', 'instructor__email']
    ordering = ['-created_at']
    inlines = [LessonInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('instructor', 'title', 'description', 'category', 'price', 'thumbnail_url')
        }),
        ('Content', {
            'fields': ('syllabus',)
        }),
        ('Status & Review', {
            'fields': ('status', 'admin_comment')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    """Admin configuration for Lesson model."""
    
    list_display = ['title', 'course', 'order', 'duration', 'media_type', 'created_at']
    list_filter = ['media_type', 'created_at']
    search_fields = ['title', 'description', 'course__title']
    ordering = ['course', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('course', 'title', 'description', 'order', 'duration')
        }),
        ('Media Content', {
            'fields': ('media_type', 'video_url', 'external_link')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
