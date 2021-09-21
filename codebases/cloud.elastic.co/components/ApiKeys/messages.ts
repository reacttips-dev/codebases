/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { defineMessages } from 'react-intl'

const messages = defineMessages({
  keyNameColumn: {
    id: `api-key.name`,
    defaultMessage: `Name`,
  },
  keyCreatedOnColumn: {
    id: `api-key.created-on`,
    defaultMessage: `Created on`,
  },
  keyRevokeColumn: {
    id: `api-key.revoke`,
    defaultMessage: `Revoke`,
  },
  keyActionsColumn: {
    id: `api-key.actions`,
    defaultMessage: `Actions`,
  },
  apiKeyCancel: {
    id: `api-key.cancel`,
    defaultMessage: `Cancel`,
  },
  revokeModalTitle: {
    id: `revoke-key.modal-title`,
    defaultMessage: `Revoke API key?`,
  },
  revokeModalBody: {
    id: `revoke-key.modal-body`,
    defaultMessage: `Revoking it affects all of the associated applications.`,
  },
  revokeCancel: {
    id: `revoke-modal.cancel`,
    defaultMessage: `Cancel`,
  },
  revokeConfirm: {
    id: `revoke-modal.confirm`,
    defaultMessage: `Revoke API key`,
  },
  revokeSuccess: {
    id: 'revoke-modal.revoke-key-success',
    defaultMessage: '{keyName} successfully revoked!',
  },
  generateModalTitle: {
    id: `generate-modal.title`,
    defaultMessage: `Generate API key`,
  },
  generateKeyButtonLabel: {
    id: `generate-api-key-button.label`,
    defaultMessage: `Generate API key`,
  },
  generateKeyAuthStep: {
    id: `generate-api-key-auth-step.title`,
    defaultMessage: `Re-authenticate`,
  },
  generateKeyAuthFooterNext: {
    id: `generate-api-auth-footer.next`,
    defaultMessage: `Authenticate`,
  },
  generateKeyFooterNext: {
    id: `generate-api-footer.next`,
    defaultMessage: `Generate API key`,
  },
  generateKeyClose: {
    id: `generate-api-key.close`,
    defaultMessage: `Close`,
  },
  downloadKey: {
    id: `generate-api-key.download`,
    defaultMessage: `Download API key`,
  },
  keyNameHelpText: {
    id: `generate-api-key.key-name-help-text`,
    defaultMessage: `Provide a unique name for your key.`,
  },
  keyNameError: {
    id: `generate-api-key.key-name-error`,
    defaultMessage: `This name is already in use. Enter another name.`,
  },
  keyNameEmptyError: {
    id: `generate-api-key.key-name-empty-error`,
    defaultMessage: `Key name cannot be empty`,
  },
  generatedApiKey: {
    id: `generated-key.label`,
    defaultMessage: `Generated API key`,
  },
  generatedApiKeyWarning: {
    id: `generated-key.warning`,
    defaultMessage: `Make sure you save the API key, because it won't be shown again.`,
  },
})

export default messages
