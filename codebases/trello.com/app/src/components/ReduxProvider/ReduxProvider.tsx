import React from 'react';
import { Provider } from 'react-redux';
import { defaultStore } from 'app/gamma/src/defaultStore';

export const ReduxProvider: React.FunctionComponent = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);
