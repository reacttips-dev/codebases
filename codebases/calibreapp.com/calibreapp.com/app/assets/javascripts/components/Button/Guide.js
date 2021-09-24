import React from 'react'

import { TextLink } from '../Type'
import { GuideIcon } from '../Icon'

const GuideButton = ({ href, children, ...props }) => (
  <TextLink href={href} target="_blank" {...props}>
    <GuideIcon mr="8px" />
    Guide: {children}
  </TextLink>
)

export default GuideButton
