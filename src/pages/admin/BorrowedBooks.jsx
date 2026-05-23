import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BookUp, RotateCcw, Search, Loader2, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const BorrowedBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Issue Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issueData, setIssueData] = useState({
    bookId: '',
    borrowerName: ''
  });
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const q = query(collection(db, 'books'), where('available', '==', false));
      const querySnapshot = await getDocs(q);
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBooks(booksData);
    } catch (error) {
      toast.error('Failed to load borrowed books');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const q = query(collection(db, 'books'), where('available', '==', true));
      const querySnapshot = await getDocs(q);
      const booksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableBooks(booksData);
    } catch (error) {
      toast.error('Failed to load available books');
    }
  };

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'members'));
      const querySnapshot = await getDocs(q);
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
    } catch (error) {
      toast.error('Failed to load members');
    }
  };

  const handleOpenIssueModal = () => {
    fetchAvailableBooks();
    fetchMembers();
    setIsModalOpen(true);
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueData.bookId || !issueData.borrowerName) return;
    
    setIssuing(true);
    try {
      await updateDoc(doc(db, 'books', issueData.bookId), {
        available: false,
        borrowedBy: issueData.borrowerName,
        borrowDate: new Date().toISOString()
      });
      toast.success('Book issued successfully');
      setIsModalOpen(false);
      setIssueData({ bookId: '', borrowerName: '' });
      fetchBorrowedBooks(); // Refresh list
    } catch (error) {
      toast.error('Failed to issue book');
    } finally {
      setIssuing(false);
    }
  };

  const handleReturnBook = async (id, title) => {
    if (window.confirm(`Are you sure you want to return "${title}"?`)) {
      try {
        await updateDoc(doc(db, 'books', id), {
          available: true,
          borrowedBy: null,
          borrowDate: null
        });
        toast.success('Book returned successfully');
        setBooks(books.filter(book => book.id !== id));
      } catch (error) {
        toast.error('Failed to return book');
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (book.borrowedBy && book.borrowedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by book or borrower..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button icon={BookUp} onClick={handleOpenIssueModal}>Issue Book</Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Book Info</th>
                <th className="px-6 py-4 font-medium">Borrower Name</th>
                <th className="px-6 py-4 font-medium">Borrow Date</th>
                <th className="px-6 py-4 font-medium">Due Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No books currently borrowed.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/25">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white line-clamp-1">{book.title}</div>
                      <div className="text-slate-500 text-xs font-mono mt-1">{book.serialNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                      {book.borrowedBy}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        if (!book.borrowDate) return <span className="text-slate-600 dark:text-slate-300">N/A</span>;
                        const borrowDate = new Date(book.borrowDate);
                        const dueDate = new Date(borrowDate.getTime() + 14 * 24 * 60 * 60 * 1000);
                        const isOverdue = new Date() > dueDate;
                        return (
                          <span className={isOverdue ? "text-red-600 dark:text-red-400 font-semibold" : "text-slate-600 dark:text-slate-300"}>
                            {dueDate.toLocaleDateString()}
                            {isOverdue && <span className="ml-2 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">Overdue</span>}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={RotateCcw}
                        onClick={() => handleReturnBook(book.id, book.title)}
                      >
                        Return Book
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Issue Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Issue Book</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Book</label>
                <select
                  required
                  value={issueData.bookId}
                  onChange={(e) => setIssueData({...issueData, bookId: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Choose an available book --</option>
                  {availableBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.serialNumber})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Borrower Name</label>
                <select
                  required
                  value={issueData.borrowerName}
                  onChange={(e) => setIssueData({...issueData, borrowerName: e.target.value})}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Choose a registered member --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" isLoading={issuing}>
                  Issue
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
