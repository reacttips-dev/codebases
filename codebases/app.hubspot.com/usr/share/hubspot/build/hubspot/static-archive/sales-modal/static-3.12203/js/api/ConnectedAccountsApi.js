'use es6';

import apiClient from 'hub-http/clients/apiClient';
import { fromJS } from 'immutable';
import ConnectedAccounts from 'customer-data-email/schema/connectedAccount/ConnectedAccounts';
import { toConnectedAccounts } from 'customer-data-email/schema/connectedAccount/ConnectedAccountsTranslations';
var URLS = {
  connectedAccounts: 'connectedaccounts/v1/accounts'
};

var transformToConnectedAccounts = function transformToConnectedAccounts(response) {
  return new ConnectedAccounts({
    accounts: toConnectedAccounts(response)
  });
};

export function fetchConnectedAccounts() {
  return apiClient.get(URLS.connectedAccounts).then(fromJS).then(transformToConnectedAccounts);
}