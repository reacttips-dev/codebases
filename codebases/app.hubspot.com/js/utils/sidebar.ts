import RESULT_TYPES from 'unified-navigation-ui/deferred/search/const/RESULT_TYPES';
export var checkNavColumn = function checkNavColumn(item) {
  return item === RESULT_TYPES.NAVIGATION || item === RESULT_TYPES.KNOWLEDGE_DOC || item === RESULT_TYPES.LEARNING_CENTER_LESSON || item === RESULT_TYPES.LEARNING_CENTER_TRACK;
};