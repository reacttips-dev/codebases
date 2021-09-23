import React, { createContext } from 'react';

export const applicationContext = createContext(null);

export default function ApplicationProvider({ application, children }) {
  return <applicationContext.Provider value={application}>{children}</applicationContext.Provider>;
}
