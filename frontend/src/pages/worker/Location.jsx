import React from 'react';
import Card from '../../components/Card';
import { MapPin, Globe, Compass } from 'lucide-react';

const Location = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Location</h1>
        <p className="text-slate-300">Help customers find you and keep your route optimized when you accept new jobs.</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <MapPin size={22} className="text-blue-400" />
              <h2 className="text-xl font-semibold">Current service area</h2>
            </div>
            <p className="text-slate-400">Your accepted job area is set to downtown and surrounding neighborhoods. Update this if you want to expand coverage.</p>
          </div>

          <div className="h-80 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
            Map placeholder
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Globe size={20} className="text-green-400" />
                <h3 className="font-semibold">Service radius</h3>
              </div>
              <p className="text-slate-400">You currently serve customers within a 12 km radius. Increase your reach to get more job offers.</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Compass size={20} className="text-yellow-400" />
                <h3 className="font-semibold">Preferred routes</h3>
              </div>
              <p className="text-slate-400">Set roads to avoid traffic and preserve your travel time using AI-powered routing.</p>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Location;
