import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Radar } from '../radar/Radar';
import { TechList } from '../components/tech/TechList';
import { DataLists } from '../components/lists/DataLists';
import { RadarFilter } from '../components/radar/RadarFilter';
import { TechDescription } from '../components/tech/TechDescription';

import './App.scss';
import { Layout } from './layout/Layout';
import { LeftColumn } from './layout/LeftColumn';
import { RightColumn } from './layout/RightColumn';
import { CenterColumn } from './layout/CenterColumn';

export const App: React.FC = () => (
  <div className="App">
    <Layout>
      <LeftColumn>
        <Switch>
          <Route exact path="/" component={TechList} />
        </Switch>

        <Switch>
          <Route exact path="/" component={RadarFilter} />
        </Switch>
      </LeftColumn>

      <CenterColumn>
        <Radar />
        <TechDescription />
      </CenterColumn>

      <RightColumn>
        <DataLists />
      </RightColumn>
    </Layout>
  </div>
);
