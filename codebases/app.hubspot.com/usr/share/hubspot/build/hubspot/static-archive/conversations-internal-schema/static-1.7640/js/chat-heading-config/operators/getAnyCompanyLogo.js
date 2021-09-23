'use es6';

import getIn from 'transmute/getIn';
import { COMPANY_LOGO } from './../constants/keyPaths';
import { getFallback, getCompanyLogo } from './chatHeadingConfigGetters';
export var getAnyCompanyLogo = function getAnyCompanyLogo(chatHeadingConfig) {
  return getIn(COMPANY_LOGO, chatHeadingConfig) || getCompanyLogo(getFallback(chatHeadingConfig));
};