'use es6';

import { createHistory } from 'history';
import { useRouterHistory } from 'react-router';
export default (function (rootUrl) {
  return useRouterHistory(createHistory)({
    basename: rootUrl
  });
});