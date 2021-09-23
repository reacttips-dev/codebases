import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { AppProviders } from '../../contexts/index';
import { getRoutesWithStore } from '../../routes';

const AppEntry = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppProviders>{renderRoutes(getRoutesWithStore(store))}</AppProviders>
    </ConnectedRouter>
  </Provider>
);

AppEntry.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object,
};

export { AppEntry };
