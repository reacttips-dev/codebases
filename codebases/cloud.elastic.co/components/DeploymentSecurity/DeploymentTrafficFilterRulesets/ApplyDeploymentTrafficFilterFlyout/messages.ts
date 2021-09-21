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
  applyTrafficFilter: {
    id: `apply-deployment-traffic-filter-flyout.create-title`,
    defaultMessage: `Apply traffic filter`,
  },
  applyTrafficFilterAction: {
    id: `apply-deployment-traffic-filter-flyout.create-action`,
    defaultMessage: `Apply filter`,
  },
  closeFlyout: {
    id: `apply-deployment-traffic-filter-flyout.close-flyout`,
    defaultMessage: `Close`,
  },
  saveAssociationSuccessTitle: {
    id: `apply-deployment-traffic-filter-flyout.save-association-success-title`,
    defaultMessage: `{ruleType} applied`,
  },
  saveAssociationSuccessText: {
    id: `apply-deployment-traffic-filter-flyout.save-association-success-text`,
    defaultMessage: `The {ruleType} {name} has been successfully applied.`,
  },
  resourceInTitle: {
    id: `manage-traffic-filters.resource-in-title`,
    defaultMessage: `Resource`,
  },
  resourceInText: {
    id: `manage-traffic-filters.resource-in-text`,
    defaultMessage: `resource`,
  },
  endpointInTitle: {
    id: `apply-deployment-traffic-filter-flyout.endpoint-in-title`,
    defaultMessage: `Endpoint`,
  },
  endpointInText: {
    id: `apply-deployment-traffic-filter-flyout.endpoint-in-text`,
    defaultMessage: `endpoint`,
  },
  ipFilterInTitle: {
    id: `apply-deployment-traffic-filter-flyout.ip-filter-in-title`,
    defaultMessage: `IP filter`,
  },
  ipFilterInText: {
    id: `apply-deployment-traffic-filter-flyout.ip-filter-in-text`,
    defaultMessage: `IP filter`,
  },
})

export default messages
