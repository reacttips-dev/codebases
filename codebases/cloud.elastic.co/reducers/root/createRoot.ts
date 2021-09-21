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

import { RootHrefs } from '../../types/root'

export default function createRootHrefs(
  hrefs: { [key: string]: string },
  rootUrl: string,
): RootHrefs {
  const regions = hrefs.regions

  const region = `${regions}/{regionId}`
  const sudo = `${rootUrl}/user/sudo`

  return {
    ...hrefs,
    region,
    'current-user': `${rootUrl}/user`,
    'accept-eula': `${rootUrl}/user/eula/_accept`,
    'phone-home-config': `${rootUrl}/regions/ece-region/phone-home/config`,
    'phone-home-data': `${rootUrl}/regions/ece-region/phone-home/data`,
    sudo: `${sudo}/_auth`,
    'drop-sudo': `${sudo}/_drop`,
    'enable-two-factor': `${sudo}/_setup`,
    'refresh-token': `${rootUrl}/refresh_token`,
  }
}
