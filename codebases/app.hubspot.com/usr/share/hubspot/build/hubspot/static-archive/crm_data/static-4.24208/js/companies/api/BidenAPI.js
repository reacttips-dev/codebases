'use es6';

import { get } from 'crm_data/api/ImmutableAPI';
import makeBatch from 'crm_data/api/makeBatch';
import CompanyRecord from 'customer-data-objects/company/CompanyRecord';
import { setProperty } from 'customer-data-objects/model/ImmutableModel';
export function fetch(domain) {
  var url = "companies/v2/companies/biden/" + encodeURIComponent(domain);
  return get(url, {}, function (result) {
    var company = CompanyRecord.fromJS(result);

    if (!company) {
      return company;
    }

    return setProperty(company, 'domain', domain);
  });
}
export var fetchByIds = makeBatch(fetch, 'BidenAPI.fetch');