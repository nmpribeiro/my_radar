import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

import { TechItemType } from '../../types';
import { RadarContext } from '../../RadarProvider';
import { RadarStateLabel } from '../../redux/radar/radar.state';

import styles from './TechDescription.module.scss';

export const TechOrBlipDescription: React.FC = () => {
  const {
    state: {
      [RadarStateLabel.STATE]: { radarData, techFilter },
    },
  } = React.useContext(RadarContext);

  const [selectedTech, setSelectedTech] = useState<TechItemType>();

  useEffect(() => {
    if (techFilter) {
      const newSelectedTech = radarData.tech.find((t) => techFilter === t.slug);
      if (newSelectedTech) {
        setSelectedTech(newSelectedTech);
      }
    }
  }, [radarData, techFilter]);

  return (
    <>
      {selectedTech && techFilter && (
        <div>
          <h1>{selectedTech.type}</h1>

          <div>
            {selectedTech.description.map((text) => (
              <div className={styles.paragraph} key={v4()}>
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
