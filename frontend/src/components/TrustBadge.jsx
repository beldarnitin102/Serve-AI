import React from 'react';
import { Award, Shield, Zap, Star } from 'lucide-react';

const TrustBadge = ({ level = 'Bronze', size = 'md' }) => {
  const configs = {
    Platinum: {
      color: 'from-[#E5E4E2] to-[#B4B4B4]',
      text: 'text-slate-200',
      icon: <Zap className="text-blue-400" />,
      glow: 'shadow-[0_0_20px_rgba(229,228,226,0.3)]',
      border: 'border-[#E5E4E2]/30'
    },
    Gold: {
      color: 'from-yellow-400 via-amber-500 to-yellow-600',
      text: 'text-amber-100',
      icon: <Award className="text-yellow-200" />,
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
      border: 'border-yellow-500/30'
    },
    Silver: {
      color: 'from-slate-300 via-slate-400 to-slate-500',
      text: 'text-slate-100',
      icon: <Shield className="text-slate-200" />,
      glow: 'shadow-[0_0_10px_rgba(148,163,184,0.3)]',
      border: 'border-slate-400/30'
    },
    Bronze: {
      color: 'from-orange-700 via-orange-800 to-orange-900',
      text: 'text-orange-100',
      icon: <Star className="text-orange-300" />,
      glow: 'shadow-[0_0_10px_rgba(194,65,12,0.2)]',
      border: 'border-orange-800/30'
    }
  };

  const config = configs[level] || configs.Bronze;

  const sizeClasses = {
    sm: 'px-3 py-1 text-[10px] gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-3'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 24
  };

  return (
    <div className={`
      relative inline-flex items-center rounded-full font-bold uppercase tracking-wider
      bg-gradient-to-br ${config.color} ${config.glow} ${config.border} border
      transition-all duration-500 hover:scale-105 group
      ${sizeClasses[size]}
    `}>
      <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      {React.cloneElement(config.icon, { size: iconSizes[size] })}
      <span className={`${config.text} drop-shadow-sm`}>{level}</span>
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] animate-[shine_3s_infinite]" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
      `}} />
    </div>
  );
};

export default TrustBadge;
