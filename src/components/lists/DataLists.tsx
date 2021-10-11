import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { RadarContext } from '../../RadarProvider';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { actions } from '../../redux/radar/radar.actions';
import { DataStateLabel } from '../../redux/data/data.state';
import { RadarStateLabel } from '../../redux/radar/radar.state';
import { BlipWithQuadrantKey, RadarOptionsType } from '../../types';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';

import './DataLists.scss';
import styles from './BlipItemList.module.scss';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  radarData: RadarOptionsType;
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipWithQuadrantKey[];
  hoveredItem: BlipWithQuadrantKey | null;
  hoveredTech: string | null;
  keys: { techKey: string; horizonKey: string; quadrantKey: string; titleKey: string };
  setHoveredItem: (payload: BlipWithQuadrantKey | null) => void;
  setSelectedItem: (item: BlipWithQuadrantKey) => void;
}

const ItemList: React.FC<Props> = ({
  radarData,
  quadrant,
  horizon = null,
  blips,
  hoveredItem,
  hoveredTech,
  setHoveredItem,
  setSelectedItem,
  keys: { techKey, titleKey, horizonKey, quadrantKey },
}) => (
  <ScrollableDiv maxHeight={200}>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', fontSize: 14 }}>
      {blips.map((blip) => {
        const onMouseEnter = () => setHoveredItem(blip);
        const onMouseLeave = () => setHoveredItem(null);
        const getHoveredStyle = () => {
          const tech = radarData.tech.find((t) => t.type === blip[techKey]);
          if (hoveredItem?.id === blip.id) {
            if (hoveredTech === null || hoveredTech === tech?.slug) return styles.blipItemHovered;
          }
          return '';
        };
        if (blip[quadrantKey] === quadrant.name && (horizon === null || blip[horizonKey] === horizon.name))
          return (
            <li key={`${blip.id}-${quadrant.uuid}-${horizon && horizon.uuid}`} className={styles.blipItemWrapper}>
              <button
                className={`${styles.blipItem} ${getHoveredStyle()}`}
                onClick={() => setSelectedItem(blip)}
                type="button"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {blip[titleKey]}
              </button>
            </li>
          );
        return null;
      })}
    </ul>
  </ScrollableDiv>
);

export const DataLists: React.FC = () => {
  const {
    state: {
      [DataStateLabel.STATE]: keys,
      [RadarStateLabel.STATE]: {
        //
        radarData,
        techFilter,
        blips,
        useCaseFilter,
        disasterTypeFilter,
        hoveredItem,
        hoveredTech,
      },
    },
    dispatch,
  } = React.useContext(RadarContext);

  const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
  const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

  const [myBlips, setMyBlips] = useState<BlipWithQuadrantKey[]>([]);

  useEffect(() => {
    setMyBlips(RadarUtilities.filterBlips(blips, useCaseFilter, disasterTypeFilter));
  }, [blips, useCaseFilter, disasterTypeFilter]);

  useEffect(() => {
    if (blips && blips.length > 0) {
      const newHeaders: ListMatrixItem[] = [];
      RadarUtilities.getQuadrants(blips).forEach((header) => newHeaders.push({ uuid: uuidv4(), name: header }));
      const newHorizons: ListMatrixItem[] = [];
      RadarUtilities.getHorizons(blips).forEach((horizon) => newHorizons.push({ uuid: uuidv4(), name: horizon }));
      setHeaders(newHeaders);
      setHorizons(newHorizons);
    }
  }, [blips]);

  const setHoveredItem = (newHoveredItem: BlipWithQuadrantKey | null) => dispatch(actions.setHoveredItem(newHoveredItem));

  const setSelectedItemLogic = (item: BlipWithQuadrantKey) => {
    dispatch(actions.setSelectedItem(item));
    setHoveredItem(null);
  };

  return (
    <section>
      {techFilter && (
        <>
          <header
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {headers.map((header) => (
              <div
                key={header.uuid}
                className="column"
                style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column', maxWidth: 200 }}
              >
                <Title label={RadarUtilities.capitalize(header.name)} type="h4" />
                <ItemList
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips.filter(
                    (b) => RadarUtilities.checkItemHasTech(b, techFilter, keys.techKey) && b[keys.quadrantKey] === header.name
                  )}
                  quadrant={header}
                  keys={keys}
                />
              </div>
            ))}
          </header>
        </>
      )}
      {techFilter === null && (
        <>
          <header>
            {headers.map((header) => (
              <div key={header.uuid} className="col">
                <Title label={RadarUtilities.capitalize(header.name)} type="h4" />
              </div>
            ))}
          </header>
          <div className="row">
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[0].uuid}`} className="col">
                <Title label={RadarUtilities.capitalize(horizons[0].name)} type="h5" />

                <ItemList
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[0]}
                  keys={keys}
                />
              </div>
            ))}
          </div>

          <div className="row">
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[1].uuid}`} className="col">
                <Title label={RadarUtilities.capitalize(horizons[1].name)} type="h5" />

                <ItemList
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[1]}
                  keys={keys}
                />
              </div>
            ))}
          </div>

          <div className="row">
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[2].uuid}`} className="col">
                <Title label={RadarUtilities.capitalize(horizons[2].name)} type="h5" />

                <ItemList
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[2]}
                  keys={keys}
                />
              </div>
            ))}
          </div>

          <div className="row">
            {headers.map((header) => (
              <div key={`${header.uuid}-${horizons[3].uuid}`} className="col">
                <Title label={RadarUtilities.capitalize(horizons[3].name)} type="h5" />

                <ItemList
                  radarData={radarData}
                  hoveredTech={hoveredTech}
                  setHoveredItem={setHoveredItem}
                  hoveredItem={hoveredItem}
                  setSelectedItem={setSelectedItemLogic}
                  blips={myBlips}
                  quadrant={header}
                  horizon={horizons[3]}
                  keys={keys}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
