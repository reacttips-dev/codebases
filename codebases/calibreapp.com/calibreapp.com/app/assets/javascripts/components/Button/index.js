import React from 'react'

import {
  PlusIcon,
  TrashIcon,
  CustomiseIcon,
  ExportIcon,
  OpenIcon
} from '../Icon'
import Text, { TextLink } from '../Type'

import Button from './Button'

export const AddButton = props => (
  <Button variant="tertiary" icon={<PlusIcon />} {...props} />
)

export const RemoveButton = props => (
  <Button variant="tertiary" icon={<TrashIcon />} {...props} />
)

export const CustomiseButton = props => (
  <Button variant="tertiary" icon={<CustomiseIcon />} {...props} />
)

export const ExportButton = props => (
  <Button variant="tertiary" icon={<ExportIcon />} {...props} />
)

export const ExternalLinkButton = ({ children, level, as, ...props }) => (
  <Text as={as} lineHeight="1" level={level}>
    <TextLink target="_blank" {...props}>
      {children}
      <OpenIcon
        height={level === 'xs' ? 11 : 14}
        width={level === 'xs' ? 11 : 14}
        mt={level === 'xs' ? '-3px' : '-2px'}
        ml={level === 'xs' ? '4px' : '8px'}
        verticalAlign="middle"
      />
    </TextLink>
  </Text>
)
ExternalLinkButton.defaultProps = {
  as: 'span',
  level: 'sm'
}

export { default as TextButton } from './TextButton'
export { default as SortButton } from './SortButton'
export { default as ToggleButton } from './Toggle'
export { default as GuideButton } from './Guide'

export default Button
