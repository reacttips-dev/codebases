import getIn from 'transmute/getIn';
import { DATA, STATUS, UPDATED_AT, ERROR } from '../constants/keyPaths';
export function getData(asyncData) {
  return getIn(DATA, asyncData);
}
export var getError = getIn(ERROR);
export var getStatus = getIn(STATUS);
export var getUpdatedAt = function getUpdatedAt(asyncData) {
  return getIn(UPDATED_AT)(asyncData);
};