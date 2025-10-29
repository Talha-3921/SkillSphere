import { useEffect, useState } from 'react';
import { enrollmentsAPI } from '../../lib/api';
import { CourseCard } from '../../components/ui/CourseCard';
import { LoadingSpinner } from '../../components/ui/Loading';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEnrollments();
  }, []);
  
  const fetchEnrollments = async () => {
    try {
      const response = await enrollmentsAPI.getMyEnrollments();
      setEnrollments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Courses</h1>
      
      {enrollments.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--text-secondary)] mb-4">You haven't enrolled in any courses yet</p>
          <a href="/courses" className="btn-primary">
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id}>
              <CourseCard course={enrollment.course} />
              <div className="mt-2 px-2">
                <div className="w-full bg-[var(--muted)] rounded-full h-2">
                  <div
                    className="bg-[var(--primary)] h-2 rounded-full transition-all"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {enrollment.progress}% complete
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
