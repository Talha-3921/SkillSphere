import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI } from '../../lib/api';
import { Input, TextArea } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    syllabus: '',
    category: '',
    price: 0,
    thumbnail_url: null,
    status: 'DRAFT',
  });
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      const response = await coursesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'thumbnail_url') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    data.set('status', status);
    
    try {
      await coursesAPI.createCourse(data);
      toast.success(`Course ${status === 'DRAFT' ? 'saved as draft' : 'submitted for approval'}!`);
      navigate('/instructor');
    } catch (error) {
      const errors = error.response?.data;
      if (typeof errors === 'object') {
        Object.values(errors).forEach(err => toast.error(Array.isArray(err) ? err[0] : err));
      } else {
        toast.error('Failed to create course');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Create New Course</h1>
      
      <form className="space-y-6">
        <Input
          label="Course Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter course title"
          required
        />
        
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what students will learn"
          rows={5}
          required
        />
        
        <TextArea
          label="Syllabus"
          name="syllabus"
          value={formData.syllabus}
          onChange={handleChange}
          placeholder="Course outline and topics covered"
          rows={5}
        />
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <Input
            label="Price (USD)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0 for free"
            min="0"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
          <input
            type="file"
            name="thumbnail_url"
            onChange={handleChange}
            accept="image/*"
            className="input-field"
          />
        </div>
        
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => handleSubmit(e, 'DRAFT')}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'PENDING')}
            disabled={loading}
          >
            Submit for Approval
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
