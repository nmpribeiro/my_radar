import React from 'react';

import { Radar } from '../radar/Radar';
import { TechList } from '../components/tech/TechList';
import { RadarFilter } from '../components/radar/RadarFilter';

import './App.css';
import { CenterColumn } from './layout/CenterColumn';
import { Layout } from './layout/Layout';
import { LeftColumn } from './layout/LeftColumn';
import { RightColumn } from './layout/RightColumn';

const ItemsList: React.FC = ({ children }) => <>{children}</>;

export const App: React.FC = () => (
  <div className="App">
    <Layout>
      <LeftColumn>
        <TechList />
        <RadarFilter />
      </LeftColumn>

      <CenterColumn>
        <Radar />
      </CenterColumn>

      <RightColumn>
        <ItemsList />
      </RightColumn>
    </Layout>
  </div>
);
