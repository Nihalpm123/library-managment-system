import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const AddEditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contact: '',
    address: ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      const docRef = doc(db, 'members', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        toast.error('Member not found');
        navigate('/admin/members');
      }
    } catch (error) {
      toast.error('Error fetching member details');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const memberData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'members', id), memberData);
        toast.success('Member updated successfully');
      } else {
        memberData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'members'), memberData);
        toast.success('Member added successfully');
      }
      navigate('/admin/members');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update member' : 'Failed to add member');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center animate-pulse">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/members')}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Member' : 'Add New Member'}
        </h2>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter member's full name"
              />
            </div>
            <Input
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter age"
            />
            <Input
              label="Contact Info"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Phone or email"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter full address"
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/members')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={loading}
              icon={Save}
            >
              {isEditing ? 'Save Changes' : 'Add Member'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEditMember;
