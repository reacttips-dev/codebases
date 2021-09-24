'use es6';

import getIn from 'transmute/getIn';
import toJS from 'transmute/toJS';
export var getPropertyNamesFromCustomRecordView = function getPropertyNamesFromCustomRecordView(customRecordView) {
  // there will always only be 1 card per view for OBJECT_BOARD because every
  // record on the board uses the same card format
  var propertyNames = getIn(['cards', 0, 'properties'], customRecordView);

  if (!propertyNames) {
    return [];
  } // we only display two properties per card, but the BE does not enforce this,
  // so we need to enforce the limit here just in case more than 2 are saved


  return toJS(propertyNames).slice(0, 2);
};