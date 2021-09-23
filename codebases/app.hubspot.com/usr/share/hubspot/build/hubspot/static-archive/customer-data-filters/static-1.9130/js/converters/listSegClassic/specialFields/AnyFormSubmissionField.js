'use es6';

import { EnumerationDisplayType } from 'customer-data-filters/filterQueryFormat/DisplayTypes';
import { FORM } from '../../../filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import { __ANY_FORM } from '../ListSegConstants';
import DSFieldRecord from 'customer-data-filters/filterQueryFormat/DSFieldRecord/DSFieldRecord';
import once from 'transmute/once';
import unescapedText from 'I18n/utils/unescapedText';
export default once(function () {
  return DSFieldRecord({
    displayType: EnumerationDisplayType,
    displayOrder: -1,
    label: unescapedText('customerDataFilters.FilterEditor.specialOptionValues.anyForm'),
    name: __ANY_FORM,
    type: FORM
  });
});