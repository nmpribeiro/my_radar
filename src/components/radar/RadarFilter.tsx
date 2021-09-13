import React, { useContext, useEffect, useState } from 'react';

import { RadarContext } from '../../services/RadarContext';
import { RadarUtilities } from '../../radar/utilities/Utilities';

export const RadarFilter: React.FC = () => {
  const radarContext = useContext(RadarContext);
  const [disasterTypes] = useState<SelectableItem[]>([{ uuid: '1', name: "don't know where to get disaster types" }]);

  const [useCases, setUseCases] = useState<SelectableItem[]>([]);

  useEffect(() => {
    if (radarContext && radarContext.blips?.length > 0) {
      const newUseCases = RadarUtilities.getUseCases(radarContext.blips);
      setUseCases(newUseCases);
    }
  }, [radarContext]);

  // eslint-disable-next-line no-console
  const onFilterHnalder = () => console.log('will filter!');

  return (
    <div
      style={{
        margin: 10,
        marginTop: 30,
        borderStyle: 'solid',
        borderColor: 'black',
        borderWidth: 1,
        padding: 20,
        paddingTop: 20,
        borderRadius: 5,
        maxWidth: 300,
      }}
    >
      <div>Customize Radar</div>

      <div style={{ paddingTop: 20 }}>
        <select id="Select1">
          <option>Select a disaster type</option>
          {disasterTypes.map((item) => (
            <option key={item.uuid} value={item.uuid}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: 20 }}>
        <select id="Select2">
          <option>Select a Use Case</option>
          {useCases.map((item) => (
            <option key={item.uuid} value={item.uuid}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: 20 }}>
        <button
          type="button"
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderStyle: 'solid',
            padding: '10px 20px',
            backgroundColor: 'whitesmoke',
            cursor: 'pointer',
            borderRadius: 5,
          }}
          onClick={onFilterHnalder}
        >
          Filter
        </button>
      </div>
    </div>
  );
};
