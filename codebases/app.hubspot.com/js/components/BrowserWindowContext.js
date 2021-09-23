'use es6';

import { createContext } from 'react';
export var defaultBrowserWindowContext = {
  browserWindowHeight: 1080,
  browserWindowWidth: 1920
};
export var BrowserWindowContext = /*#__PURE__*/createContext(defaultBrowserWindowContext);