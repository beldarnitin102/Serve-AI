import React from 'react';

const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  ...props
}) => {
  const baseClasses = 'bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl';

  const hoverClasses = hover ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/10' : '';

  const glowClasses = glow ? 'shadow-blue-500/20 hover:shadow-blue-500/40' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;