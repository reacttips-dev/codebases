'use es6';

import getIn from 'transmute/getIn';
export var getReadableErrorInfo = function getReadableErrorInfo(error, objectName) {
  var message = getIn(['responseJSON', 'message'], error);
  var errorOptions = {
    objectName: objectName
  };

  if (message && message.includes('Cannot set PropertyValueCoordinates') && message.includes('already has that value')) {
    return {
      errorMessage: 'indexPage.objectBuilder.errors.duplicatePropertyValue',
      errorOptions: errorOptions
    };
  }

  return {
    errorMessage: 'indexPage.objectBuilder.errors.default',
    errorOptions: errorOptions
  };
};