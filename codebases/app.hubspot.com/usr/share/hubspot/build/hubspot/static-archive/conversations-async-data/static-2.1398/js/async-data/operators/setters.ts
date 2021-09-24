import updateIn from 'transmute/updateIn';
import setIn from 'transmute/setIn';
import { DATA, UPDATED_AT, STATUS, ERROR } from '../constants/keyPaths';
export var updateData = updateIn(DATA);
export var setStatus = setIn(STATUS);
export var setError = setIn(ERROR);
export function touch(asyncData) {
  return setIn(UPDATED_AT, Date.now(), asyncData);
}