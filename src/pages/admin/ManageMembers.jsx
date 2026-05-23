import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(membersData);
    } catch (error) {
      toast.error('Failed to load members');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete member "${name}"?`)) {
      try {
        await deleteDoc(doc(db, 'members', id));
        setMembers(members.filter(member => member.id !== id));
        toast.success('Member deleted successfully');
      } catch (error) {
        toast.error('Failed to delete member');
      }
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link to="/admin/members/add" className="w-full sm:w-auto">
          <Button icon={Plus} className="w-full sm:w-auto">Add New Member</Button>
        </Link>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Age</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Address</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/25">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {member.age}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {member.contact}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      {member.address}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/members/edit/${member.id}`}>
                          <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(member.id, member.name)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

export default ManageMembers;
