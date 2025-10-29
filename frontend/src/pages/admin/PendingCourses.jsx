import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { LoadingSpinner } from '../../components/ui/Loading';
import { formatPrice } from '../../lib/utils';
import { Eye } from 'lucide-react';

const PendingCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPendingCourses();
  }, []);
  
  const fetchPendingCourses = async () => {
    try {
      const response = await coursesAPI.getPendingCourses();
      setCourses(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Pending Courses</h1>
      
      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-[var(--text-secondary)]">No pending courses to review</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left p-4">Course Title</th>
                  <th className="text-left p-4">Instructor</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Submitted</th>
                  <th className="text-center p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]">
                    <td className="p-4 font-semibold">{course.title}</td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      {course.instructor?.full_name}
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      {course.category?.name}
                    </td>
                    <td className="p-4">{formatPrice(course.price)}</td>
                    <td className="p-4 text-sm text-[var(--text-secondary)]">
                      {new Date(course.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                      <Link to={`/admin/review-course/${course.id}`}>
                        <button className="btn-primary flex items-center gap-2 mx-auto">
                          <Eye size={16} />
                          Review
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingCourses;
