import React, { useEffect, useState } from 'react';

import style from './TechItem.module.scss';

export const TechItem: React.FC<{
  tech: TechItemType;
  selected: boolean;
  setTechFilter: (techSlug: string | null) => void;
  setHoveredTech: (techSlug: string | null) => void;
  hoveredItem: BlipType | null;
}> = ({ tech, selected, setTechFilter, setHoveredTech, hoveredItem }) => {
  const selectTech = () => setTechFilter(tech.slug);

  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    setBackgroundColor(selected || hoveredItem?.Technology === tech.type ? tech.color : undefined);
  }, [tech, selected, hoveredItem]);

  const changeBackgroundEnter = () => {
    setHoveredTech(tech.slug);
    setBackgroundColor(selected ? tech.color : tech.color);
  };
  const changeBackgroundLeave = () => {
    setHoveredTech(null);
    setBackgroundColor(selected ? tech.color : undefined);
  };

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
      onMouseEnter={changeBackgroundEnter}
      onMouseLeave={changeBackgroundLeave}
      onFocus={changeBackgroundEnter}
      onBlur={changeBackgroundLeave}
    >
      <div style={{ backgroundColor: tech.color }} className={style.techItem} />
      <div style={{ paddingLeft: 20, width: '100%' }}>
        <div
          style={{
            backgroundColor: selected ? tech.color : backgroundColor,
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
