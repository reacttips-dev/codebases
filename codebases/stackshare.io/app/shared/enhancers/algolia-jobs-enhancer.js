import React from 'react';

export const AlgoliaJobsContext = React.createContext(null);

export const withAlgoliaJobs = index => Component => props => (
  <AlgoliaJobsContext.Provider value={index}>
    <Component {...props} />
  </AlgoliaJobsContext.Provider>
);
