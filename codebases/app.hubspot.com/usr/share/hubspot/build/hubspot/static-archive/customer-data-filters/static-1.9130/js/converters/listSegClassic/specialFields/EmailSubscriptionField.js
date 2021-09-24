'use es6';

import { EMAIL_SUBSCRIPTION } from '../../../filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import { EmailSubscriptionDisplayType } from 'customer-data-filters/filterQueryFormat/DisplayTypes';
import NoOptionField from './NoOptionField';
import once from 'transmute/once';
export default once(function () {
  return NoOptionField({
    filterFamily: EMAIL_SUBSCRIPTION,
    displayType: EmailSubscriptionDisplayType
  });
});