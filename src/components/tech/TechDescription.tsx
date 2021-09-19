import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../../store/state';
import { selectors } from '../../store/radar/radar.actions';

import styles from './TechDescription.module.scss';

export const TechDescription = Connect<GlobalState>()
  .stateAndDispatch(
    (state) => ({
      radarData: selectors(state).radarData,
      techFilter: selectors(state).techFilter,
    }),
    {}
  )
  .withComp(({ radarData, techFilter }) => {
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
  });
