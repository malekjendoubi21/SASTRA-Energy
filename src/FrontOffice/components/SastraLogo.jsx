import React from 'react';

const SastraLogo = ({ size = 40, className = "" }) => {
  return (
    <div className={`sastra-logo ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Hexagones dorés */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '2px', marginBottom: '-5px' }}>
          <div style={{
            width: size * 0.8,
            height: size * 0.35,
            background: 'linear-gradient(135deg, #ffd700, #ffb700)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
          }}></div>
          <div style={{
            width: size * 0.4,
            height: size * 0.35,
            background: 'linear-gradient(135deg, #ffd700, #ffb700)',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
          }}></div>
        </div>
        <div style={{
          width: size * 0.4,
          height: size * 0.35,
          background: 'linear-gradient(135deg, #ffd700, #ffb700)',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
        }}></div>
      </div>
      
      {/* Texte du logo */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontSize: size * 0.7,
          fontWeight: 700,
          color: '#1e3a5f',
          lineHeight: 1,
          fontFamily: 'Segoe UI, sans-serif'
        }}>
          sastra
        </span>
        <span style={{
          fontSize: size * 0.3,
          color: '#6c757d',
          fontWeight: 400,
          lineHeight: 1,
          marginTop: '-2px'
        }}>
          SOLAR Energy
        </span>
      </div>
    </div>
  );
};

export default SastraLogo;
