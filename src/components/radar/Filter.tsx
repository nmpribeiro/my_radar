import React, { useState } from 'react';
// import { FaCog } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import AnimateHeight from 'react-animate-height';

import { RawFilter } from './RawFilter';
import styles from './Filter.module.scss';

export const Filter: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);

  const onFilterToggle = () => setCollapsed(!collapsed);

  return (
    <div className={styles.wrapper}>
      <div className={styles.button} onClick={onFilterToggle} onKeyUp={onFilterToggle} role="button" tabIndex={0}>
        <FiSettings size={30} color="white" />
        <div style={{ paddingLeft: 10, color: 'white' }}>Customize radar</div>
      </div>
      <div className={styles.filterBox}>
        <AnimateHeight height={collapsed ? 0 : 'auto'}>
          <RawFilter />
        </AnimateHeight>
      </div>
    </div>
  );
};
