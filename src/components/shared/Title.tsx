import React from 'react';

export const Title: React.FC<{ label: string; type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' }> = ({ label, type = 'h3' }) => {
  switch (type) {
    case 'h1':
      return <h1>{label}</h1>;
    case 'h2':
      return <h2>{label}</h2>;
    case 'h3':
      return <h3>{label}</h3>;
    case 'h4':
      return <h4>{label}</h4>;
    case 'h5':
      return <h5>{label}</h5>;
    default:
      return <p>{label}</p>;
  }
};
