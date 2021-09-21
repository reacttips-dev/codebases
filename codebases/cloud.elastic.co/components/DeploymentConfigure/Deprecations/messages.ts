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

export default defineMessages({
  learnMore: {
    id: `deprecations.learnMore`,
    defaultMessage: `Learn more …`,
  },
  criticalIssues: {
    id: `deprecations.summary.critical`,
    defaultMessage: `The cluster's deprecation API reported critical issues. You cannot upgrade without fixing these issues.`,
  },
  criticalAndOtherIssues: {
    id: `deprecations.summary.critical-and-others`,
    defaultMessage: `The cluster's deprecation API reported critical issues. You cannot upgrade without fixing these issues. The cluster also reported other issues.`,
  },
  warningIssues: {
    id: `deprecations.summary.warning`,
    defaultMessage: `The cluster's deprecation API reported warnings. You can upgrade directly, but you are using deprecated functionality which will be removed in the next major version.`,
  },
  warningAndOtherIssues: {
    id: `deprecations.summary.warning-and-others`,
    defaultMessage: `The cluster's deprecation API reported warnings. You can upgrade directly, but you are using deprecated functionality which will be removed in the next major version. The cluster also reported other issues.`,
  },
  otherIssues: {
    id: `deprecations.summary.other`,
    defaultMessage: `The cluster's deprecation API reported issues. No action is required.`,
  },
  goToKibana: {
    id: `deprecations.kibana.use-assistant`,
    defaultMessage: `Migrate your indices to a compatible format with the Upgrade Assistant in {kibana}.`,
  },
  enableKibana: {
    id: `deprecations.kibana.enable`,
    defaultMessage: `{enableKibana} to migrate your indices to a compatible format with the Upgrade Assistant.`,
  },
  enableKibanaText: {
    id: `deprecations.kibana.enable-link-text`,
    defaultMessage: `Enable Kibana`,
  },
})
