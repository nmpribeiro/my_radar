import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';
import { v4 as uuidv4 } from 'uuid';

import { HORIZONS_KEY } from '../../constants/RadarData';
import { RadarUtilities } from '../../radar/utilities/Utilities';
import { selectors } from '../../store/radar/radar.actions';
import { GlobalState } from '../../store/state';
import { Title } from '../shared/Title';

import './DataLists.scss';

type ListMatrixItem = { uuid: string; name: string };

const ItemList = Connect<GlobalState, { quadrant: ListMatrixItem; horizon: ListMatrixItem }>()
  .stateAndDispatch((state) => ({ blips: selectors(state).blips }), {})
  .withComp(({ quadrant, horizon, blips }) => (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        textAlign: 'left',
        fontSize: 14,
      }}
    >
      {blips.map((blip) => {
        if (blip.Quadrant === quadrant.name && blip[HORIZONS_KEY] === horizon.name)
          // TODO: fix this kex!
          return <li key={`${blip.Title}-${quadrant.uuid}-${horizon.uuid}`}>{blip.Title}</li>;
        return null;
      })}
    </ul>
  ));

export const DataLists = Connect<GlobalState, Record<string, unknown>>()
  .stateAndDispatch((state) => ({ blips: selectors(state).blips }), {})
  .withComp(({ blips }) => {
    const [headers, setHeaders] = useState<ListMatrixItem[]>([]);
    const [horizons, setHorizons] = useState<ListMatrixItem[]>([]);

    useEffect(() => {
      if (blips && blips.length > 0) {
        const newHeaders: ListMatrixItem[] = [];
        RadarUtilities.getQuadrants(blips).forEach((header) => {
          newHeaders.push({ uuid: uuidv4(), name: header });
        });
        setHeaders(newHeaders);

        const newHorizons: ListMatrixItem[] = [];
        RadarUtilities.getHorizons(blips).forEach((horizon) => {
          newHorizons.push({ uuid: uuidv4(), name: horizon });
        });
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

              <ItemList quadrant={header} horizon={horizons[0]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[1].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[1].name)} type="h5" />

              <ItemList quadrant={header} horizon={horizons[1]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[2].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[2].name)} type="h5" />

              <ItemList quadrant={header} horizon={horizons[2]} />
            </div>
          ))}
        </div>

        <div className="row">
          {headers.map((header) => (
            <div key={`${header.uuid}-${horizons[3].uuid}`} className="col">
              <Title label={RadarUtilities.capitalize(horizons[3].name)} type="h5" />

              <ItemList quadrant={header} horizon={horizons[3]} />
            </div>
          ))}
        </div>
      </section>
    );
  });
