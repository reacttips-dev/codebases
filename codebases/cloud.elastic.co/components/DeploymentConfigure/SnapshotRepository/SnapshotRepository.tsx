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
import { get, map, size } from 'lodash'
import { Link } from 'react-router-dom'

import {
  EuiSelect,
  EuiSpacer,
  EuiFormLabel,
  EuiFormControlLayout,
  EuiPopover,
  EuiButtonIcon,
} from '@elastic/eui'

import { createSnapshotRepositoryUrl } from '../../../lib/urlBuilder'
import { getEsSettingsFromTemplate } from '../../../lib/stackDeployments/selectors'

import { DeploymentTemplateInfoV2, RepositoryConfig } from '../../../lib/api/v1/types'
import { RegionId } from '../../../types'

interface Props {
  deploymentTemplate?: DeploymentTemplateInfoV2 | null
  snapshotRepositoryId: string | null
  snapshotRepositories: { [repositoryName: string]: RepositoryConfig }
  regionId: RegionId
  setSnapshotRepositoryId: (snapshotRepositoryId: string | null) => void
}

interface State {
  isInfoPopoverOpen: boolean
}

class SnapshotRepository extends Component<Props, State> {
  state = {
    isInfoPopoverOpen: false,
  }

  componentDidMount(): void {
    this.disableSnapshot()
  }

  render(): JSX.Element {
    const { deploymentTemplate } = this.props
    const { snapshotRepositoryId, snapshotRepositories, regionId } = this.props
    const disabled = hasDefaultRepository(deploymentTemplate) || size(snapshotRepositories) === 0

    return (
      <Fragment>
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <Fragment>
              <EuiFormLabel style={{ width: `180px` }}>
                <div>
                  <FormattedMessage
                    defaultMessage='Snapshot repository {icon}'
                    id='select-snapshot-repo-label'
                    values={{
                      icon: (
                        <EuiPopover
                          data-test-id='create-snapshot-repo-popover'
                          anchorPosition='upCenter'
                          ownFocus={true}
                          button={
                            <EuiButtonIcon
                              aria-label='add-snapshot-repo'
                              onClick={() =>
                                this.setState({ isInfoPopoverOpen: !this.state.isInfoPopoverOpen })
                              }
                              iconType='iInCircle'
                            />
                          }
                          isOpen={this.state.isInfoPopoverOpen}
                          closePopover={() => this.setState({ isInfoPopoverOpen: false })}
                        >
                          <FormattedMessage
                            defaultMessage='Back up your data using snapshots. {manageRepo}'
                            id='select-snapshot-repo-info-description'
                            values={{
                              manageRepo: (
                                <Link
                                  data-test-id='createDeployment-snapshotRepoSelect'
                                  to={createSnapshotRepositoryUrl(regionId)}
                                >
                                  <FormattedMessage
                                    id='deployment-configure.no-snapshot-repos-link'
                                    defaultMessage='Manage snapshot repositories'
                                  />
                                </Link>
                              ),
                            }}
                          />
                        </EuiPopover>
                      ),
                    }}
                  />
                </div>
              </EuiFormLabel>
            </Fragment>
          }
        >
          <EuiSelect
            disabled={disabled}
            fullWidth={true}
            data-test-id='createDeployment-snapshotRepoSelect'
            value={snapshotRepositoryId || ``}
            onChange={(e) => this.setSnapshotRepository(e.target.value)}
            options={[
              { value: ``, text: `` },
              ...map(snapshotRepositories, (repo) => ({
                value: repo.repository_name,
                text: `${repo.repository_name} (${repo.config.type})`,
              })),
            ]}
          />

          <EuiSpacer size='m' />
        </EuiFormControlLayout>
      </Fragment>
    )
  }

  toggleSnapshots = (): void => {
    this.disableSnapshot()
  }

  disableSnapshot(): void {
    this.props.setSnapshotRepositoryId(null)
  }

  setSnapshotRepository(repoName: string): void {
    const { setSnapshotRepositoryId } = this.props

    if (repoName === ``) {
      return this.disableSnapshot()
    }

    setSnapshotRepositoryId(repoName)
  }
}

function hasDefaultRepository(deploymentTemplate) {
  const settings = getEsSettingsFromTemplate({
    deploymentTemplate: deploymentTemplate?.deployment_template,
  })
  return Boolean(get(settings, [`snapshot`, `repository`, `reference`, `repository_name`]))
}

export default SnapshotRepository
