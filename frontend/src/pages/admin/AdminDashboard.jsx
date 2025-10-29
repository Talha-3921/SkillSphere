import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { BookOpen, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    try {
      const response = await coursesAPI.getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      
      {/* Stats Grid */}
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
            <p className="text-sm text-[var(--text-secondary)]">PENDING APPROVAL</p>
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
      
      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link to="/admin/pending-courses" className="block">
            <div className="p-4 bg-[var(--muted)] rounded-lg hover:bg-[var(--muted)]/70 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Review Pending Courses</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {stats?.pending_courses || 0} courses waiting for approval
                  </p>
                </div>
                <div className="text-yellow-500 font-bold text-2xl">
                  {stats?.pending_courses || 0}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
