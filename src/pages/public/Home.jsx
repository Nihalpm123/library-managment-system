import { Link } from 'react-router-dom';
import { ArrowRight, BookMarked, Users, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Home = () => {
  const features = [
    {
      icon: BookMarked,
      title: 'Vast Collection',
      description: 'Access thousands of books across various categories and genres.',
    },
    {
      icon: Users,
      title: 'Easy Borrowing',
      description: 'Simple and straightforward process to borrow and return books.',
    },
    {
      icon: Clock,
      title: '24/7 Access',
      description: 'Browse our catalog and manage your reading list anytime, anywhere.',
    },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
          Modern Library <span className="text-indigo-600 dark:text-indigo-400">Management</span>
        </h1>
        <p className="max-w-2xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10">
          Discover a world of knowledge with our comprehensive library management system. 
          Browse, borrow, and manage your reading journey seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/books">
            <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto">
              Browse Catalog
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
