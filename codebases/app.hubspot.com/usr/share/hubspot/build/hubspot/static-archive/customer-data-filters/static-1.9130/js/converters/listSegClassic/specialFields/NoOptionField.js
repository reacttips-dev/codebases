'use es6';

import { Map as ImmutableMap } from 'immutable';
import { StringDisplayType } from 'customer-data-filters/filterQueryFormat/DisplayTypes';
import DSFieldRecord from 'customer-data-filters/filterQueryFormat/DSFieldRecord/DSFieldRecord';
import I18n from 'I18n';
export default (function (_ref) {
  var filterFamily = _ref.filterFamily,
      _ref$displayType = _ref.displayType,
      displayType = _ref$displayType === void 0 ? StringDisplayType : _ref$displayType;
  return DSFieldRecord({
    displayType: displayType,
    label: I18n.text("customerDataFilters.DSAssetFamilyNames." + filterFamily),
    metadata: ImmutableMap({
      hasNoFieldOptions: true
    }),
    name: filterFamily,
    type: filterFamily
  });
});