'use es6';

import formatName from 'I18n/utils/formatName';
import UserContainer from 'SequencesUI/data/UserContainer';
export function isOwnedByCurrentUser(result) {
  return result.get('userId') === UserContainer.get().user_id;
}
export function getOwnerName(userView) {
  return formatName(userView.toObject());
}