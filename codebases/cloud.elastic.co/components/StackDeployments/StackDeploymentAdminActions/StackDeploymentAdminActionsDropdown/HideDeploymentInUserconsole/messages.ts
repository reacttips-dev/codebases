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
  feedbackCompletedTesting: {
    id: `deployment-shut-down-and-hide-deployment.feedback-completed-testing`,
    defaultMessage: `Completed testing, not needed`,
  },
  feedbackConsolidating: {
    id: `deployment-shut-down-and-hide-deployment.feedback-consolidating-accounts`,
    defaultMessage: `Consolidating accounts`,
  },
  feedbackTooExpensive: {
    id: `deployment-shut-down-and-hide-deployment.feedback-too-expensive`,
    defaultMessage: `Too expensive`,
  },
  feedbackDeploymentStability: {
    id: `deployment-shut-down-and-hide-deployment.feedback-deployment-stability`,
    defaultMessage: `Deployment stability issues`,
  },
  feedbackSupport: {
    id: `deployment-shut-down-and-hide-deployment.feedback-support`,
    defaultMessage: `Not satisfied with support`,
  },
  feedbackDocumentation: {
    id: `deployment-shut-down-and-hide-deployment.feedback-documentation`,
    defaultMessage: `Documentation lacking`,
  },
  feedbackOther: {
    id: `deployment-shut-down-and-hide-deployment.feedback-other`,
    defaultMessage: `Other`,
  },
})

export default messages
