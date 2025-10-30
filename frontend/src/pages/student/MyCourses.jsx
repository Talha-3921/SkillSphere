import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentsAPI } from '../../lib/api';
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
            <Link key={enrollment.id} to={`/courses/${enrollment.course.id}`}>
              <div className="bg-[#161616] border-2 border-[#252525] rounded-3xl p-6 hover:border-[#94C705] transition-all cursor-pointer h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-[var(--muted)]">
                  {enrollment.course.thumbnail_url ? (
                    <img
                      src={enrollment.course.thumbnail_url}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[var(--text-secondary)]">No image</span>
                    </div>
                  )}
                  
                  {enrollment.course.is_free && (
                    <div className="absolute top-3 right-3 bg-[var(--primary)] text-black px-3 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-bold text-white line-clamp-2" style={{fontFamily: "'Suisse Int'l', sans-serif"}}>
                    {enrollment.course.title}
                  </h3>
                  
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2" style={{fontFamily: "'Suisse Int'l', sans-serif"}}>
                    {enrollment.course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-[var(--text-secondary)]">
                      {enrollment.course.instructor_name || enrollment.course.instructor?.full_name}
                    </span>
                  </div>
                  
                  {/* Progress Bar at the end */}
                  <div className="mt-auto pt-4">
                    <div className="w-full bg-[#0F0F0F] rounded-full h-2 mb-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] text-right">
                      {enrollment.progress}% complete
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
