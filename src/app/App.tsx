import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Radar } from '../radar/Radar';
import { TechList } from '../components/tech/TechList';
import { RadarFilter } from '../components/radar/RadarFilter';
import { DataLists } from '../components/lists/DataLists';

import './App.scss';
import { CenterColumn } from './layout/CenterColumn';
import { Layout } from './layout/Layout';
import { LeftColumn } from './layout/LeftColumn';
import { RightColumn } from './layout/RightColumn';

const MockupOne: React.FC = () => (
  <Layout>
    <LeftColumn>
      <Switch>
        <Route exact path="/technologies/:technologySlug" component={TechList} />
        <Route exact path="/" component={TechList} />
      </Switch>

      <Switch>
        <Route exact path="/technologies/:technologySlug" component={RadarFilter} />
        <Route exact path="/" component={RadarFilter} />
      </Switch>
    </LeftColumn>

    <CenterColumn>
      <Route exact path="/technologies/:technologySlug" component={Radar} />
      <Route exact path="/" component={Radar} />
    </CenterColumn>

    <RightColumn>
      <DataLists />
    </RightColumn>
  </Layout>
);

export const App: React.FC = () => (
  <div className="App">
    <Switch>
      <Route path="/" component={MockupOne} />
    </Switch>
  </div>
);
