import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { Utilities } from '../../helpers/Utilities';
import { ScrollableDiv } from '../shared/ScrollableDiv';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';
import { actions, selectors } from '../../store/radar/radar.actions';
import { HORIZONS_KEY, QUADRANT_KEY, TECH_KEY, TITLE_KEY } from '../../constants/RadarData';

import './DataLists.scss';
import styles from './BlipItemList.module.scss';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  radarData: RadarOptionsType;
  quadrant: ListMatrixItem;
  horizon?: ListMatrixItem | null;
  blips: BlipType[];
  hoveredItem: BlipType | null;
  hoveredTech: string | null;
  setHoveredItem: (payload: BlipType | null) => void;
  setSelectedItem: (item: BlipType) => void;
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
}) => (
  <ScrollableDiv maxHeight={200}>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', fontSize: 14 }}>
      {blips.map((blip) => {
        const onMouseEnter = () => setHoveredItem(blip);
        const onMouseLeave = () => setHoveredItem(null);
        const getHoveredStyle = () => {
          const tech = radarData.tech.find((t) => t.type === blip[TECH_KEY]);
          if (hoveredItem?.id === blip.id) {
            if (hoveredTech === null || hoveredTech === tech?.slug) return styles.blipItemHovered;
          }
          return '';
        };
        if (blip[QUADRANT_KEY] === quadrant.name && (horizon === null || blip[HORIZONS_KEY] === horizon.name))
          return (
            <li key={`${blip.id}-${quadrant.uuid}-${horizon && horizon.uuid}`} className={styles.blipItemWrapper}>
              <button
                className={`${styles.blipItem} ${getHoveredStyle()}`}
                onClick={() => setSelectedItem(blip)}
                type="button"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                {blip[TITLE_KEY]}
              </button>
            </li>
          );
        return null;
      })}
    </ul>
  </ScrollableDiv>
);

export const DataLists = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      techFilter: selectors(state).techFilter,
      hoveredItem: selectors(state).hoveredItem,
      hoveredTech: selectors(state).hoveredTech,
    }),
    {
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
    }
  )
  .withComp(
    ({
      blips,
      radarData,
      useCaseFilter,
      disasterTypeFilter,
      techFilter,
      hoveredItem,
      hoveredTech,
      setHoveredItem,
      setSelectedItem,
    }) => {
      const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
      const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

      const [myBlips, setMyBlips] = useState<BlipType[]>([]);

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

      const setSelectedItemLogic = (item: BlipType) => {
        setSelectedItem(item);
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
                      blips={myBlips.filter((b) => Utilities.checkItemHasTech(b, techFilter) && b[QUADRANT_KEY] === header.name)}
                      quadrant={header}
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
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      );
    }
  );
