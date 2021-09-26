import React from 'react'

import { ListItem } from './List'
import { IphoneIcon, ChromeIcon } from './Icon'

import profileMetadata from '../utils/profileMetadata'

const ProfileSummary = ({ children, name, link, isMobile, ...props }) => {
  const meta = profileMetadata(props)

  return (
    <ListItem
      link={link}
      verticalAlign="flex-start"
      title={name}
      preview={isMobile ? <IphoneIcon /> : <ChromeIcon />}
      data-qa={`profileItem`}
      meta={meta}
      actions={children}
      {...props}
    />
  )
}

ProfileSummary.defaultProps = {
  p: 3,
  borderBottomWidth: '1px'
}

export default ProfileSummary
