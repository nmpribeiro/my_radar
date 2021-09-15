import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';
import { v4 as uuidv4 } from 'uuid';

import { Title } from '../shared/Title';
import { GlobalState } from '../../store/state';
import { HORIZONS_KEY } from '../../constants/RadarData';
import { selectors } from '../../store/radar/radar.actions';
import { RadarUtilities } from '../../radar/utilities/Utilities';

import './DataLists.scss';

type ListMatrixItem = { uuid: string; name: string };

interface Props {
  quadrant: ListMatrixItem;
  horizon: ListMatrixItem;
  blips: BlipType[];
}

const ItemList: React.FC<Props> = ({ quadrant, horizon, blips }) => (
  <ul style={{ listStyle: 'none', margin: 0, padding: 0, textAlign: 'left', fontSize: 14 }}>
    {blips.map((blip) => {
      if (blip.Quadrant === quadrant.name && blip[HORIZONS_KEY] === horizon.name)
        return <li key={`${blip.Title}-${quadrant.uuid}-${horizon.uuid}`}>{blip.Title}</li>;
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
    }),
    {}
  )
  .withComp(({ blips, useCaseFilter, disasterTypeFilter }) => {
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

              <ItemList blips={myBlips} quadrant={header} horizon={horizons[0]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[1].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[1].name)} type="h5" />

              <ItemList blips={myBlips} quadrant={header} horizon={horizons[1]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[2].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[2].name)} type="h5" />

              <ItemList blips={myBlips} quadrant={header} horizon={horizons[2]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[3].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[3].name)} type="h5" />

              <ItemList blips={myBlips} quadrant={header} horizon={horizons[3]} />
            </div>
          ))}
        </div>
      </section>
    );
  });