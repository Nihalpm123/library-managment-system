import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Loading spinner component for lazy route fallback
const PageLoader = () => (
  <div className="min-h-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Layouts
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// Public Pages
const Home = lazy(() => import('./pages/public/Home'));
const Books = lazy(() => import('./pages/public/Books'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageBooks = lazy(() => import('./pages/admin/ManageBooks'));
const AddEditBook = lazy(() => import('./pages/admin/AddEditBook'));
const BorrowedBooks = lazy(() => import('./pages/admin/BorrowedBooks'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const ManageMembers = lazy(() => import('./pages/admin/ManageMembers'));
const AddEditMember = lazy(() => import('./pages/admin/AddEditMember'));

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<Books />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="books/add" element={<AddEditBook />} />
          <Route path="books/edit/:id" element={<AddEditBook />} />
          <Route path="borrowed" element={<BorrowedBooks />} />
          <Route path="reports" element={<Reports />} />
          <Route path="members" element={<ManageMembers />} />
          <Route path="members/add" element={<AddEditMember />} />
          <Route path="members/edit/:id" element={<AddEditMember />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
