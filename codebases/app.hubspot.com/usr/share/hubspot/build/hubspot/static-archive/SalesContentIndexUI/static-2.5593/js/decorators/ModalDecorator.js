'use es6';

import connect from 'SalesContentIndexUI/data/redux/connect';
import SearchActions from 'SalesContentIndexUI/data/actions/SearchActions';
export default (function (Component) {
  return connect(null, SearchActions.get())(Component);
});