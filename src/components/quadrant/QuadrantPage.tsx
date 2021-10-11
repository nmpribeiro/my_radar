import React, { useEffect, useState } from 'react';

import { Layout } from '../../layout/Layout';
import { BlipWithQuadrantKey } from '../../types';
import { RadarContext } from '../../RadarProvider';
import { LeftColumn } from '../../layout/LeftColumn';
import { RightColumn } from '../../layout/RightColumn';
import { CenterColumn } from '../../layout/CenterColumn';
import { RadarSVG } from '../../radar/svg_comps/RadarSVG';
import { actions } from '../../redux/radar/radar.actions';
import { RadarStateLabel } from '../../redux/radar/radar.state';
import { RadarUtilities } from '../../radar/utilities/RadarUtilities';
import { DISASTER_TYPE_KEY, USE_CASE_KEY } from '../../constants/RadarConstants';

import style from './QuadrantPage.module.scss';

export const QuadrantPage: React.FC = () => {
  const {
    state: {
      [RadarStateLabel.STATE]: { radarData, useCaseFilter, disasterTypeFilter, blips, selectedQuadrant },
    },
    dispatch,
  } = React.useContext(RadarContext);

  const [filtered, setFiltered] = useState<BlipWithQuadrantKey[]>([]);

  useEffect(() => {
    let newFiltered = blips;
    if (useCaseFilter !== 'all') newFiltered = newFiltered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
    if (disasterTypeFilter !== 'all') newFiltered = newFiltered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);
    setFiltered(newFiltered);
  }, [blips]);

  const logic = {
    setSelectedItem: (blip: BlipWithQuadrantKey | null) => dispatch(actions.setSelectedItem(blip)),
    setHoveredItem: (blip: BlipWithQuadrantKey | null) => dispatch(actions.setHoveredItem(blip)),
    setSelectedQuadrant: (quadrant: string | null) => dispatch(actions.setSelectedQuadrant(quadrant)),
  };

  return (
    <div className="App">
      {selectedQuadrant && (
        <Layout>
          <LeftColumn>
            <div style={{ position: 'absolute', top: 20, left: 0 }}>
              <button type="button" onClick={() => dispatch(actions.setSelectedQuadrant(null))} className={style.button}>
                <span style={{ fontSize: 30 }}>&#10094;</span>
              </button>
            </div>
            {/* <Switch>
          <Route exact path="/" component={TechList} />
        </Switch>

        <Switch>
          <Route exact path="/" component={Filter} />
        </Switch> */}
            <p>Todo: put list of items based on level of implementation</p>
          </LeftColumn>

          <CenterColumn>
            <h3>{RadarUtilities.capitalize(selectedQuadrant)}</h3>
            <RadarSVG quadrant={selectedQuadrant} context={{ blips: filtered, radarData, logic }} />
            {/* <Radar />
        <TechOrBlipDescription /> */}
          </CenterColumn>

          <RightColumn>{/* <DataLists /> */}</RightColumn>
        </Layout>
      )}
    </div>
  );
};
