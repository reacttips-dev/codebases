'use es6';

import apiClient from 'hub-http/clients/apiClient';
import { List, fromJS } from 'immutable';
import ConnectedAccounts from 'customer-data-email/schema/connectedAccount/ConnectedAccounts';
import Raven from 'Raven';
import { INACTIVE, DISABLED } from 'customer-data-email/schema/email/EmailDisabledTypes';
import EmailAlias from 'customer-data-email/schema/connectedAccount/EmailAlias';
import EmailAliasList from 'customer-data-email/schema/connectedAccount/EmailAliasList';
import EmailIntegration from 'customer-data-email/schema/connectedAccount/EmailIntegration';
import ConnectedAccount from 'customer-data-email/schema/connectedAccount/ConnectedAccount';
import UserContainer from 'SequencesUI/data/UserContainer';

function getEmailAliasList(inbox) {
  var aliases = inbox.get('aliases');
  var aliasState = inbox.get('aliasState');
  var inboxStatus = inbox.get('inboxStatus');

  if (inboxStatus === INACTIVE && !inbox.get('shared')) {
    inboxStatus = DISABLED;
  }

  var aliasList = List();

  if (aliasState === 'ENABLED') {
    aliasList = aliases.map(function (alias) {
      var fields = {
        address: alias.get('email'),
        displayableAddress: alias.get('sendFromEmail') || alias.get('email'),
        primary: alias.get('primary'),
        signature: alias.get('signature'),
        default: alias.get('default'),
        type: alias.get('type'),
        disabled: inboxStatus === 'ENABLED' ? null : inboxStatus,
        inboxId: alias.get('conversationsInboxId'),
        conversationsInboxName: alias.get('conversationsInboxName'),
        conversationsConnectedAccountId: alias.get('conversationsConnectedAccountId')
      };
      return EmailAlias(fields);
    });
  }

  return EmailAliasList({
    aliases: List(aliasList),
    state: aliasState
  });
}

function getPortalEmailSignature() {
  return apiClient.get('userpreferences/v1/signature', {
    clienttimeout: 60000
  });
}

function getDisplayNames(primaryAlias) {
  var names = {
    friendlyFromName: null,
    resolvedFromName: null,
    sendFromEmail: null
  };

  if (primaryAlias) {
    names.friendlyFromName = primaryAlias.get('friendlyFromName');
    names.resolvedFromName = primaryAlias.get('resolvedFromName');
    names.sendFromEmail = primaryAlias.get('sendFromEmail');
  }

  return names;
}

export function getConnectedAccounts(loggedInUserEmailAddress) {
  return apiClient.get('connectedaccounts/v1/accounts/connected-inboxes', {
    timeout: 60000
  }).then(fromJS).then(function (response) {
    var inboxes = response.get('connectedInboxes').sortBy(function (inbox) {
      return inbox.get('inboxStatus') === 'ENABLED' ? 0 : 1;
    });
    var accounts = inboxes.map(function (inbox) {
      var accountId = inbox.get('accountId');
      var aliases = inbox.get('aliases');
      var primaryAlias = aliases && aliases.find(function (alias) {
        return alias.get('primary');
      });
      var fields = Object.assign({
        address: accountId && accountId.toLowerCase(),
        facsimileInbox: inbox.get('facsimileInboxState'),
        integration: new EmailIntegration({
          type: inbox.get('emailProviderType'),
          state: inbox.get('crmEmailIntegrationState')
        }),
        aliasList: getEmailAliasList(inbox),
        shared: inbox.get('shared'),
        inboxType: inbox.get('emailProviderType')
      }, getDisplayNames(primaryAlias));
      return new ConnectedAccount(fields);
    });
    var ca = new ConnectedAccounts({
      accounts: accounts
    });
    var hasOwnerAccount = ca.hasPrimaryAccount(loggedInUserEmailAddress);

    if (!hasOwnerAccount) {
      var aliasFields = {
        address: loggedInUserEmailAddress,
        displayableAddress: loggedInUserEmailAddress,
        signature: null,
        primary: true,
        default: true,
        type: 'owner'
      };
      return getPortalEmailSignature().then(function (sig) {
        aliasFields.signature = sig.get('signature');
        var fields = {
          address: loggedInUserEmailAddress,
          aliasList: EmailAliasList({
            aliases: List([EmailAlias(aliasFields)]),
            state: 'ENABLED'
          })
        };
        accounts = accounts.concat([new ConnectedAccount(fields)]);
        return new ConnectedAccounts({
          accounts: accounts
        });
      }).catch(function () {
        var fields = {
          address: loggedInUserEmailAddress,
          aliasList: EmailAliasList({
            aliases: List([EmailAlias(aliasFields)]),
            state: 'ENABLED'
          })
        };
        accounts = accounts.concat([new ConnectedAccount(fields)]);
        return new ConnectedAccounts({
          accounts: accounts
        });
      });
    }

    return ca;
  });
}
/*
 * HubSpot CRM and Conversations have their own set of connected accounts.  The emails sent through
 * conversations create engagements that appear on the contact's CRM profile page.  A CRM user can
 * respond to those email engagements as any other using a CRM or a Conversations email account as
 * sender. The CRM's connected account API retuns a UNION of CRM's and Conversations' connected
 * accounts, but Conversations' connected account have permissions and additional
 * fields (sendAsAddress, friendlyFromName, displayAddress, etc.). The fetchAndHydrateConnectedAccounts function
 * standardizes the connected account list for the communicator.
 */

export function fetchAndHydrateConnectedAccounts() {
  var userEmail = UserContainer.get().email.toLowerCase();
  return getConnectedAccounts(userEmail).catch(function (error) {
    Raven.captureMessage('[SequencesUI] Failed to fetch the connected accounts.', {
      extra: {
        statusCode: error.status,
        statusText: error.statusText,
        responseText: error.responseText
      }
    });
    throw error;
  });
}