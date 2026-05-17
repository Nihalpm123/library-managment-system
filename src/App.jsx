import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Books from './pages/public/Books';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import AddEditBook from './pages/admin/AddEditBook';
import BorrowedBooks from './pages/admin/BorrowedBooks';
import Reports from './pages/admin/Reports';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/admin/login" />;
  return children;
};

function App() {
  return (
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
      </Route>

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
