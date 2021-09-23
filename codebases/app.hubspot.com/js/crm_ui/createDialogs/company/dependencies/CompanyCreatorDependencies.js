'use es6';

import PropertiesStore from 'crm_data/properties/PropertiesStore';
import CompaniesDomainStore from 'crm_data/companies/CompaniesDomainStore';
import BidenStore from 'crm_data/companies/BidenStore';
import SettingsStore from 'crm_data/settings/SettingsStore';
import ObjectCreatorPropertiesDependency from '../../../flux/dependencies/ObjectCreatorPropertiesDependency';
import RequiredPropsDependency from '../../../dependencies/RequiredPropsDependency';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { isValidDomain, getDomain } from 'customer-data-properties/validation/PropertyValidations';
import { COMPANY } from 'customer-data-objects/constants/ObjectTypes';
var BIDEN_AUTO_HYDRATE = 'companies:biden-auto-hydrate';

var isTrue = function isTrue(val) {
  var fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return val === undefined ? fallback : val === true || val === 'true';
};

var AllCompanyPropertiesDependency = {
  stores: [PropertiesStore],
  deref: function deref() {
    return PropertiesStore.get(COMPANY);
  }
};
var BidenCompanyDependency = {
  stores: [BidenStore, SettingsStore],
  deref: function deref(_ref) {
    var companyRecord = _ref.companyRecord;
    var domain = getProperty(companyRecord, 'domain');
    var settings = SettingsStore.get();

    if (!settings) {
      return null;
    }

    var shouldUseBiden = isTrue(settings.get(BIDEN_AUTO_HYDRATE), true);

    if (!shouldUseBiden || !isValidDomain(domain)) {
      return null;
    }

    return BidenStore.get(getDomain(domain));
  }
};
var ShowAllPropertiesDependency = {
  stores: [CompaniesDomainStore],
  deref: function deref(_ref2) {
    var companyRecord = _ref2.companyRecord,
        isCreatingCompany = _ref2.isCreatingCompany;
    var suggestions;
    var domain = getProperty(companyRecord, 'domain');
    var name = getProperty(companyRecord, 'name');
    var validDomain = isValidDomain(domain);

    if (validDomain) {
      suggestions = CompaniesDomainStore.get(getDomain(domain));
    }

    if (suggestions && suggestions.has('results') && suggestions.get('results').size && !isCreatingCompany) {
      return false;
    }

    if (isCreatingCompany || name || validDomain) {
      return true;
    }

    return false;
  }
};
var ShowLoadingAnimationDependency = {
  stores: [CompaniesDomainStore],
  deref: function deref(_ref3) {
    var companyRecord = _ref3.companyRecord;
    var domain = getProperty(companyRecord, 'domain');
    var suggestions = CompaniesDomainStore.get(getDomain(domain));

    if (isValidDomain(domain) && !(suggestions && suggestions.has('results'))) {
      return true;
    }

    return false;
  }
};
var SuggestionsDependency = {
  stores: [CompaniesDomainStore],
  deref: function deref(_ref4) {
    var companyRecord = _ref4.companyRecord,
        isCreatingCompany = _ref4.isCreatingCompany;
    var domain = getProperty(companyRecord, 'domain');

    if (!isValidDomain(domain)) {
      return null;
    }

    if (isCreatingCompany) {
      return null;
    }

    return CompaniesDomainStore.get(getDomain(domain));
  }
};
export var CompanyCreatorDependencies = {
  allCompanyProperties: AllCompanyPropertiesDependency,
  bidenCompany: BidenCompanyDependency,
  properties: ObjectCreatorPropertiesDependency,
  requiredProps: RequiredPropsDependency,
  showAllProperties: ShowAllPropertiesDependency,
  showLoadingAnimation: ShowLoadingAnimationDependency,
  suggestions: SuggestionsDependency
};