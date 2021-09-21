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
import { size } from 'lodash'

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiIcon,
  EuiSelect,
  EuiTextColor,
  EuiTitle,
} from '@elastic/eui'

type Props = {
  readOnly: boolean
  hotInstanceConfigurationId?: string
  warmInstanceConfigurationId?: string
  curationConfigurationOptions: Array<{ id: string; name: string }>
  setHotInstanceConfiguration: (instanceConfigurationId: string) => void
  setWarmInstanceConfiguration: (instanceConfigurationId: string) => void
  pristine?: boolean
}

const IndexCurationTargets: FunctionComponent<Props> = ({
  readOnly,
  hotInstanceConfigurationId,
  warmInstanceConfigurationId,
  curationConfigurationOptions,
  setHotInstanceConfiguration,
  setWarmInstanceConfiguration,
  pristine,
}) => {
  if (readOnly) {
    return (
      <EuiTextColor color='subdued'>
        <EuiFlexGroup gutterSize='m' justifyContent='center' alignItems='baseline'>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h3>{hotInstanceConfigurationId}</h3>
            </EuiTitle>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiIcon type='sortRight' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiIcon type='sortRight' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiIcon type='sortRight' />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTitle size='xs'>
              <h3>{warmInstanceConfigurationId}</h3>
            </EuiTitle>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiTextColor>
    )
  }

  const options = [
    {
      value: undefined,
      text: ``,
    },
    ...curationConfigurationOptions.map(({ id, name }) => ({
      value: id,
      text: name,
    })),
  ]

  const same = hotInstanceConfigurationId === warmInstanceConfigurationId
  const invalidHot = same || size(hotInstanceConfigurationId) === 0
  const invalidWarm = same || size(warmInstanceConfigurationId) === 0

  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiFormRow
          label={
            <FormattedMessage id='index-curation-settings.from-label' defaultMessage='Hot node' />
          }
          helpText={
            <FormattedMessage
              id='index-curation-settings.from-help-text'
              defaultMessage='Select where to create new indices'
            />
          }
        >
          <EuiSelect
            onChange={(e) => setHotInstanceConfiguration(e.target.value)}
            value={hotInstanceConfigurationId}
            isInvalid={!pristine && invalidHot}
            options={options}
            fullWidth={true}
            data-test-id='indexCuration-hotInstance'
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiFormRow
          label={
            <FormattedMessage id='index-curation-settings.to-label' defaultMessage='Warm node' />
          }
          helpText={
            <FormattedMessage
              id='index-curation-settings.to-help-text'
              defaultMessage='Select where to move old indices'
            />
          }
        >
          <EuiSelect
            onChange={(e) => setWarmInstanceConfiguration(e.target.value)}
            value={warmInstanceConfigurationId}
            isInvalid={!pristine && invalidWarm}
            options={options}
            fullWidth={true}
            data-test-id='indexCuration-warmInstance'
          />
        </EuiFormRow>
      </EuiFlexItem>
    </EuiFlexGroup>
  )
}

export default IndexCurationTargets
