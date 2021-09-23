'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { getDefaultTranslationKey, getTranslationOptions, getFilterFamilyName, legacyObjectTypes } from '../utilities/filterFamilyTranslation';
import FormattedMessage from 'I18n/components/FormattedMessage';
import invariant from 'react-utils/invariant';
import memoize from 'transmute/memoize';
import partial from 'transmute/partial';
import I18n from 'I18n';
export var LegacyFilterFamilyObjectNameTranslator = function LegacyFilterFamilyObjectNameTranslator(filterFamily) {
  var isPlural = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var legacyFilterFamily = getFilterFamilyName(filterFamily);
  invariant(legacyObjectTypes.includes(legacyFilterFamily), "Attempted to call FilterFamilyObjectNameTranslator with invalid filterFamily '" + legacyFilterFamily + "', it can only be used with legacy CrmObjects");
  var pluralKey = isPlural ? 'plural' : 'singular';
  return I18n.text("customerDataFilters.LegacyFilterFamilyObjectNameTranslator." + legacyFilterFamily + "." + pluralKey);
};

var getTranslator = function getTranslator(prefix, filterFamily) {
  var getFilterFamilyEntityName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : LegacyFilterFamilyObjectNameTranslator;
  var getTranslationKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getDefaultTranslationKey;
  var key = getTranslationKey(filterFamily);
  invariant(key, "translation key not found in " + prefix + " for filterFamily '" + filterFamily + "'");
  return /*#__PURE__*/_jsx(FormattedMessage, {
    message: "customerDataFilters." + prefix + "." + key,
    options: getTranslationOptions({
      filterFamily: filterFamily,
      getFilterFamilyEntityName: getFilterFamilyEntityName
    })
  });
};

export var FilterFamilyAndButtonTooltipTranslator = memoize(partial(getTranslator, 'FilterFamilyAndButtonTooltipTranslator'));
export var FilterFamilyGroupHeadingTranslator = memoize(partial(getTranslator, 'FilterFamilyGroupHeadingTranslator'));
export var FilterFamilyNameTranslator = memoize(partial(getTranslator, 'FilterFamilyNameTranslator'));