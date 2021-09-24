'use es6';

import PropTypes from 'prop-types';
import { upgradeDataPropsInterface } from 'ui-addon-upgrades/_core/common/data/upgradeData/interfaces/upgradeDataPropsInterface';
export var PricingPageRedirectButtonPropsInterface = Object.assign({}, upgradeDataPropsInterface, {
  use: PropTypes.string,
  isSelectableBox: PropTypes.bool
});