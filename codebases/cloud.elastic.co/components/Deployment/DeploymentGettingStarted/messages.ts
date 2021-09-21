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

export const messages = defineMessages({
  resetNewCredentials: {
    id: 'deployment-getting-started.reset-credentials',
    defaultMessage: 'Reset your deployment password',
  },
  forgotCredentials: {
    id: 'deployment-getting-started.forgot-credentials',
    defaultMessage: 'Forgot to save your credentials? {recreateCredentials}',
  },
  elasticsearch: {
    id: 'deployment-getting-started.elasticsearch.description',
    defaultMessage: 'to start using your deployment',
  },
  kibana: {
    id: 'deployment-getting-started.kibana.description',
    defaultMessage: 'The next step is to ingest data and create visualizations in Kibana',
  },
  appsearch: {
    id: 'deployment-getting-started.appsearch.description',
    defaultMessage: 'The next step is to customize your search experience',
  },
  enterprise_search: {
    id: 'deployment-getting-started.enterprise-search.description',
    defaultMessage: 'The next step is to customize your search experience',
  },
  launchHelpText: {
    id: 'deployment-getting-started.launch-help-text',
    defaultMessage: 'Ready in a few minutes',
  },
  resetModalTitle: {
    id: 'reset-modal.title',
    defaultMessage: 'Reset deployment password?',
  },
  resetModalConfirm: {
    id: 'reset-modal.confirm',
    defaultMessage: 'Reset',
  },
  resetModalCancel: {
    id: 'reset-modal.cancel',
    defaultMessage: 'Cancel',
  },
  saveCredentialsModalTitle: {
    id: 'save-credentials-modal.title',
    defaultMessage: 'Save your {elastic} deployment credentials. They are shown only once.',
  },
  saveCredentialsModalInfo: {
    id: 'save-credentials-modal.info',
    defaultMessage: 'When you want to add data to Kibana, you will need to use these credentials.',
  },
  download: {
    id: 'deployment-getting-started.download',
    defaultMessage: 'Download',
  },
  continueWithoutDownloading: {
    id: 'deployment-getting-started.continue-without-downloading',
    defaultMessage: 'Continue without downloading',
  },
})
