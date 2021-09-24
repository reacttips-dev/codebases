'use es6';

import { createAction } from 'flux-actions';
import identity from 'transmute/identity';
import { ADD_RESULT, UPDATE_RESULT, UPDATE_RESULTS, REMOVE_RESULT, REMOVE_RESULTS, REPLACE_RESULT, REPLACE_RESULT_AFTER_SEARCH } from 'SalesContentIndexUI/data/constants/ActionTypes';
var addResultAction = createAction(ADD_RESULT, identity);
var updateResultAction = createAction(UPDATE_RESULT, identity);
var updateResultsAction = createAction(UPDATE_RESULTS, identity);
var removeResultAction = createAction(REMOVE_RESULT, identity);
var removeResultsAction = createAction(REMOVE_RESULTS, identity);
var replaceResultAction = createAction(REPLACE_RESULT, identity);
var replaceResultAfterSearchAction = createAction(REPLACE_RESULT_AFTER_SEARCH, identity);
var IndexUIActionsContainer = {
  create: function create() {
    var _dispatch = identity;
    return {
      init: function init(dispatch) {
        return _dispatch = dispatch;
      },
      addResult: function addResult(result) {
        return _dispatch(addResultAction(result));
      },
      updateResult: function updateResult(result) {
        return _dispatch(updateResultAction(result));
      },
      updateResults: function updateResults(results) {
        return _dispatch(updateResultsAction(results));
      },
      removeResult: function removeResult(id) {
        return _dispatch(removeResultAction(id));
      },
      removeResults: function removeResults(ids) {
        return _dispatch(removeResultsAction(ids));
      },
      replaceResult: function replaceResult(_ref) {
        var idToReplace = _ref.idToReplace,
            replacementResult = _ref.replacementResult;
        return _dispatch(replaceResultAction({
          idToReplace: idToReplace,
          replacementResult: replacementResult
        }));
      },
      replaceResultAfterSearch: function replaceResultAfterSearch(_ref2) {
        var idToReplace = _ref2.idToReplace,
            replacementResult = _ref2.replacementResult;
        return _dispatch(replaceResultAfterSearchAction({
          idToReplace: idToReplace,
          replacementResult: replacementResult
        }));
      }
    };
  }
};
export default IndexUIActionsContainer.create();