import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const Favorites = () => {
  const favorites = [
    { id: 1, name: 'Trusted Plumber - Aryan Services', rating: 4.9, trustBadge: 'Gold' },
    { id: 2, name: 'Smart Home Electricians', rating: 4.8, trustBadge: 'Platinum' },
    { id: 3, name: 'CleanSafe Maid Service', rating: 4.7, trustBadge: 'Silver' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Saved Favorites</h1>
        <p className="text-slate-300">Quickly rebook workers you already trust for home, office, or emergency services.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {favorites.map((worker) => (
          <Card key={worker.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{worker.name}</h3>
                <p className="text-slate-400 text-sm">Trust badge: {worker.trustBadge}</p>
              </div>
              <div className="text-lg font-bold text-blue-400">{worker.rating}</div>
            </div>
            <Button variant="secondary">Book Again</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
