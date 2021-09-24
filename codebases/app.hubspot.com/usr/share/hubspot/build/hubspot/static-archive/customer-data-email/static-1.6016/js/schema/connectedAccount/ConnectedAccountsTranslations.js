'use es6';

import { List, Map as ImmutableMap } from 'immutable';
import keyMirror from 'react-utils/keyMirror';
import partial from 'transmute/partial';
import translate from 'transmute/translate';
import { ENABLED } from 'customer-data-email/schema/connectedAccount/ConnectedAccountFeatureStates';
import { GMAIL, OUTLOOK365 } from 'customer-data-email/schema/connectedAccount/EmailClientTypes';
import { IMAP } from 'customer-data-email/schema/connectedAccount/EmailIntegrationTypes';
import { ALIAS, FACSIMILE_INBOX, CRM_EMAIL_INTEGRATION } from 'customer-data-email/schema/connectedAccount/ConnectedAccountFeatureTypes';
import EmailClients from 'customer-data-email/schema/connectedAccount/EmailClients';
import EmailIntegration from 'customer-data-email/schema/connectedAccount/EmailIntegration';
import EmailAliasList from 'customer-data-email/schema/connectedAccount/EmailAliasList';
import EmailAlias from 'customer-data-email/schema/connectedAccount/EmailAlias';
import ConnectedAccount from 'customer-data-email/schema/connectedAccount/ConnectedAccount';
var KEYS = keyMirror({
  accountId: null,
  aliases: null,
  emailProviderType: null,
  featureType: null,
  features: null,
  state: null
});
var EmailClientTypes = {
  GMAIL: GMAIL,
  OUTLOOK365: OUTLOOK365
};
var emailClientsByProviderType = ImmutableMap(EmailClientTypes).reduce(function (clientsByProviderType, clientType) {
  var providerTypes = EmailClients[clientType].providerTypes;
  return providerTypes.reduce(function (reduction, providerType) {
    return reduction.set(providerType, clientType);
  }, clientsByProviderType);
}, ImmutableMap());

var isEnabled = function isEnabled(feature) {
  return feature.get(KEYS.state) === ENABLED;
};

var getIntegrationType = function getIntegrationType(emailProviderType) {
  var integrationType = emailClientsByProviderType.get(emailProviderType);

  if (!integrationType) {
    integrationType = IMAP;
  }

  return integrationType;
};

var emailIntegrationTranslation = {
  type: function type(int) {
    return getIntegrationType(int.get(KEYS.emailProviderType));
  },
  state: true
};
var aliasTranslation = {
  address: function address(alias) {
    return alias.get('email').toLowerCase();
  },
  displayableAddress: 'email',
  primary: true,
  signature: true,
  default: true,
  type: true
};

var toAliases = function toAliases(aliasList) {
  var aliases = isEnabled(aliasList) && aliasList.has(KEYS.aliases) ? aliasList.get(KEYS.aliases) : List();
  return aliases.map(function (alias) {
    return EmailAlias(translate(aliasTranslation, alias));
  });
};

var aliasListTranslation = {
  aliases: toAliases,
  state: true
};

var extractFeature = function extractFeature(featureType, account) {
  return account.get(KEYS.features).find(function (feature) {
    return feature.get(KEYS.featureType) === featureType;
  });
};

var extractFeatureState = function extractFeatureState(featureType, account) {
  var feature = extractFeature(featureType, account);
  return feature ? feature.get(KEYS.state) : null;
};

var extractIntegration = function extractIntegration(account) {
  var integration = extractFeature(CRM_EMAIL_INTEGRATION, account);

  if (integration) {
    integration = translate(emailIntegrationTranslation, integration);
  }

  return new EmailIntegration(integration);
};

var extractAliasList = function extractAliasList(account) {
  var aliasList = extractFeature(ALIAS, account);

  if (aliasList) {
    aliasList = translate(aliasListTranslation, aliasList);
  }

  return EmailAliasList(aliasList);
};

var extractIsSharedFlag = function extractIsSharedFlag(account) {
  var fascimileFeature = extractFeature(FACSIMILE_INBOX, account);

  if (fascimileFeature && fascimileFeature.has('inbox')) {
    var inbox = fascimileFeature.get('inbox');
    return !!(inbox && inbox.get('shared'));
  }

  return false;
};

var extractInboxType = function extractInboxType(account) {
  var fascimileFeature = extractFeature(FACSIMILE_INBOX, account);
  var inbox;

  if (fascimileFeature && fascimileFeature.has('inbox')) {
    inbox = fascimileFeature.get('inbox');
  }

  return inbox && inbox.get('inboxType');
};

var connectedAccountTranslation = {
  address: function address(acct) {
    return acct.get(KEYS.accountId).toLowerCase();
  },
  facsimileInbox: partial(extractFeatureState, FACSIMILE_INBOX),
  integration: extractIntegration,
  aliasList: extractAliasList,
  shared: extractIsSharedFlag,
  inboxType: extractInboxType
};

var toConnectedAccount = function toConnectedAccount(account) {
  return new ConnectedAccount(translate(connectedAccountTranslation, account));
};

var accountHasId = function accountHasId(acct) {
  return !!acct.get(KEYS.accountId);
};

export function toConnectedAccounts(accountsList) {
  return accountsList.filter(accountHasId).map(toConnectedAccount);
}