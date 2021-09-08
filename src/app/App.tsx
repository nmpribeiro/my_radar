import React from 'react';

import { Radar } from '../components/radar/Radar';

import './App.css';

export const App: React.FC = () => {
  return (
    <div className="App">
      <p>Radar diagram construction</p>
      <Radar />
    </div>
  );
};
