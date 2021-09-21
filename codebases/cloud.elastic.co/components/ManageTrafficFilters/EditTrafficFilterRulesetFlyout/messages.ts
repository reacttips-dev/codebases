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
  createTrafficFilter: {
    id: `edit-traffic-filter-ruleset-flyout.create-title`,
    defaultMessage: `Create traffic filter`,
  },
  createTrafficFilterAction: {
    id: `edit-traffic-filter-ruleset-flyout.create-action`,
    defaultMessage: `Create filter`,
  },
  createSuccessTitle: {
    id: `edit-traffic-filter-ruleset-flyout.create-success-title`,
    defaultMessage: `{ruleType} created`,
  },
  createSuccessText: {
    id: `edit-traffic-filter-ruleset-flyout.create-success-text`,
    defaultMessage: `The {ruleType} {name} has been successfully created.`,
  },
  updateSuccessTitle: {
    id: `edit-traffic-filter-ruleset-flyout.update-success-title`,
    defaultMessage: `{ruleType} updated`,
  },
  updateSuccessText: {
    id: `edit-traffic-filter-ruleset-flyout.update-success-text`,
    defaultMessage: `The {ruleType} {name} has been successfully updated.`,
  },
  endpointInTitle: {
    id: `edit-traffic-filter-ruleset-flyout.endpoint-in-title`,
    defaultMessage: `Endpoint`,
  },
  endpointInText: {
    id: `edit-traffic-filter-ruleset-flyout.endpoint-in-text`,
    defaultMessage: `endpoint`,
  },
  resourceInTitle: {
    id: `edit-traffic-filter-ruleset-flyout.resource-in-title`,
    defaultMessage: `Resource`,
  },
  resourceInText: {
    id: `edit-traffic-filter-ruleset-flyout.resource-in-text`,
    defaultMessage: `resource`,
  },
  vnetNamePlaceholder: {
    id: `edit-traffic-filter-ruleset-flyout.vnet-name-placeholder`,
    defaultMessage: `e.g. my-azure-virtual-net`,
  },
  vnetIdPlaceholder: {
    id: `edit-traffic-filter-ruleset-flyout.vnet-id-placeholder`,
    defaultMessage: `e.g. 17d9ae7c-5dbf-4bd1-b171-722ff7ac7c7e`,
  },
  endpointPlaceholder: {
    id: `edit-traffic-filter-ruleset-flyout.endpoint-placeholder`,
    defaultMessage: `e.g. vpce-08483d209354fa`,
  },
  ipFilterInTitle: {
    id: `edit-traffic-filter-ruleset-flyout.ip-filter-in-title`,
    defaultMessage: `IP filter`,
  },
  ipFilterInText: {
    id: `edit-traffic-filter-ruleset-flyout.ip-filter-in-text`,
    defaultMessage: `IP filter`,
  },
  editTrafficFilter: {
    id: `edit-traffic-filter-ruleset-flyout.edit-title`,
    defaultMessage: `Edit traffic filter`,
  },
  editVpceTrafficFilter: {
    id: `edit-traffic-filter-ruleset-flyout.edit-vpce-title`,
    defaultMessage: `Virtual private cloud endpoint`,
  },
  editVnetTrafficFilter: {
    id: `edit-traffic-filter-ruleset-flyout.edit-vnet-title`,
    defaultMessage: `Virtual network endpoint`,
  },
  editIpTrafficFilter: {
    id: `edit-traffic-filter-ruleset-flyout.edit-ip-title`,
    defaultMessage: `IP filtering rule set`,
  },
  selectFilterTypeEndpoint: {
    id: `edit-traffic-filter-ruleset-flyout.select-endpoint-filter-type`,
    defaultMessage: `Private link endpoint`,
  },
  selectFilterTypeIpAddress: {
    id: `edit-traffic-filter-ruleset-flyout.select-ip-filter-type`,
    defaultMessage: `IP filtering rule set`,
  },
  editTrafficFilterAction: {
    id: `edit-traffic-filter-ruleset-flyout.edit-action`,
    defaultMessage: `Update filter`,
  },
  cancelEditing: {
    id: `edit-traffic-filter-ruleset-flyout.cancel-editing`,
    defaultMessage: `Cancel`,
  },
  includeByDefault: {
    id: `edit-traffic-filter-ruleset-flyout.include-by-default`,
    defaultMessage: `Include by default`,
  },
  addAnotherRule: {
    id: `edit-traffic-filter-ruleset-flyout.add-another-rule`,
    defaultMessage: `Add another rule`,
  },
  removeThisRule: {
    id: `edit-traffic-filter-ruleset-flyout.remove-this-rule`,
    defaultMessage: `Remove this rule`,
  },
  selectCloudProvider: {
    id: `edit-traffic-filter-ruleset-flyout.select-cloud-provider`,
    defaultMessage: `Select your cloud provider`,
  },
  privateLinkUnsupported: {
    id: `edit-traffic-filter-ruleset-flyout.private-link-unsupported-in-this-cloud-provider`,
    defaultMessage: `Private link traffic filters are not supported in {cloudProviderTitle} yet.`,
  },
})

export default messages
