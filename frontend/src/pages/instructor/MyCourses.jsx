import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { CourseCard } from '../../components/ui/CourseCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Plus } from 'lucide-react';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCourses();
  }, []);
  
  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getInstructorCourses();
      setCourses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">My Courses</h1>
      
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
  );
};

export default MyCourses;
