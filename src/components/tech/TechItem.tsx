import React from 'react';
import { useHistory } from 'react-router-dom';

export const TechItem: React.FC<{ tech: TechItemType; selected: boolean }> = ({ tech, selected }) => {
  const history = useHistory();

  const selectTech = () => history.push(`/technologies/${tech.slug}`);

  return (
    <button
      style={{
        border: 'none',
        background: 'none',
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        paddingLeft: 10,
        cursor: 'pointer',
        width: '100%',
      }}
      type="button"
      onClick={selectTech}
    >
      <div style={{ backgroundColor: tech.color, height: 20, width: 25, borderRadius: 20 }} />
      <div style={{ paddingLeft: 20, width: '100%' }}>
        <div
          style={{
            backgroundColor: selected ? tech.color : undefined,
            color: selected ? 'white' : undefined,
            padding: 10,
            border: 1,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: 5,
            fontSize: 14,
          }}
        >
          {tech.type}
        </div>
      </div>
    </button>
  );
};
