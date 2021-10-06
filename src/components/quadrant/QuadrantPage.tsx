import React, { useEffect, useState } from 'react';
import { Connect } from 'redux-auto-actions';

import { GlobalState } from '../../store/state';
import { RadarSVG } from '../../radar/svg_comps/RadarSVG';
import { Layout } from '../../app/layout/Layout';
import { LeftColumn } from '../../app/layout/LeftColumn';
import { RightColumn } from '../../app/layout/RightColumn';
import { CenterColumn } from '../../app/layout/CenterColumn';
import { RadarUtilities } from '../../radar/utilities/Utilities';
import { actions, selectors } from '../../store/radar/radar.actions';
import { DISASTER_TYPE_KEY, USE_CASE_KEY } from '../../constants/RadarData';

import style from './QuadrantPage.module.scss';

export const QuadrantPage = Connect<GlobalState>()
  .stateAndDispatch(
    (state) => ({
      blips: selectors(state).blips,
      radarData: selectors(state).radarData,
      useCaseFilter: selectors(state).useCaseFilter,
      selectedQuadrant: selectors(state).selectedQuadrant,
      disasterTypeFilter: selectors(state).disasterTypeFilter,
    }),
    {
      setHoveredItem: actions.setHoveredItem,
      setSelectedItem: actions.setSelectedItem,
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(
    ({
      blips,
      radarData,
      useCaseFilter,
      selectedQuadrant,
      disasterTypeFilter,
      setSelectedItem,
      setHoveredItem,
      setSelectedQuadrant,
    }) => {
      const [filtered, setFiltered] = useState<BlipType[]>([]);
      useEffect(() => {
        // eslint-disable-next-line no-console
        console.log('selectedQuadrant: ', selectedQuadrant);
      }, [selectedQuadrant]);

      useEffect(() => {
        let newFiltered = blips;
        if (useCaseFilter !== 'all') newFiltered = newFiltered.filter((i) => i[USE_CASE_KEY] === useCaseFilter);
        if (disasterTypeFilter !== 'all') newFiltered = newFiltered.filter((i) => i[DISASTER_TYPE_KEY] === disasterTypeFilter);
        setFiltered(newFiltered);
      }, [blips]);

      return (
        <div className="App">
          {selectedQuadrant && (
            <Layout>
              <LeftColumn>
                <div style={{ position: 'absolute', top: 20, left: 0 }}>
                  <button type="button" onClick={() => setSelectedQuadrant(null)} className={style.button}>
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
                <RadarSVG
                  quadrant={selectedQuadrant}
                  context={{
                    blips: filtered,
                    radarData,
                    logic: {
                      setSelectedItem,
                      setHoveredItem,
                      setSelectedQuadrant,
                    },
                  }}
                />
                {/* <Radar />
            <TechOrBlipDescription /> */}
              </CenterColumn>

              <RightColumn>{/* <DataLists /> */}</RightColumn>
            </Layout>
          )}
        </div>
      );
    }
  );
