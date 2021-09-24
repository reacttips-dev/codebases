'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { MULTI_CURRENCY_INFORMATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import Currency from 'customer-data-objects-ui-components/formatting/Currency';
import MultiCurrencyInformationResolver from 'reference-resolvers/resolvers/MultiCurrencyInformationResolver';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
export default ProvideReferenceResolvers(_defineProperty({}, MULTI_CURRENCY_INFORMATION, MultiCurrencyInformationResolver), Currency);