import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BookMarked, Users, BookCheck, Clock } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    borrowed: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all books for stats
      const booksQuery = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(booksQuery);
      
      let total = 0;
      let available = 0;
      let borrowed = 0;
      const recent = [];

      snapshot.forEach((doc, index) => {
        const data = doc.data();
        total++;
        if (data.available) available++;
        else borrowed++;
        
        if (index < 5) {
          recent.push({ id: doc.id, ...data });
        }
      });

      setStats({ total, available, borrowed });
      setRecentBooks(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Books', value: stats.total, icon: BookMarked, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/10' },
    { title: 'Available Books', value: stats.available, icon: BookCheck, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-500/10' },
    { title: 'Borrowed Books', value: stats.borrowed, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/10' },
  ];

  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Recently Added Books
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Book</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Added On</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No books added yet.
                  </td>
                </tr>
              ) : (
                recentBooks.map((book) => (
                  <tr key={book.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/25">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{book.title}</div>
                      <div className="text-slate-500 text-xs">by {book.author}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{book.category}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {book.available ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                          Available
                        </span>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                            Borrowed
                          </span>
                          {book.borrowedBy && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              by {book.borrowedBy}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
