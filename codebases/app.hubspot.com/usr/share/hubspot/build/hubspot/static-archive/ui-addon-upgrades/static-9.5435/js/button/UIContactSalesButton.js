'use es6';

import ContactSalesButton from 'ui-addon-upgrades/_core/contactSales/ContactSalesButton';
import { sourceKeys } from 'ui-addon-upgrades/_core/common/data/upgradeData/properties/sources';
import connectUpgradeData from 'ui-addon-upgrades/_core/common/data/upgradeData/connectUpgradeData';
var CONTACT_SALES_BUTTON = sourceKeys.CONTACT_SALES_BUTTON;
export default connectUpgradeData(ContactSalesButton, CONTACT_SALES_BUTTON);