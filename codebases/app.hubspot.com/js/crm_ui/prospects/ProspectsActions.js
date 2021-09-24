'use es6';

import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import * as CompaniesAPI from 'crm_data/companies/api/CompaniesAPI';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { dispatch } from 'crm_data/flux/dispatch';
import CurrentOwnerContainer from '../../containers/CurrentOwnerContainer';
import { PROSPECT_ADD_SUCCESS } from './ProspectsActionTypes';
import Raven from 'Raven';

var notifySuccess = function notifySuccess(companyName) {
  Alerts.addSuccess('prospectsPage.addCompany.success', {
    companyName: companyName
  });
};

var notifyError = function notifyError(companyName) {
  Alerts.addError('prospectsPage.addCompany.error', {
    companyName: companyName
  });
};

var ProspectsActions = {
  addCompany: function addCompany(name, domain) {
    var companyName = name || domain;
    return CompaniesAPI.createCompanyFromProspect(name, domain, CurrentOwnerContainer.get()).then(function (company) {
      CrmLogger.log('createRecord', {
        type: 'company'
      });
      notifySuccess(companyName);
      dispatch(PROSPECT_ADD_SUCCESS, {
        company: company,
        domain: domain
      });
      return company.companyId;
    }).catch(function (error) {
      notifyError(companyName);
      return Raven.captureMessage('Visits: Error adding company', {
        extra: error
      });
    });
  }
};
export default ProspectsActions;