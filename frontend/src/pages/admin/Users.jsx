import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, User, ShieldCheck, XCircle } from 'lucide-react';

const AdminUsers = () => {
  const [search, setSearch] = useState('');

  const users = [
    { id: 1, name: 'Alicia Keys', email: 'alicia@servai.com', role: 'user', status: 'active' },
    { id: 2, name: 'David Chen', email: 'david@servai.com', role: 'worker', status: 'pending' },
    { id: 3, name: 'Rina Patel', email: 'rina@servai.com', role: 'user', status: 'active' },
    { id: 4, name: 'Samuel King', email: 'samuel@servai.com', role: 'worker', status: 'verified' }
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-slate-300">Review accounts, verify workers, and manage platform membership.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full lg:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, emails, or roles..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button>Invite User</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border border-white/10 rounded-3xl bg-slate-900/80">
                  <td className="px-4 py-4">{user.name}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4 capitalize">{user.role}</td>
                  <td className="px-4 py-4 capitalize">{user.status}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm">View</Button>
                      <Button variant="danger" size="sm">Disable</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;
