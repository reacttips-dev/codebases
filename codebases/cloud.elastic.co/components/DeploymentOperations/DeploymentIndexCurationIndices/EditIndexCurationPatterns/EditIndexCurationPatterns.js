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
import jif from 'jif'
import { get } from 'lodash'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText, EuiTitle } from '@elastic/eui'

import { CuiAlert } from '../../../../cui'

import SpinButton from '../../../SpinButton'
import ClusterLockingGate from '../../../ClusterLockingGate'
import ClusterLocked from '../../../ClusterLockingGate/ClusterLocked'

import IndexCurationPatterns from '../../../Topology/IndexCuration/IndexCurationPatterns'
import IndexCurationAddPatternButton from '../../../Topology/IndexCuration/IndexCurationAddPatternButton'

import { isCurationEnabled } from '../../../../lib/curation'

class EditIndexCurationPatterns extends Component {
  state = {
    indexPatterns: this.getInitialIndexPatterns(),
  }

  componentWillUnmount() {
    const {
      resetUpdateIndexPatternsRequest,
      cluster: { regionId, id },
    } = this.props

    resetUpdateIndexPatternsRequest(regionId, id)
  }

  render() {
    const { indexPatterns } = this.state
    const {
      cluster,
      cluster: { regionId, id: deploymentId },
      updateIndexPatterns,
      updateIndexPatternsRequest,
    } = this.props

    const enabled = isCurationEnabled(cluster)

    if (!enabled) {
      return null
    }

    return (
      <ClusterLockingGate onLocked={() => <ClusterLocked />}>
        <Fragment>
          <EuiTitle>
            <h3>
              <FormattedMessage
                id='cluster-manage-index.index-curation'
                defaultMessage='Index Curation Patterns'
              />
            </h3>
          </EuiTitle>

          <EuiText>
            <p>
              <FormattedMessage
                id='index-curation-settings.further-description'
                defaultMessage='Creates new indices on hot nodes first and moves them to warm nodes later on, based on the index patterns you specify. Index curation manages replica counts for you, so that all shards of an index can fit on the right data nodes.'
              />
            </p>
          </EuiText>

          <EuiSpacer size='m' />

          <IndexCurationPatterns
            indexPatterns={indexPatterns}
            setIndexPatterns={(patterns) => this.setIndexPatterns(patterns)}
          />

          <EuiSpacer size='m' />

          <EuiFlexGroup gutterSize='s'>
            <EuiFlexItem grow={false}>
              <IndexCurationAddPatternButton onAdd={this.onAddPattern} />
            </EuiFlexItem>

            <EuiFlexItem grow={false}>
              <SpinButton
                color='primary'
                fill={true}
                onClick={() =>
                  updateIndexPatterns({
                    regionId,
                    deploymentId,
                    indexPatterns,
                  })
                }
                spin={updateIndexPatternsRequest.inProgress}
              >
                <FormattedMessage
                  id='cluster-manage-index-curation.save-patterns'
                  defaultMessage='Save'
                />
              </SpinButton>
            </EuiFlexItem>
          </EuiFlexGroup>

          {jif(updateIndexPatternsRequest.error, () => (
            <Fragment>
              <EuiSpacer size='m' />
              <CuiAlert type='error'>{updateIndexPatternsRequest.error}</CuiAlert>
            </Fragment>
          ))}

          <EuiSpacer />
        </Fragment>
      </ClusterLockingGate>
    )
  }

  onAddPattern = () => {
    const { indexPatterns } = this.state
    const newIndexPattern = {
      index_pattern: `*`,
      trigger_interval_seconds: 60 * 60 * 24,
    }
    const updatedIndexPatterns = indexPatterns.concat(newIndexPattern)
    this.setIndexPatterns(updatedIndexPatterns)
  }

  getInitialIndexPatterns() {
    const {
      cluster: { curation },
    } = this.props
    return get(curation.settings, [`specs`], [])
  }

  setIndexPatterns(indexPatterns) {
    this.setState({ indexPatterns })
  }
}

export default EditIndexCurationPatterns
