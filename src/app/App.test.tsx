import React from 'react';
import { render, screen } from '@testing-library/react';

import { App } from './App';

test('renders learn react link', () => {
  render(<App />);
  const el = screen.getByText(/Radar diagram construction/i);
  expect(el).toBeInTheDocument();
});
