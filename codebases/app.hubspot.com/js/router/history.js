'use es6';

import { createBrowserHistory } from 'history';
import { getRootUrl } from '../utils/urls';
export var history = createBrowserHistory({
  basename: getRootUrl()
});