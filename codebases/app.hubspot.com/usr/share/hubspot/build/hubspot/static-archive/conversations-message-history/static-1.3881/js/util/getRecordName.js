'use es6';

import { Record } from 'immutable';
/**
 * Given a record-building function, returns the name of the record. Since the name is not set on
 * the record until the record is first instantiated, this function also attempts to construct the
 * record and pull its name from there.
 *
 * @param {Function} record
 */

export var getRecordName = function getRecordName() {
  var record = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!(record.prototype instanceof Record)) {
    return 'Object';
  }

  if (record.prototype._name) {
    return record.prototype._name;
  } // eslint-disable-next-line no-new


  new record();
  return record.prototype._name || 'Record';
};