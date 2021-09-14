import React, { ChangeEventHandler, useContext, useEffect, useState } from 'react';

import { RadarContext } from '../../services/RadarContext';
import { RadarUtilities } from '../../radar/utilities/Utilities';

export const RadarFilter: React.FC = () => {
  const radarContext = useContext(RadarContext);

  const [disasterTypes, setDisasterTypes] = useState<SelectableItem[]>([]);
  const [useCases, setUseCases] = useState<SelectableItem[]>([]);

  useEffect(() => {
    if (radarContext && radarContext.blips?.length > 0) {
      const newUseCases = RadarUtilities.getUseCases(radarContext.blips);
      setUseCases(newUseCases);

      const newDisasterTyes = RadarUtilities.getDisasterTypes(radarContext.blips);
      setDisasterTypes(newDisasterTyes);
    }
  }, [radarContext]);

  const [selectedDisasterType, setSelectedDisasterType] = useState<string>(
    radarContext.filterDisasterType === null ? 'all' : radarContext.filterDisasterType
  );
  const [selectedUserCase, setSelectedUserCase] = useState<string>(
    radarContext.filterUseCase === null ? 'all' : radarContext.filterUseCase
  );
  const onDisasterTypeChange: ChangeEventHandler<HTMLSelectElement> = (e) => setSelectedDisasterType(e.target.value);
  const onUseCaseChange: ChangeEventHandler<HTMLSelectElement> = (e) => setSelectedUserCase(e.target.value);

  const onFilterHnalder = () => {
    // selected?
    radarContext.setFilteredBlips(
      selectedDisasterType === 'all' ? null : selectedDisasterType,
      selectedUserCase === 'all' ? null : selectedUserCase
    );
  };

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
        <select id="Select1" style={{ width: '100%' }} onChange={onDisasterTypeChange} value={selectedDisasterType}>
          <option value="all">Show all disaster types</option>
          {disasterTypes.map((item) => (
            <option key={item.uuid} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ paddingTop: 20 }}>
        <select id="Select2" style={{ width: '100%' }} onChange={onUseCaseChange} value={selectedUserCase}>
          <option value="all">Show all Use Cases</option>
          {useCases.map((item) => (
            <option key={item.uuid} value={item.name}>
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
