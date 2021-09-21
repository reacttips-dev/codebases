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
import React, { Fragment, FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'

import { get } from 'lodash'

import { EuiSpacer, EuiText } from '@elastic/eui'

import { CuiLink } from '../../../../cui'

import IndexCurationTargets from '../../../Topology/IndexCuration/IndexCurationTargets'
import SectionHeader from '../../../Topology/DeploymentTemplates/components/SectionHeader'

import { getEsPlan } from '../../../../lib/stackDeployments'

import { couldHaveCuration, getCurationConfigurationOptions } from '../../../../lib/curation'
import { categorizeTopologies } from '../../../../lib/deployments/nodeTypes'
import { indexCurationUrl, operationsUrl } from '../../../../lib/urlBuilder'

import { getConfigForKey } from '../../../../store'

import { InstanceConfiguration } from '../../../../lib/api/v1/types'
import { StackDeploymentUpdateRequest } from '../../../../types'

type Props = {
  editorState: StackDeploymentUpdateRequest
  onChange: (path: string[], value: any) => void
  instanceConfigurations: InstanceConfiguration[]
  readOnlyIndexCurationTargets: boolean
}

const hotPath = [`elasticsearch`, `curation`, `from_instance_configuration_id`]
const warmPath = [`elasticsearch`, `curation`, `to_instance_configuration_id`]

const EditIndexCuration: FunctionComponent<Props> = ({
  editorState,
  onChange,
  instanceConfigurations,
  readOnlyIndexCurationTargets,
}) => {
  const { id, deployment } = editorState
  const esPlan = getEsPlan({ deployment })

  const { data: dataNodeConfigurations } = categorizeTopologies(esPlan?.cluster_topology || [])

  const couldCurate = couldHaveCuration({
    dataNodeConfigurations,
    instanceConfigurations,
  })

  if (!couldCurate) {
    return null
  }

  const curationConfigurationOptions = getCurationConfigurationOptions({
    dataNodeConfigurations,
    instanceConfigurations,
  })

  const hotInstanceConfigurationId = get(esPlan, hotPath)
  const warmInstanceConfigurationId = get(esPlan, warmPath)
  const setHotInstanceConfiguration = (someId) => onChange(hotPath, someId)
  const setWarmInstanceConfiguration = (someId) => onChange(warmPath, someId)

  const editIndexPatternsUrl =
    getConfigForKey(`APP_NAME`) === `userconsole` ? indexCurationUrl(id) : operationsUrl(id)

  return (
    <Fragment>
      <SectionHeader
        icon='indexManagementApp'
        title={
          <FormattedMessage id='index-curation-settings.title' defaultMessage='Index curation' />
        }
      />
      <EuiText>
        <FormattedMessage
          id='index-curation-settings.sub-text'
          defaultMessage='The index curation migrates data between these nodes. {editPatterns}.'
          values={{
            editPatterns: (
              <CuiLink to={editIndexPatternsUrl}>
                <FormattedMessage
                  id='index-curation-settings.editPatternBtn'
                  defaultMessage='Edit index patterns'
                />
              </CuiLink>
            ),
          }}
        />
      </EuiText>

      <EuiSpacer size='m' />

      <IndexCurationTargets
        readOnly={readOnlyIndexCurationTargets}
        curationConfigurationOptions={curationConfigurationOptions}
        hotInstanceConfigurationId={hotInstanceConfigurationId}
        warmInstanceConfigurationId={warmInstanceConfigurationId}
        setHotInstanceConfiguration={setHotInstanceConfiguration}
        setWarmInstanceConfiguration={setWarmInstanceConfiguration}
      />

      <EuiSpacer size='m' />
    </Fragment>
  )
}

export default EditIndexCuration
