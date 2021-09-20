import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { Utilities } from '../../helpers/Utilities';
import { actions, selectors } from '../../store/radar/radar.actions';
import { RadarUtilities } from '../../radar/utilities/Utilities';
import { HORIZONS_KEY, QUADRANT_KEY, TECH_KEY } from '../../constants/RadarData';

import './DataLists.scss';
import styles from './BlipItemList.module.scss';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  quadrant: ListMatrixItem;
  horizon: ListMatrixItem;
  blips: BlipType[];
  setSelectedItem: (item: BlipType) => void;
}

const ItemList: React.FC<Props> = ({ quadrant, horizon, blips, setSelectedItem }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', fontSize: 14 }}>
    {blips.map((blip) => {
      if (blip.Quadrant === quadrant.name && blip[HORIZONS_KEY] === horizon.name)
        return (
          <li key={`${blip.Title}-${quadrant.uuid}-${horizon.uuid}`} className={styles.blipItemWrapper}>
            <button className={styles.blipItem} onClick={() => setSelectedItem(blip)} type="button">
              {blip.Title}
            </button>
          </li>
        );
      return null;
    })}
  </ul>
);

export const DataLists = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      useCaseFilter: selectors(state).useCaseFilter,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
      techFilter: selectors(state).techFilter,
    }),
    {
      setSelectedItem: actions.setSelectedItem,
    }
  )
  .withComp(({ blips, useCaseFilter, disasterTypeFilter, techFilter, setSelectedItem }) => {
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
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 14, textAlign: 'left' }}>
                    {blips
                      .filter((b) => Utilities.createSlug(b[TECH_KEY]) === techFilter && b[QUADRANT_KEY] === header.name)
                      .map((blip) => (
                        <li key={`${blip.Title}-${header.uuid}`} className={styles.blipItemWrapper}>
                          <button className={styles.blipItem} onClick={() => setSelectedItem(blip)} type="button">
                            {blip.Title}
                          </button>
                        </li>
                      ))}
                  </ul>
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

                  <ItemList setSelectedItem={setSelectedItem} blips={myBlips} quadrant={header} horizon={horizons[0]} />
                </div>
              ))}
            </div>

            <div className="row">
              {headers.map((header) => (
                <div key={`${header.uuid}-${horizons[1].uuid}`} className="col">
                  <Title label={RadarUtilities.capitalize(horizons[1].name)} type="h5" />

                  <ItemList setSelectedItem={setSelectedItem} blips={myBlips} quadrant={header} horizon={horizons[1]} />
                </div>
              ))}
            </div>

            <div className="row">
              {headers.map((header) => (
                <div key={`${header.uuid}-${horizons[2].uuid}`} className="col">
                  <Title label={RadarUtilities.capitalize(horizons[2].name)} type="h5" />

                  <ItemList setSelectedItem={setSelectedItem} blips={myBlips} quadrant={header} horizon={horizons[2]} />
                </div>
              ))}
            </div>

            <div className="row">
              {headers.map((header) => (
                <div key={`${header.uuid}-${horizons[3].uuid}`} className="col">
                  <Title label={RadarUtilities.capitalize(horizons[3].name)} type="h5" />

                  <ItemList setSelectedItem={setSelectedItem} blips={myBlips} quadrant={header} horizon={horizons[3]} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    );
  });
