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

import React, { Component, Fragment, ReactNode } from 'react'
import { FormattedMessage } from 'react-intl'

import {
  EuiBadge,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui'
import { ClusterCurationSpec } from '../../../lib/api/v1/types'

import DangerButton from '../../DangerButton'

import IndexCurationTargets from './IndexCurationTargets'
import IndexCurationPatterns from './IndexCurationPatterns'
import IndexCurationAddPatternButton from './IndexCurationAddPatternButton'

import './indexCurationSettings.scss'

type Props = {
  readOnlyIndexCurationTargets: boolean
  indexPatterns: ClusterCurationSpec[]
  curationConfigurationOptions: Array<{ id: string; name: string }>
  hotInstanceConfigurationId?: string
  warmInstanceConfigurationId?: string
  setHotInstanceConfiguration: (id: string) => void
  setWarmInstanceConfiguration: (id: string) => void
  setIndexPatterns: (specs: ClusterCurationSpec[]) => void
  canBeSkipped?: boolean
  skipIndexCuration?: boolean
  onSkip?: () => void
  indexCurationEnabled: boolean
  pristine?: boolean | undefined
  titleSize?: 's' | 'xs'
  templateMode?: boolean
  canBeRemoved?: boolean
}

type State = {
  configureIndexCuration: boolean
}

class IndexCurationSettings extends Component<Props, State> {
  editMode: boolean

  constructor(props) {
    super(props)

    const { hotInstanceConfigurationId, warmInstanceConfigurationId } = props

    if (hotInstanceConfigurationId || warmInstanceConfigurationId) {
      this.editMode = true
    }

    this.state = {
      configureIndexCuration: this.editMode || false,
    }
  }

  render() {
    const { configureIndexCuration } = this.state
    const { titleSize, templateMode } = this.props

    const displayContent = !templateMode || configureIndexCuration
    const displayConfigureButton = !displayContent

    return (
      <div data-test-id='index-curation-settings' className='indexCurationSettings'>
        <EuiTitle size={titleSize ? titleSize : 's'}>
          <label htmlFor='selectCuration'>
            <h5>
              <FormattedMessage
                id='index-curation-settings.title'
                defaultMessage='Index curation'
              />
              <EuiBadge className='indexCurationSettings-deprecated' color='warning'>
                <FormattedMessage
                  id='index-curation-settings.deprecated'
                  defaultMessage='Deprecated'
                />
              </EuiBadge>
            </h5>
          </label>
        </EuiTitle>
        <EuiSpacer size='s' />
        {templateMode && (
          <EuiTitle size='xxxs' textTransform='uppercase' className='ilmSettings-label'>
            <h5>
              <FormattedMessage
                id='index-curation-settings.stack-version'
                defaultMessage='Any stack version'
              />
            </h5>
          </EuiTitle>
        )}

        <EuiText>
          <p>
            <FormattedMessage
              id='index-curation-settings.description'
              defaultMessage='Create the index patterns for new indices on hot nodes and then specify when they should automatically move to warm nodes.'
            />
          </p>
        </EuiText>

        <EuiSpacer />

        {displayConfigureButton && (
          <EuiButton
            color='secondary'
            size='s'
            onClick={() => this.setState({ configureIndexCuration: true })}
          >
            <FormattedMessage
              id='index-lifecycle-management-settings.configure'
              defaultMessage='Configure'
            />
          </EuiButton>
        )}

        {displayContent && this.renderContent()}
      </div>
    )
  }

  renderContent() {
    const {
      readOnlyIndexCurationTargets,
      indexPatterns,
      curationConfigurationOptions,
      hotInstanceConfigurationId,
      warmInstanceConfigurationId,
      setHotInstanceConfiguration,
      setWarmInstanceConfiguration,
      setIndexPatterns,
      skipIndexCuration,
      indexCurationEnabled,
      pristine,
      canBeRemoved,
    } = this.props

    // If ILM is selected
    if (!indexCurationEnabled && skipIndexCuration) {
      return
    }

    return (
      <Fragment>
        <IndexCurationTargets
          pristine={pristine}
          readOnly={readOnlyIndexCurationTargets}
          curationConfigurationOptions={curationConfigurationOptions}
          hotInstanceConfigurationId={hotInstanceConfigurationId}
          warmInstanceConfigurationId={warmInstanceConfigurationId}
          setHotInstanceConfiguration={setHotInstanceConfiguration}
          setWarmInstanceConfiguration={setWarmInstanceConfiguration}
        />

        <EuiSpacer />

        <IndexCurationPatterns indexPatterns={indexPatterns} setIndexPatterns={setIndexPatterns} />

        <EuiSpacer />

        {this.renderActions(
          <EuiFlexGroup gutterSize='m'>
            <EuiFlexItem grow={false}>
              <IndexCurationAddPatternButton onAdd={this.onAddPattern} />
            </EuiFlexItem>
          </EuiFlexGroup>,
        )}
        <EuiSpacer />
        {canBeRemoved && (
          <DangerButton
            size='s'
            buttonType={EuiButtonEmpty}
            onConfirm={this.removeConfiguration}
            color='danger'
            modal={{
              title: (
                <FormattedMessage
                  id='index-curation-settings.remove-config.title'
                  defaultMessage='Remove index curation?'
                />
              ),
              confirmButtonText: (
                <FormattedMessage
                  id='index-curation-settings.remove-config.button-text'
                  defaultMessage='Remove index curation'
                />
              ),
              body: (
                <FormattedMessage
                  id='index-curation-settings.remove-config.body'
                  defaultMessage="Removes the configuration that moves indices between data nodes. Deployments with this template can't use index curation."
                />
              ),
            }}
          >
            <FormattedMessage
              id='index-lifecycle-management-settings.remove-configuration'
              defaultMessage='Remove configuration'
            />
          </DangerButton>
        )}
      </Fragment>
    )
  }

  renderActions(curationActions: ReactNode) {
    return (
      <EuiFlexGroup justifyContent='spaceBetween'>
        <EuiFlexItem grow={false}>{curationActions}</EuiFlexItem>
      </EuiFlexGroup>
    )
  }

  onAddPattern = () => {
    const { indexPatterns, setIndexPatterns } = this.props
    const newIndexPattern = {
      index_pattern: `*`,
      trigger_interval_seconds: 60 * 60 * 24,
    }
    const updatedIndexPatterns = indexPatterns.concat(newIndexPattern)

    setIndexPatterns(updatedIndexPatterns)
  }

  removeConfiguration = () => {
    this.props.onSkip!()
    this.setState({ configureIndexCuration: false })
  }
}

export default IndexCurationSettings
