import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import getScopedProducts from 'ui-addon-upgrades/_core/common/adapters/getScopedProducts';
import { productUpgradeInterest } from '../upgradeData/properties/productUpgradeInterest';
import { getLegalConsentOptions } from './legalConsentOptions';

var isPhoneNumber = function isPhoneNumber(dataFormOptions) {
  return 'phoneNumber' in dataFormOptions;
};

var isEmail = function isEmail(dataFormOptions) {
  return 'emailSubject' in dataFormOptions && 'emailBody' in dataFormOptions;
};

export var getFormattedDate = function getFormattedDate(timestamp) {
  var currentDate = new Date(timestamp);
  var date = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var formattedDate = date < 10 ? "0" + date : date;
  var formattedMonth = month < 10 ? "0" + month : month;
  return formattedMonth + "/" + formattedDate + "/" + year;
};

var getFieldDataFromOptions = function getFieldDataFromOptions(options) {
  var fieldData = [];

  if (isPhoneNumber(options)) {
    fieldData.push({
      name: 'pql_phone_number_submitted',
      value: true
    }, {
      name: 'phone',
      value: options.phoneNumber
    });
  } else {
    fieldData.push({
      name: 'pql_phone_number_submitted',
      value: false
    });
  } // Email fields


  if (isEmail(options)) {
    fieldData.push({
      name: 'pql_message_submitted',
      value: true
    }, {
      name: 'pql_message_type',
      value: options.emailSubject
    }, {
      name: 'pql_message_content',
      value: options.emailBody
    });
  } else {
    fieldData.push({
      name: 'pql_message_submitted',
      value: false
    });
  }

  return fieldData;
};

var getCommMethodExp = function getCommMethodExp(upgradeData) {
  // will not have these fields when not coming from a Talk to Sales PQL.
  if (!('isRetail' in upgradeData) && !('isAssignable' in upgradeData)) {
    return 'Not Applicable';
  }

  if (upgradeData.isRetail) {
    return 'Retail';
  }

  if (upgradeData.isAssignable) {
    return 'Assignable';
  }

  return 'Unassignable';
};
/**
 * @param {Object}
 * @return {String}
 */


export var createPqlFormData = function createPqlFormData(_ref) {
  var metaData = _ref.metaData,
      upgradeData = _ref.upgradeData,
      user = _ref.user,
      portal = _ref.portal,
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {} : _ref$options;
  var portalScopes = getScopedProducts(portal, user);
  var optionsFieldData = getFieldDataFromOptions(options);
  var bundleUrl = upgradeData.bundleUrl;
  var commMethod = getCommMethodExp(upgradeData);
  var formattedDate = getFormattedDate(metaData.timestamp);
  var fieldData = [{
    name: 'email',
    value: user.email
  }, {
    name: 'firstname',
    value: user.first_name
  }, {
    name: 'lastname',
    value: user.last_name
  }, {
    name: 'crm_hub_id',
    value: portal.portal_id
  }, {
    name: 'pql_conversion_date',
    value: formattedDate
  }, {
    name: 'pql_app',
    value: upgradeData.app
  }, {
    name: 'pql_source',
    value: upgradeData.uniqueId
  }, {
    name: 'product_signup',
    value: portalScopes.length > 0 ? portalScopes.join(', ') : ''
  }, {
    name: 'product_upgrade_interest',
    value: productUpgradeInterest[upgradeData.upgradeProduct] || 'General'
  }, {
    name: 'comm_method_experience',
    value: commMethod
  }].concat(_toConsumableArray(optionsFieldData));

  if (bundleUrl) {
    fieldData.push({
      name: 'pql_master__c',
      value: bundleUrl
    });
  }

  var pqlFormData = {
    fields: fieldData,
    skipValidation: true,
    legalConsentOptions: getLegalConsentOptions()
  };
  return pqlFormData;
};