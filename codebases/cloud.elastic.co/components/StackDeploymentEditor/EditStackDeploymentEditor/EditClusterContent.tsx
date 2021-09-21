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

import React, { ComponentType, Fragment, FunctionComponent } from 'react'

import { EuiFormHelpText, EuiFlexGroup, EuiFlexItem } from '@elastic/eui'

import { getEsPlan } from '../../../lib/stackDeployments'
import { isPreDntPlan } from '../../../lib/deployments/deployment'

import AdvancedEditLink from './AdvancedEditLink'
import ClusterEditor from './ClusterEditor'

import { Props as EditClusterFormProps } from './EditClusterForm'
import { Region } from '../../../types'
import { EditEditorComponentConsumerProps } from '../types'
import { InstanceConfiguration } from '../../../lib/api/v1/types'

export type Props = EditClusterFormProps &
  EditEditorComponentConsumerProps & {
    architectureSummary?: ComponentType<any>
    instanceConfigurations: InstanceConfiguration[]
    convertLegacyPlans: boolean
    hideAdvancedEdit: boolean
    hideConfigChangeStrategy: boolean
    region: Region
    regionId: string
  }

const EditClusterContent: FunctionComponent<Props> = ({
  editorState,
  hideAdvancedEdit,
  convertLegacyPlans,
  ...rest
}) => {
  const esPlan = getEsPlan(editorState)!

  /* We can safely use the template based editor when:
   * [1] The environment performs conversion of legacy plans to DNT
   * [2] The pending plan doesn't predate DNT
   */
  const canSafelyUseNewEditor = convertLegacyPlans || !isPreDntPlan(esPlan) // [1] // [2]

  return (
    <Fragment>
      <ClusterEditor
        {...rest}
        editorState={editorState}
        canSafelyUseNewEditor={canSafelyUseNewEditor}
      />

      {hideAdvancedEdit || (
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiFormHelpText>
              <AdvancedEditLink editorState={editorState} />
            </EuiFormHelpText>
          </EuiFlexItem>
        </EuiFlexGroup>
      )}
    </Fragment>
  )
}

export default EditClusterContent
