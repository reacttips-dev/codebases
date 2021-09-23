'use es6';

import { useConditionalUserId } from '../../../auth/hooks/useConditionalUserId';
import get from 'transmute/get';
export var useCanUserEditView = function useCanUserEditView(view) {
  var userId = useConditionalUserId();
  return String(get('ownerId', view)) === userId;
};