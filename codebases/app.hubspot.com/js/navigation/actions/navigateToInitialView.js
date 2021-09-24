'use es6';

import { hasOpenThread } from '../../threads/selectors/hasOpenThread';
import { navigateToMostRecentThread } from '../../threads/actions/ThreadActions';
import { getKnowledgeBaseEnabled } from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { loadStagedThread } from '../../navigation/actions/loadStagedThread';
import { navigateToThreadListKnowledgebase } from '../../navigation/actions/navigateToThreadListKnowledgebase';
export function navigateToInitialView() {
  return function (dispatch, getState) {
    var isKnowledgeBaseWidget = getKnowledgeBaseEnabled(getState());

    if (hasOpenThread(getState())) {
      dispatch(navigateToMostRecentThread());
    } else if (isKnowledgeBaseWidget) {
      dispatch(navigateToThreadListKnowledgebase());
    } else {
      dispatch(loadStagedThread());
    }
  };
}