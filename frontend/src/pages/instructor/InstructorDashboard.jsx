import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { CourseCard } from '../../components/ui/CourseCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Plus, BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [coursesRes, statsRes] = await Promise.all([
        coursesAPI.getInstructorCourses(),
        coursesAPI.getInstructorStats(),
      ]);
      setCourses(coursesRes.data.results || coursesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Instructor Dashboard</h1>
        <Link to="/instructor/create-course">
          <Button className="flex items-center gap-2">
            <Plus size={20} />
            Create Course
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="text-[var(--primary)]" size={24} />
            <p className="text-sm text-[var(--text-secondary)]">TOTAL COURSES</p>
          </div>
          <p className="text-3xl font-bold">{stats?.total_courses || 0}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-yellow-500" size={24} />
            <p className="text-sm text-[var(--text-secondary)]">PENDING</p>
          </div>
          <p className="text-3xl font-bold text-yellow-500">{stats?.pending_courses || 0}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="text-green-500" size={24} />
            <p className="text-sm text-[var(--text-secondary)]">APPROVED</p>
          </div>
          <p className="text-3xl font-bold text-green-500">{stats?.approved_courses || 0}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="text-red-500" size={24} />
            <p className="text-sm text-[var(--text-secondary)]">REJECTED</p>
          </div>
          <p className="text-3xl font-bold text-red-500">{stats?.rejected_courses || 0}</p>
        </div>
      </div>
      
      {/* Courses Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>
        {courses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-[var(--text-secondary)] mb-4">You haven't created any courses yet</p>
            <Link to="/instructor/create-course">
              <Button>Create Your First Course</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} showStatus={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
