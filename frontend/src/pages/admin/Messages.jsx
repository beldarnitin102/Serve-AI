import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { MessageSquare, Search, ArrowRight } from 'lucide-react';

const Messages = () => {
  const threads = [
    { id: 1, name: 'Support Team', preview: 'Your policy has been updated.', time: '5m ago' },
    { id: 2, name: 'Worker Verification', preview: 'A new worker requested approval.', time: '1h ago' },
    { id: 3, name: 'Booking Alert', preview: 'A high-priority emergency job was submitted.', time: 'Yesterday' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Messages</h1>
        <p className="text-slate-300">Coordinate with support, workers, and system alerts from one inbox.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full md:max-w-md">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search messages..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button>New Thread</Button>
        </div>

        <div className="space-y-4">
          {threads.map((thread) => (
            <div key={thread.id} className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{thread.name}</h3>
                <p className="text-slate-400 text-sm">{thread.preview}</p>
              </div>
              <div className="text-slate-500 text-right text-sm">
                <p>{thread.time}</p>
                <Button variant="secondary" size="sm">
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Messages;
