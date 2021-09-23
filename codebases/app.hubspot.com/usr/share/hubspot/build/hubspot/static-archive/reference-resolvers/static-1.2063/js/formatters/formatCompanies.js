'use es6';

import getIn from 'transmute/getIn';
export var formatCompanyName = function formatCompanyName(company) {
  return getIn(['properties', 'name', 'value'], company) || getIn(['properties', 'domain', 'value'], company);
};