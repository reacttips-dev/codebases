import invariant from 'react-utils/invariant';
import memoizeOne from 'react-utils/memoizeOne';
import performanceNow from './vendor/performanceNow';
export default memoizeOne(function (history) {
  invariant(!!history.getCurrentLocation, 'Must supply a `history@3` object');

  var _history$getCurrentLo = history.getCurrentLocation(),
      initialPathname = _history$getCurrentLo.pathname;

  return {
    pathname: initialPathname,
    listen: function listen(cb) {
      return history.listen(function (_ref) {
        var pathname = _ref.pathname;
        var timestamp = performanceNow();
        cb({
          timestamp: timestamp,
          pathname: pathname
        });
      });
    }
  };
});