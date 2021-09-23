'use es6';

import LocalStorageContainer from 'SequencesUI/data/LocalStorageContainer';
import { proTipDismissed } from 'SequencesUI/constants/LocalStorageKeys';
export function dismissProTip() {
  LocalStorageContainer.set(proTipDismissed, true);
}
export function isProTipDismissed() {
  return LocalStorageContainer.get(proTipDismissed);
}