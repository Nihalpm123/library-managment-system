import { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Loader2, FileText, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const Reports = () => {
  const [loadingInv, setLoadingInv] = useState(false);
  const [loadingBor, setLoadingBor] = useState(false);

  const generateInventoryReport = async () => {
    setLoadingInv(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const books = querySnapshot.docs.map(doc => doc.data());
      
      const doc = new jsPDF();
      doc.text("Library Inventory Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      
      const tableColumn = ["S.N.", "Title", "Author", "Category", "Qty", "Status"];
      const tableRows = [];

      books.forEach(book => {
        const bookData = [
          book.serialNumber,
          book.title,
          book.author,
          book.category,
          book.quantity.toString(),
          book.available ? 'Available' : 'Borrowed'
        ];
        tableRows.push(bookData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
      });

      doc.save("library_inventory.pdf");
      toast.success("Inventory report downloaded");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoadingInv(false);
    }
  };

  const generateBorrowedReport = async () => {
    setLoadingBor(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const books = querySnapshot.docs.map(doc => doc.data()).filter(b => !b.available);
      
      const doc = new jsPDF();
      doc.text("Borrowed Books Report", 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
      
      const tableColumn = ["S.N.", "Title", "Borrower Name", "Borrow Date"];
      const tableRows = [];

      books.forEach(book => {
        const bookData = [
          book.serialNumber,
          book.title,
          book.borrowedBy || 'N/A',
          book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'N/A'
        ];
        tableRows.push(bookData);
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
      });

      doc.save("borrowed_books_report.pdf");
      toast.success("Borrowed books report downloaded");
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoadingBor(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Reports & Export</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Inventory Report</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Download a complete list of all books in the library system, including their current availability status.
          </p>
          <Button 
            className="w-full mt-auto" 
            icon={Download} 
            onClick={generateInventoryReport}
            isLoading={loadingInv}
          >
            Download PDF
          </Button>
        </Card>

        <Card className="p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-6">
            <Users className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Borrowed Books</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Generate a report of all currently borrowed books, including borrower names and issue dates.
          </p>
          <Button 
            className="w-full mt-auto" 
            icon={Download} 
            variant="secondary"
            onClick={generateBorrowedReport}
            isLoading={loadingBor}
          >
            Download PDF
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
