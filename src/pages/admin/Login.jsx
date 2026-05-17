import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to log in. Check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 dark:bg-indigo-500/10 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button 
            type="submit" 
            className="w-full" 
            isLoading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>This area is restricted to library administrators.</p>
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-left text-xs border border-indigo-100 dark:border-indigo-500/20">
            <p className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">Demo Credentials (Bypasses Firebase):</p>
            <p>Email: <span className="font-mono bg-white dark:bg-slate-900 px-1 rounded">admin@admin.com</span></p>
            <p>Password: <span className="font-mono bg-white dark:bg-slate-900 px-1 rounded">admin123</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
