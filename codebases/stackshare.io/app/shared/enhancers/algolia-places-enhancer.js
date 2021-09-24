import React from 'react';

export const AlgoliaPlacesContext = React.createContext(null);

export const withAlgoliaPlaces = index => Component => props => (
  <AlgoliaPlacesContext.Provider value={index}>
    <Component {...props} />
  </AlgoliaPlacesContext.Provider>
);
