import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Save, ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: '',
    subCategory: '',
    language: '',
    quantity: 1,
    imageURL: '',
    serialNumber: ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchBook();
    } else {
      // Auto-generate serial number for new book
      const autoSn = 'SN-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      setFormData(prev => ({ ...prev, serialNumber: autoSn }));
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const docRef = doc(db, 'books', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        toast.error('Book not found');
        navigate('/admin/books');
      }
    } catch (error) {
      toast.error('Error fetching book details');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = { 
        ...prev, 
        [name]: name === 'quantity' ? parseInt(value) || 0 : value 
      };
      
      if (name === 'category' && !isEditing) {
        const catCode = value.substring(0, 3);
        const currentSn = prev.serialNumber;
        if (currentSn && currentSn.length >= 4) {
          const prefix = currentSn.substring(0, currentSn.length - 4);
          updatedData.serialNumber = prefix + '0' + catCode;
        }
      }
      
      return updatedData;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `book-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, imageURL: downloadURL }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookData = {
        ...formData,
        available: formData.quantity > 0, // simple logic, if we have quantity it's available
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'books', id), bookData);
        toast.success('Book updated successfully');
      } else {
        bookData.createdAt = new Date().toISOString();
        bookData.borrowedBy = null;
        bookData.borrowDate = null;
        await addDoc(collection(db, 'books'), bookData);
        toast.success('Book added successfully');
      }
      navigate('/admin/books');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update book' : 'Failed to add book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center animate-pulse">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/books')}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Book' : 'Add New Book'}
        </h2>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Serial Number"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              placeholder="e.g. SN-123456"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>-- Select a category --</option>
                <option value="000 - Computer Science, Information & General Works">000 - Computer Science, Information & General Works</option>
                <option value="100 - Philosophy & Psychology">100 - Philosophy & Psychology</option>
                <option value="200 - Religion">200 - Religion</option>
                <option value="300 - Social Sciences">300 - Social Sciences</option>
                <option value="400 - Language">400 - Language</option>
                <option value="500 - Science">500 - Science</option>
                <option value="600 - Technology">600 - Technology</option>
                <option value="700 - Arts & Recreation">700 - Arts & Recreation</option>
                <option value="800 - Literature">800 - Literature</option>
                <option value="900 - History & Geography">900 - History & Geography</option>
              </select>
            </div>
            <Input
              label="Sub Category"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="e.g. Fiction, History, etc."
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="" disabled>-- Select language --</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Input
                label="Book Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
              />
            </div>
            <Input
              label="Author Name"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
            <Input
              label="Publisher Name"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
              placeholder="Enter publisher name"
            />
            <Input
              label="Quantity"
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Book Image</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 w-full">
                  <Input
                    name="imageURL"
                    type="url"
                    value={formData.imageURL}
                    onChange={handleChange}
                    placeholder="Enter image URL or upload file"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-slate-500 font-medium">OR</span>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      disabled={uploadingImage}
                    />
                    <Button type="button" variant="secondary" icon={uploadingImage ? Loader2 : Upload} className={uploadingImage ? "opacity-75" : ""}>
                      {uploadingImage ? "Uploading..." : "Upload File"}
                    </Button>
                  </div>
                </div>
              </div>
              
              {formData.imageURL && (
                <div className="mt-3 relative w-32 h-40 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={formData.imageURL} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/books')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={loading}
              icon={Save}
            >
              {isEditing ? 'Save Changes' : 'Add Book'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEditBook;
