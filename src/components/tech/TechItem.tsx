import React from 'react';

export const TechItem: React.FC<{ tech: TechItemType }> = ({ tech }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 5, paddingLeft: 10 }}>
      <div style={{ backgroundColor: tech.color, height: 18, width: 18, borderRadius: 10 }} />
      <div style={{ paddingLeft: 20 }}>
        <div style={{ padding: 10, border: 1, borderColor: 'black', borderStyle: 'solid', borderRadius: 5 }}>{tech.type}</div>
      </div>
    </div>
  );
};
