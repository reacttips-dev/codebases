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

import { EuiFormLabel, EuiFormControlLayout, EuiComboBox, EuiToolTip } from '@elastic/eui'

import { withErrorBoundary } from '../../../../cui'
import { getRegionDisplayName } from '../../../../lib/region'

import { Region } from '../../../../lib/api/v1/types'

import './selectRegion.scss'

type Props = {
  regionId: string | null
  availableRegions: Region[] | null
  onChange: (regionId: string) => void
  restoreFromSnapshot: boolean
  loading?: boolean
  disabled?: boolean
}

class SelectRegion extends Component<Props> {
  render() {
    const { restoreFromSnapshot } = this.props

    return (
      <Fragment>
        <EuiFormControlLayout
          fullWidth={true}
          prepend={
            <EuiFormLabel style={{ width: `180px` }}>
              <FormattedMessage defaultMessage='Region' id='select-region-label' />
            </EuiFormLabel>
          }
        >
          {restoreFromSnapshot ? (
            <EuiToolTip
              anchorClassName='region-disabled-tooltip'
              position='top'
              content={
                <FormattedMessage
                  defaultMessage='You cannot change the region as you are restoring data from a snapshot.'
                  id='select-region-disabled-tooltip'
                />
              }
            >
              {this.renderComboBox()}
            </EuiToolTip>
          ) : (
            this.renderComboBox()
          )}
        </EuiFormControlLayout>
      </Fragment>
    )
  }

  renderComboBox() {
    const { regionId, availableRegions, onChange, restoreFromSnapshot, loading, disabled } =
      this.props
    const regionOptions =
      availableRegions &&
      availableRegions.map((region) => ({
        label: getRegionDisplayName({ region }),
        value: region.identifier,
      }))

    const selectedValue = availableRegions?.find((region) => region.identifier === regionId)

    const selectedName = getRegionDisplayName({ region: selectedValue })
    const isDisabled = disabled || restoreFromSnapshot

    return (
      <EuiComboBox
        fullWidth={true}
        options={regionOptions!}
        selectedOptions={[{ label: selectedName }]}
        onChange={(newRegion) => onChange(newRegion[0].value!)}
        singleSelection={{ asPlainText: true }}
        isDisabled={isDisabled}
        isClearable={false}
        isLoading={loading}
        data-test-id='region-combobox'
      />
    )
  }
}

export default withErrorBoundary(SelectRegion)
