import { useEffect, useContext } from 'react';
import RhumbContext from './internal/RhumbContext';
import { runWithLowPriority } from './internal/Scheduler';
import performanceNow from './vendor/performanceNow';

var useNavMarker = function useNavMarker(name) {
  var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var context = useContext(RhumbContext);
  var id = context && context.id;
  var dispatch = context && context.dispatch;
  var enabled = active && typeof context !== 'undefined';

  if (process.env.NODE_ENV !== 'production') {
    if (!/^\S+$/.test(name)) {
      throw new Error("[react-rhumb] marker names that include spaces are deprecated, please rename marker \"" + name + "\" to e.g. \"" + name.toUpperCase().replace(/\s/g, '_') + "\"");
    }
  }

  useEffect( // eslint-disable-next-line consistent-return
  function () {
    if (enabled) {
      var marker = {
        name: name,
        id: id
      };
      var timestamp = performanceNow();
      runWithLowPriority(function () {
        dispatch({
          type: 'MARKER_MOUNTED',
          payload: {
            marker: marker,
            timestamp: timestamp
          }
        });
      }); // eslint-disable-next-line consistent-return

      return function () {
        runWithLowPriority(function () {
          dispatch({
            type: 'MARKER_UNMOUNTED',
            payload: {
              marker: marker
            }
          });
        });
      };
    }
  }, [name, id, dispatch, enabled]); // dispatch is guaranteed to be static
};

export default useNavMarker;