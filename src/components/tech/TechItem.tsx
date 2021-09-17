import React from 'react';

export const TechItem: React.FC<{ tech: TechItemType; selected: boolean; setTechFilter: (techSlug: string | null) => void }> = ({
  tech,
  selected,
  setTechFilter,
}) => {
  const selectTech = () => setTechFilter(tech.slug);

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
