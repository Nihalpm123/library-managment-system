import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const MainLayout = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Books', path: '/books' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                <BookOpen className="h-6 w-6" />
                <span>LMS Portal</span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-700 pl-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <Link
                  to="/admin/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-slate-50 dark:text-indigo-400 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 dark:text-slate-400">
          <div className="flex justify-center items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">LMS Portal</span>
          </div>
          <p>© {new Date().getFullYear()} Library Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
