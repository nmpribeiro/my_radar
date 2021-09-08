import React from 'react';
import { render, screen } from '@testing-library/react';

import { RADAR_DATA } from '../constants/RadarData';

import { App } from './App';

test('renders learn react link', () => {
  render(<App />);
  setTimeout(() => {
    const el = screen.getByText(new RegExp(RADAR_DATA.title, 'i'));
    expect(el).toBeInTheDocument();
  });
});
