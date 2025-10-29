import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { CourseCard } from '../../components/ui/CourseCard';
import { LoadingSpinner } from '../../components/ui/Loading';
import { Search } from 'lucide-react';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    is_free: '',
  });
  
  useEffect(() => {
    fetchData();
  }, [filters]);
  
  const fetchData = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        coursesAPI.getPublicCourses(filters),
        coursesAPI.getCategories(),
      ]);
      setCourses(coursesRes.data.results || coursesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Courses</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>
        
        <select
          className="input-field"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        
        <select
          className="input-field"
          value={filters.is_free}
          onChange={(e) => setFilters({ ...filters, is_free: e.target.value })}
        >
          <option value="">All Prices</option>
          <option value="true">Free</option>
          <option value="false">Paid</option>
        </select>
      </div>
      
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">No courses found</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
