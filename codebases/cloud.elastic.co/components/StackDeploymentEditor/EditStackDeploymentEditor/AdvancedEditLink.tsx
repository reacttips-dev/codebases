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

import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

import { deploymentAdvancedEditUrl } from '../../../lib/urlBuilder'
import { setAdvancedEditInitialState } from '../EditStackDeploymentAdvanced/carryover'

import { StackDeploymentUpdateRequest } from '../../../types'

type Props = {
  editorState: StackDeploymentUpdateRequest
}

const AdvancedEditLink: FunctionComponent<Props> = ({ editorState }) => {
  const { regionId, id, deployment } = editorState

  return (
    <FormattedMessage
      id='stack-deployment-editor.advanced-edit-link'
      defaultMessage='Too advanced to drag sliders? Go to {advancedEdit}.'
      values={{
        advancedEdit: (
          <Link
            to={deploymentAdvancedEditUrl(id)}
            onClick={() => setAdvancedEditInitialState({ regionId, deploymentId: id, deployment })}
          >
            <FormattedMessage
              id='stack-deployment-editor.advanced-edit-text'
              defaultMessage='Advanced Edit'
            />
          </Link>
        ),
      }}
    />
  )
}

export default AdvancedEditLink
