import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MessageSquare, Search } from 'lucide-react';

const Messages = () => {
  const conversations = [
    { id: 1, title: 'John Smith', lastMessage: 'Can you start at 4 PM?', time: '2m ago', status: 'active' },
    { id: 2, title: 'Support Team', lastMessage: 'Your booking is confirmed.', time: '1h ago', status: 'active' },
    { id: 3, title: 'Mike Johnson', lastMessage: 'I have arrived at the location.', time: 'Yesterday', status: 'archived' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-slate-300">Communicate directly with workers and support staff from your dashboard.</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search conversations..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="secondary">New Message</Button>
        </div>

        <div className="space-y-3">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{conversation.title}</h3>
                <p className="text-slate-400 text-sm">{conversation.lastMessage}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-xs">{conversation.time}</p>
                <p className="text-sm text-green-400 capitalize">{conversation.status}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Messages;
