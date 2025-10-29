import { useEffect, useState } from 'react';
import { enrollmentsAPI } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Award } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        enrollmentsAPI.getStudentStats(),
        enrollmentsAPI.getMyEnrollments(),
      ]);
      setStats(statsRes.data);
      setRecentCourses(coursesRes.data.results?.slice(0, 3) || coursesRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Good Morning, {user?.first_name}!</h1>
        <p className="text-[var(--text-secondary)]">Welcome back to your learning journey</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-full flex items-center justify-center">
              <Clock className="text-[var(--primary)]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">TIME SPENT</p>
              <p className="text-3xl font-bold text-[var(--primary)]">{stats?.total_hours_spent || 0}h</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <BookOpen className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">COURSES ENROLLED</p>
              <p className="text-3xl font-bold text-blue-500">{stats?.total_enrolled || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Award className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">COMPLETED</p>
              <p className="text-3xl font-bold text-green-500">{stats?.completed_courses || 0}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Continue Learning */}
      {recentCourses.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Continue Learning</h2>
            <Link to="/student/my-courses" className="text-[var(--primary)] hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCourses.map((enrollment) => (
              <Link
                key={enrollment.id}
                to={`/courses/${enrollment.course.id}`}
                className="block"
              >
                <div className="flex items-center gap-4 p-4 bg-[var(--muted)] rounded-lg hover:bg-[var(--muted)]/70 transition-all">
                  {enrollment.course.thumbnail_url && (
                    <img
                      src={enrollment.course.thumbnail_url}
                      alt={enrollment.course.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{enrollment.course.title}</h3>
                    <div className="w-full bg-[var(--background)] rounded-full h-2 mb-2">
                      <div
                        className="bg-[var(--primary)] h-2 rounded-full"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {enrollment.progress}% complete
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
