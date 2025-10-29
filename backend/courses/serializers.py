"""Serializers for courses app."""
from rest_framework import serializers
from .models import Category, Course, Lesson
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model."""
    
    course_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'course_count', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_course_count(self, obj):
        """Get the number of approved courses in this category."""
        return obj.courses.filter(status='APPROVED').count()


class LessonSerializer(serializers.ModelSerializer):
    """Serializer for Lesson model."""
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'course', 'title', 'description', 'order', 'duration',
            'media_type', 'video_url', 'external_link', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate(self, attrs):
        """Validate lesson media fields."""
        media_type = attrs.get('media_type')
        video_url = attrs.get('video_url')
        external_link = attrs.get('external_link')
        
        if media_type == 'VIDEO' and not video_url:
            raise serializers.ValidationError({
                'video_url': 'Video URL is required for video lessons'
            })
        
        if media_type == 'EXTERNAL' and not external_link:
            raise serializers.ValidationError({
                'external_link': 'External link is required for external lessons'
            })
        
        return attrs


class LessonCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating lessons."""
    
    class Meta:
        model = Lesson
        fields = [
            'title', 'description', 'order', 'duration',
            'media_type', 'video_url', 'external_link'
        ]


class CourseListSerializer(serializers.ModelSerializer):
    """Serializer for course list view."""
    
    instructor_name = serializers.CharField(source='instructor.full_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    total_duration = serializers.IntegerField(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    enrollment_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'title', 'description', 'instructor_name', 'category_name',
            'price', 'is_free', 'thumbnail_url', 'status', 'lesson_count',
            'total_duration', 'enrollment_count', 'created_at'
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    """Serializer for course detail view."""
    
    instructor = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    lessons = LessonSerializer(many=True, read_only=True)
    lesson_count = serializers.IntegerField(read_only=True)
    total_duration = serializers.IntegerField(read_only=True)
    is_free = serializers.BooleanField(read_only=True)
    enrollment_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id', 'instructor', 'category', 'title', 'description', 'syllabus',
            'price', 'is_free', 'thumbnail_url', 'status', 'admin_comment',
            'lessons', 'lesson_count', 'total_duration', 'enrollment_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CourseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating courses."""
    
    lessons = LessonCreateSerializer(many=True, required=False)
    
    class Meta:
        model = Course
        fields = [
            'title', 'description', 'syllabus', 'category', 'price',
            'thumbnail_url', 'status', 'lessons'
        ]
    
    def validate_status(self, value):
        """Validate status transitions."""
        if self.instance:  # Update
            current_status = self.instance.status
            
            # Only allow editing draft courses
            if current_status != 'DRAFT' and value != current_status:
                raise serializers.ValidationError(
                    "You can only edit courses in draft status"
                )
        
        return value
    
    def validate(self, attrs):
        """Validate course data."""
        status = attrs.get('status', 'DRAFT')
        
        # If submitting for approval, ensure all required fields are present
        if status == 'PENDING':
            required_fields = ['title', 'description', 'category', 'thumbnail_url']
            for field in required_fields:
                if not attrs.get(field):
                    raise serializers.ValidationError({
                        field: f'{field} is required when submitting for approval'
                    })
        
        return attrs
    
    def create(self, validated_data):
        """Create course with lessons."""
        lessons_data = validated_data.pop('lessons', [])
        course = Course.objects.create(**validated_data)
        
        # Create lessons
        for lesson_data in lessons_data:
            Lesson.objects.create(course=course, **lesson_data)
        
        return course
    
    def update(self, instance, validated_data):
        """Update course and lessons."""
        lessons_data = validated_data.pop('lessons', None)
        
        # Update course fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update lessons if provided
        if lessons_data is not None:
            # Delete existing lessons and create new ones
            instance.lessons.all().delete()
            for lesson_data in lessons_data:
                Lesson.objects.create(course=instance, **lesson_data)
        
        return instance


class CourseApprovalSerializer(serializers.ModelSerializer):
    """Serializer for admin course approval/rejection."""
    
    class Meta:
        model = Course
        fields = ['status', 'admin_comment']
    
    def validate_status(self, value):
        """Validate status value."""
        if value not in ['APPROVED', 'REJECTED']:
            raise serializers.ValidationError(
                "Status must be either APPROVED or REJECTED"
            )
        return value
    
    def validate(self, attrs):
        """Validate that rejection has a comment."""
        status = attrs.get('status')
        admin_comment = attrs.get('admin_comment', '')
        
        if status == 'REJECTED' and not admin_comment:
            raise serializers.ValidationError({
                'admin_comment': 'Admin comment is required when rejecting a course'
            })
        
        return attrs
