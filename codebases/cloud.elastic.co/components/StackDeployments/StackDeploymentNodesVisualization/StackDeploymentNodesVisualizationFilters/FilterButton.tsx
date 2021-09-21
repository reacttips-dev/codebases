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
import {
  EuiBadge,
  EuiFilterButton,
  EuiFilterSelectItem,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
} from '@elastic/eui'
import React, { useState, FunctionComponent, ReactNode } from 'react'

import { NodesVisualizationFilters } from '../../../../types'

type FilterKey = keyof NodesVisualizationFilters

export type FilterOption = {
  id: string
  label: ReactNode
  isEnabled: boolean
  count: number
  value?: any
}

export interface Props {
  filterKey: FilterKey
  hasActiveFilters: boolean
  buttonText: ReactNode
  filterOptions: FilterOption[]
  toggleFilter: (filterKey: FilterKey, value?: any) => void
}

export const FilterButton: FunctionComponent<Props> = ({
  filterKey,
  hasActiveFilters,
  buttonText,
  filterOptions,
  toggleFilter,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  return (
    <EuiPopover
      id={`StackDeploymentNodesVisualizationFilters.${filterKey}-popover`}
      button={
        <EuiFilterButton
          data-test-id={`StackDeploymentNodesVisualizationFilters.${filterKey}-popoverButton`}
          iconType='arrowDown'
          onClick={() => setPopoverOpen(!isPopoverOpen)}
          isSelected={isPopoverOpen}
          hasActiveFilters={hasActiveFilters}
        >
          {buttonText}
        </EuiFilterButton>
      }
      panelPaddingSize='none'
      isOpen={isPopoverOpen}
      closePopover={() => setPopoverOpen(false)}
      ownFocus={true}
    >
      <div className='euiFilterSelect__items'>
        {filterOptions.map(({ id, label, count, value, isEnabled }) => (
          <EuiFilterSelectItem
            data-test-id={`filter-${filterKey}-${id}`}
            key={id}
            checked={isEnabled ? 'on' : undefined}
            onClick={() => {
              setPopoverOpen(false)
              toggleFilter(filterKey, value)
            }}
          >
            <EuiFlexGroup gutterSize='s' justifyContent='spaceBetween' responsive={false}>
              <EuiFlexItem grow={false}>{label}</EuiFlexItem>

              <EuiFlexItem grow={false}>
                <EuiBadge color='hollow'>{count}</EuiBadge>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFilterSelectItem>
        ))}
      </div>
    </EuiPopover>
  )
}
