import ExecutionEnvironment from 'exenv';

import marketplace from 'cfg/marketplace.json';

/*
  sets variables based on environment
*/
const AppEnvironment = {
  isClient:     ExecutionEnvironment.canUseDOM,
  hasZfc:       ExecutionEnvironment.canUseDOM && typeof window.zfc !== 'undefined',
  hasTrackers:  ExecutionEnvironment.canUseDOM && marketplace.hasOwnProperty('analytics'),
  showDevTools: ExecutionEnvironment.canUseDOM && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
};

export default AppEnvironment;
