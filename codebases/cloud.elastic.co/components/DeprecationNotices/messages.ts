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
  deploymentInstances: {
    id: `deprecationNotice.appsearch.deploymentInstances`,
    defaultMessage: `App Search will become Enterprise Search. To upgrade to Elastic Stack 7.7.0 and above, deployments using App Search instances must be migrated.`,
  },
  deploymentTemplate: {
    id: `deprecationNotice.appsearch.deploymentTemplate`,
    defaultMessage: `App Search deployment templates will no longer be available for use with stack pack versions 7.7.0 and above. Users will have to migrate from App Search to Enterprise search.`,
  },
})
