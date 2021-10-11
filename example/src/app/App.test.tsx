import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import { appStore } from '../store/store';
import { RADAR_OPTIONS } from '../../../src/constants/RadarConstants';

import { App } from './App';

describe('App test', () => {
  let store: Store;
  beforeEach(() => {
    store = appStore;
  });

  test('renders learn react link', () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    );
    setTimeout(() => {
      const el = screen.getByText(new RegExp(RADAR_OPTIONS.title, 'i'));
      expect(el).toBeInTheDocument();
    });
  });
});
