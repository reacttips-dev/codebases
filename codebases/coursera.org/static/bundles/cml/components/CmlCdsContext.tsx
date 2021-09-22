import * as React from 'react';

export const CmlCdsContext = React.createContext({ isCdsEnabled: false });
export const CmlCdsContextProvider: React.FC<{ isCdsEnabled: boolean }> = ({ children, isCdsEnabled }) => (
  <CmlCdsContext.Provider value={{ isCdsEnabled }}>{children}</CmlCdsContext.Provider>
);
