'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { CrmLogger } from 'customer-data-tracking/loggers';
import { useEffect } from 'react';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { createKeyboardShortcut } from '../../profile/shortcuts/KeyboardShortcut';
import { createShortcutHandler } from '../../profile/shortcuts/ProfileKeyboardShortcutHandler';
import KeyCodes, { MODIFIER_KEYS } from '../../profile/shortcuts/KeyCodes';
import { keyCombination, anyOf, exactly } from '../../profile/shortcuts/KeyTesters';
export default function PageRefreshUsageLogger(_ref) {
  var objectType = _ref.objectType;

  var logPageRefresh = function logPageRefresh() {
    CrmLogger.logImmediate('pageRefresh', {
      objectType: objectType
    });
  };

  var refreshShortcutCmdR = createKeyboardShortcut(logPageRefresh, keyCombination(anyOf.apply(void 0, _toConsumableArray(MODIFIER_KEYS)), exactly(KeyCodes.R_KEY)));
  var refreshShortcutF5 = createKeyboardShortcut(logPageRefresh, exactly(KeyCodes.F5_KEY));
  var shortcutHandler = createShortcutHandler(refreshShortcutCmdR, refreshShortcutF5);
  useEffect(function () {
    return shortcutHandler.initializeShortcutListener(false);
  });
  return null;
}
PageRefreshUsageLogger.propTypes = {
  objectType: AnyCrmObjectTypePropType
};