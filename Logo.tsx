import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean; // Prop mantenida por compatibilidad
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8" }) => {
  return (
    <img 
      src="./auteco.png" 
      alt="Auteco Logo" 
      className={`${className} object-contain`}
    />
  );
};