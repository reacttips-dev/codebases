'use es6';

import apiClient from 'hub-http/clients/apiClient';
export function updateCompanyProperties(companyId, properties) {
  var url = "companies/v2/companies/" + companyId;
  var data = {
    companyId: companyId,
    properties: properties
  };
  return apiClient.put(url, {
    data: data
  });
}