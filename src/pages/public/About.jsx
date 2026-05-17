import { Library, Shield, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
          About Our Library Management System
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          We provide a comprehensive, modern solution for libraries to manage their collections, 
          track borrowing, and serve their communities better.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Library className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Extensive Collection</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Easily manage thousands of books across various categories with our robust categorization system.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Zap className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Real-time Updates</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Instant updates on book availability, borrowing status, and inventory management.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Shield className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Secure Admin</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Protected dashboard for administrators to securely manage library operations and reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
