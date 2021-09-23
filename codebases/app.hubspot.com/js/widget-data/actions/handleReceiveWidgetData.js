'use es6';

import bootstrapWidget from '../../actions/bootstrapWidget';
import { initializeI18n } from '../../utils/initializeI18n';
import { fetchVisitorThreads } from '../../threads/actions/ThreadActions';
import { getShouldFetchInitialVisitorThreads } from '../../threads/selectors/getShouldFetchInitialVisitorThreads';
import { navigateToInitialView } from '../../navigation/actions/navigateToInitialView';
import { setThreadsSuccess } from '../../threads/actions/setThreadsSuccess';
export var handleReceiveWidgetData = function handleReceiveWidgetData(_ref) {
  var data = _ref.data;
  return function (dispatch, getState) {
    if (data) {
      return initializeI18n({
        data: data
      }).then(function () {
        dispatch(bootstrapWidget(data));
        var shouldFetchVisitorThreads = getShouldFetchInitialVisitorThreads(getState());

        if (shouldFetchVisitorThreads) {
          dispatch(fetchVisitorThreads()).then(function () {
            dispatch(setThreadsSuccess());
            dispatch(navigateToInitialView());
          });
        } else {
          dispatch(setThreadsSuccess());
          dispatch(navigateToInitialView());
        }
      }, function () {
        dispatch(bootstrapWidget(data));
      });
    }

    return null;
  };
};