import React from 'react';

export const MobileContext = React.createContext(false);

export function withMobile(isMobile) {
  return function(Component) {
    return function MobileProvider(props) {
      return (
        <MobileContext.Provider value={isMobile}>
          <Component {...props} />
        </MobileContext.Provider>
      );
    };
  };
}
