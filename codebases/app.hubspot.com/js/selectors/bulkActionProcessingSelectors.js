'use es6';

export var selectBulkActionProcessingIds = function selectBulkActionProcessingIds(state) {
  return state.bulkActionProcessing.actionableIds || [];
};