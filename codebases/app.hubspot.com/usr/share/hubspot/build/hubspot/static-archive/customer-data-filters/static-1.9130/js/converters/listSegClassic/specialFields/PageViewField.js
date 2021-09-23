'use es6';

import { PAGE_VIEW } from '../../../filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import NoOptionField from './NoOptionField';
import once from 'transmute/once';
export default once(function () {
  return NoOptionField({
    filterFamily: PAGE_VIEW
  });
});