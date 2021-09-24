import performanceNow from './vendor/performanceNow';
import memoizeOne from 'react-utils/memoizeOne';
export default memoizeOne(function (history) {
  var initialPathname = history.location.pathname;
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