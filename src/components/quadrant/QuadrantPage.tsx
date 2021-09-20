import React, { useEffect } from 'react';
import { Connect } from 'redux-auto-actions';

import { Layout } from '../../app/layout/Layout';
import { GlobalState } from '../../store/state';
import { LeftColumn } from '../../app/layout/LeftColumn';
import { RightColumn } from '../../app/layout/RightColumn';
import { actions, selectors } from '../../store/radar/radar.actions';
import { CenterColumn } from '../../app/layout/CenterColumn';
import { RadarUtilities } from '../../radar/utilities/Utilities';

import style from './QuadrantPage.module.scss';

export const QuadrantPage = Connect<GlobalState>()
  .stateAndDispatch(
    (state) => ({
      // selectedItem: selectors(state).selectedItem,
      selectedQuadrant: selectors(state).selectedQuadrant,
    }),
    {
      setSelectedQuadrant: actions.setSelectedQuadrant,
    }
  )
  .withComp(({ selectedQuadrant, setSelectedQuadrant }) => {
    useEffect(() => {
      // eslint-disable-next-line no-console
      console.log('selectedQuadrant: ', selectedQuadrant);
    }, [selectedQuadrant]);

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
              <h1>{RadarUtilities.capitalize(selectedQuadrant)}</h1>
              <p>Todo: insert quarter radar (this quadrant)</p>
              {/* <Radar />
            <TechOrBlipDescription /> */}
            </CenterColumn>

            <RightColumn>{/* <DataLists /> */}</RightColumn>
          </Layout>
        )}
      </div>
    );
  });
