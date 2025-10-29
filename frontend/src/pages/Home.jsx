import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6">
            Create <span className="text-[var(--primary)]">Presentations</span>
            <br />in Seconds
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            AI-powered presentation builder with premium templates,
            real-time collaboration, and professional export options.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/courses" className="btn-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-[var(--primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Instructors</h3>
            <p className="text-[var(--text-secondary)]">
              Learn from industry professionals with years of experience
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-[var(--primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Learning</h3>
            <p className="text-[var(--text-secondary)]">
              Join a thriving community of learners and collaborate
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-[var(--primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Get Certified</h3>
            <p className="text-[var(--text-secondary)]">
              Earn certificates upon completion to showcase your skills
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
