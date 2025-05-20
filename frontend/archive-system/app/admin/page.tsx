'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/admin/users/${userId}/role`, { role: 'admin' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User promoted to admin');
      fetchUsers(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error('Failed to promote user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading admin dashboard...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">🔐 Admin Dashboard</h1>

      <h2 className="text-lg font-semibold mb-2">👥 Users</h2>
      <table className="w-full text-sm border mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => promoteToAdmin(user._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Promote to Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
