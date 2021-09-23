'use es6';

import { createContext } from 'react';
export var defaultTileContext = {
  compact: false
};
export var TileContext = /*#__PURE__*/createContext(defaultTileContext);
var Provider = TileContext.Provider;
export { Provider as TileContextProvider };