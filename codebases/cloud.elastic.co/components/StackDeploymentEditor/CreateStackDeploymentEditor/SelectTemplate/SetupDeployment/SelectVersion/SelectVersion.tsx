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

import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom'

import { EuiSpacer, EuiFormControlLayout, EuiFormLabel } from '@elastic/eui'

import { CuiAlert } from '../../../../../../cui'

import { isPrerelease } from '../../../../../DeploymentConfigure/EsVersion/groupVersions'

import { isIncompatibleVersionForGlobalTemplate } from '../../../../../../lib/globalDeploymentTemplates'
import { elasticStackVersionsUrl } from '../../../../../../lib/urlBuilder'

import SelectVersionComboBox from './SelectVersionComboBox'

import {
  RegionId,
  VersionNumber,
  StackDeploymentCreateRequest,
  AsyncRequestState,
} from '../../../../../../types'

export type Props = {
  availableVersions: VersionNumber[]
  whitelistedVersions: VersionNumber[]
  setVersion: (version: VersionNumber) => void
  version: VersionNumber
  disabled?: boolean
  regionId: RegionId
  editorState: StackDeploymentCreateRequest
  fetchVersionsRequest: AsyncRequestState
}

class SelectVersion extends Component<Props> {
  render() {
    const {
      version,
      availableVersions,
      whitelistedVersions,
      disabled,
      regionId,
      editorState: { globalDeploymentTemplate },
      fetchVersionsRequest,
    } = this.props

    return (
      <Fragment>
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <EuiFormLabel style={{ width: `180px` }}>
              <FormattedMessage defaultMessage='Version' id='select-version-label' />
            </EuiFormLabel>
          }
        >
          <SelectVersionComboBox
            key='select-version'
            version={version}
            availableVersions={availableVersions}
            whitelistedVersions={whitelistedVersions}
            id='select-version-for-template'
            onUpdate={this.onChangeVersion}
            checkVersionDisabled={(v) =>
              isIncompatibleVersionForGlobalTemplate(globalDeploymentTemplate!, v)
            }
            disabled={disabled}
          />
        </EuiFormControlLayout>

        {!fetchVersionsRequest.inProgress && isEmpty(availableVersions) && (
          <CuiAlert type='warning'>
            <FormattedMessage
              id='stack-deployment-editor-setup-deployment.no-stack-versions'
              defaultMessage='Could not find any Elasticsearch versions. You need to {addVersion} before you can create a deployment.'
              values={{
                addVersion: (
                  <Link to={elasticStackVersionsUrl(regionId)}>
                    <FormattedMessage
                      id='stack-deployment-editor-setup-deployment.add-an-stack-version'
                      defaultMessage='add an Elasticsearch version'
                    />
                  </Link>
                ),
              }}
            />
          </CuiAlert>
        )}

        {isPrerelease(version) && (
          <Fragment>
            <EuiSpacer size='s' />

            <CuiAlert size='s' type='warning'>
              <FormattedMessage
                id='VersionRadio.prerelease-versions-warning'
                defaultMessage='This is a pre-release version of the Elastic Stack that we make available for testing. Do not use for production workloads. You will not be able to upgrade from this pre-release version.'
              />
            </CuiAlert>
          </Fragment>
        )}
      </Fragment>
    )
  }

  onChangeVersion = (version: VersionNumber) => {
    const { setVersion } = this.props

    setVersion(version)
  }
}

export default SelectVersion
