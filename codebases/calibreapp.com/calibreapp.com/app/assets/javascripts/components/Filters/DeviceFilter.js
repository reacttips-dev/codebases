import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Filter } from '../Filters'
import { Flex, Box } from '../Grid'
import { DesktopIcon, MobileIcon } from '../Icon'

export const DEVICE_FILTERS = ['all', 'desktop', 'mobile']
const DEVICE_ICONS = {
  all: <></>,
  desktop: <DesktopIcon />,
  mobile: <MobileIcon />
}

const DeviceFilter = ({ currentDeviceFilter, onChange, ...props }) =>
  DEVICE_FILTERS.map(filter => (
    <Filter
      key={filter}
      selected={currentDeviceFilter === filter}
      onClick={() => onChange(filter)}
      {...props}
    >
      <Flex alignItems="center">
        <Box mr="8px" lineHeight={0}>
          {DEVICE_ICONS[filter]}
        </Box>
        <Box>
          <FormattedMessage id={`deviceFilter.${filter}.title`} />
        </Box>
      </Flex>
    </Filter>
  ))

DeviceFilter.defaultProps = {
  currentDeviceFilter: DEVICE_FILTERS[0]
}

export default DeviceFilter
