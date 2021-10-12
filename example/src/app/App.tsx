import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import { Radar, TechList, Filter } from 'undp-radar';

// // import { Radar } from '../../../src/radar/Radar';
// import { Filter } from '../../../src/components/radar/Filter';
// import { TechList } from '../../../src/components/tech/TechList';
// import { BlipPage } from '../../../src/components/blip/BlipPage';
// // import { selectors } from '../store/radar/radar.actions';
// import { DataLists } from '../../../src/components/lists/DataLists';
// import { QuadrantPage } from '../../../src/components/quadrant/QuadrantPage';
// import { TechOrBlipDescription } from '../../../src/components/tech/TechDescription';

import './App.scss';
import { Layout } from './layout/Layout';
import { LeftColumn } from './layout/LeftColumn';
import { RightColumn } from './layout/RightColumn';
import { CenterColumn } from './layout/CenterColumn';

interface Props {
  selectedQuadrant?: string | null;
  selectedItem?: string | null;
}

export const App: React.FC<Props> = ({ selectedItem = null, selectedQuadrant = null }) => (
  <div className="App">
    {!selectedQuadrant && !selectedItem && (
      <Layout>
        <LeftColumn>
          <Switch>
            {/* <Route exact path="/" component={TechList} /> */}
          </Switch>

          <Switch>
            {/* <Route exact path="/" component={Filter} /> */}
          </Switch>
        </LeftColumn>

        <CenterColumn>
          {/* <Radar /> */}
          {/* <TechOrBlipDescription /> */}
        </CenterColumn>

        <RightColumn>
          {/* <DataLists /> */}
        </RightColumn>
      </Layout>
    )}
    {/* {!selectedQuadrant && selectedItem && <BlipPage />} */}
    {/* {selectedQuadrant && <QuadrantPage />} */}
  </div>
);
