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

import { ReactElement, FunctionComponent } from 'react'

import { getValidationWarnings } from '../../lib/dryRunWarnings'

import { AsyncRequestState } from '../../types'

import { BasicFailedReply, ReplyWarning } from '../../lib/api/v1/types'

type Props = {
  updateDeploymentDryRunRequest: AsyncRequestState
  ignoreSecurityRealmWarnings?: boolean
  children: (params: { dryRunWarnings: ReplyWarning[]; dryRunCheckPassed: boolean }) => ReactElement
}

const StackDeploymentUpdateDryRunWarningCheck: FunctionComponent<Props> = ({
  updateDeploymentDryRunRequest,
  ignoreSecurityRealmWarnings,
  children,
}) => {
  const dryRunCheckPassed = passedDryRunCheck({
    updateDeploymentDryRunRequest,
    ignoreSecurityRealmWarnings,
  })

  const dryRunWarnings = getValidationWarnings({
    updateDeploymentDryRunRequest,
    ignoreSecurityRealmWarnings,
  })

  return children({ dryRunWarnings, dryRunCheckPassed })
}

export default StackDeploymentUpdateDryRunWarningCheck

function passedDryRunCheck({
  updateDeploymentDryRunRequest,
  ignoreSecurityRealmWarnings,
}: {
  updateDeploymentDryRunRequest: AsyncRequestState
  ignoreSecurityRealmWarnings?: boolean
}): boolean {
  if (updateDeploymentDryRunRequest.inProgress) {
    return false
  }

  if (updateDeploymentDryRunRequest.error) {
    const body = (updateDeploymentDryRunRequest.error as any).body as BasicFailedReply

    if (body) {
      const { errors } = body

      /* During major deployment upgrades, Security Realm warnings are expected in dry run validation.
       * The DeploymentVersionUpgradeModal component offers a way for the user to resolve conflicts and
       * submit a valid plan.
       * If their submission fails, they'll be met with these errors anyways.
       */
      if (errors && ignoreSecurityRealmWarnings) {
        return errors.every((error) => error.message.startsWith(`'xpack.security.authc.realms`))
      }
    }

    return false
  }

  return true
}
