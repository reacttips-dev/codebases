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
  loading: {
    id: `manage-traffic-filters.loading`,
    defaultMessage: `Loading …`,
  },
  regionLabel: {
    id: `manage-traffic-filters.region-label`,
    defaultMessage: `Region`,
  },
  editRuleset: {
    id: `manage-traffic-filters.edit-ruleset-aria`,
    defaultMessage: `Edit ruleset`,
  },
  deleteRuleset: {
    id: `manage-traffic-filters.delete-ruleset-aria`,
    defaultMessage: `Delete ruleset`,
  },
  rulesetTypeLabel: {
    id: `manage-traffic-filters.filter-type`,
    defaultMessage: `Filter type`,
  },
  awsVpceLabel: {
    id: `manage-traffic-filters.filter-type-vpce`,
    defaultMessage: `Virtual private cloud`,
  },
  azureVnetLabel: {
    id: `manage-traffic-filters.filter-type-vnet`,
    defaultMessage: `Virtual network`,
  },
  ipFilteringLabel: {
    id: `manage-traffic-filters.filter-type-ip-filter`,
    defaultMessage: `IP filter`,
  },
  deleteSuccessTitle: {
    id: `manage-traffic-filters.delete-success-title`,
    defaultMessage: `{ruleType} deleted`,
  },
  deleteSuccessText: {
    id: `manage-traffic-filters.delete-success-text`,
    defaultMessage: `The {ruleType} {name} has been successfully deleted.`,
  },
  deleteFailedTitle: {
    id: `manage-traffic-filters.delete-failed-title`,
    defaultMessage: `{ruleType} delete failed`,
  },
  deleteFailedText: {
    id: `manage-traffic-filters.delete-failed-text`,
    defaultMessage: `The {ruleType} {name} couldn't be deleted.`,
  },
  rulesetInUse: {
    id: `manage-traffic-filters.ruleset-in-use`,
    defaultMessage: `The {ruleType} {name} can't be deleted because it's currently in use.`,
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
    id: `manage-traffic-filters.endpoint-in-title`,
    defaultMessage: `Endpoint`,
  },
  endpointInText: {
    id: `manage-traffic-filters.endpoint-in-text`,
    defaultMessage: `endpoint`,
  },
  ipFilterInTitle: {
    id: `manage-traffic-filters.ip-filter-in-title`,
    defaultMessage: `IP filter`,
  },
  ipFilterInText: {
    id: `manage-traffic-filters.ip-filter-in-text`,
    defaultMessage: `IP filter`,
  },
  includedByDefaultDescription: {
    id: `manage-traffic-filters.included-by-default-description`,
    defaultMessage: `Included in deployments by default`,
  },
})

export default messages
