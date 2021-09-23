import { getErrorTitle, isSilent } from './errorActionGetters';
export var isGenericErrorAction = function isGenericErrorAction(action) {
  return !getErrorTitle(action) && !isSilent(action);
};