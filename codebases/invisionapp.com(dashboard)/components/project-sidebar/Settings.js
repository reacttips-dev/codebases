import React, { useState } from 'react'
import { Dropdown, IconButton, Icon } from '@invisionapp/helios-one-web'

import styles from './css/settings.css'

const Settings = ({
  deleteProject
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const onDeleteClick = () => {
    deleteProject()
  }

  return (
    <div className={styles.root}>
      <Dropdown
        isOpen={isOpen}
        aria-label='Project settings'
        placement='top-center'
        canCloseOnItemClick
        canCloseOnClickOutside
        canCloseOnEsc
        domNode={document.body}
        onChangeVisibility={setIsOpen}
        triggerNode={
          <IconButton size={32}>
            <Icon name='More' size='24' color='surface-100' aria-label='More' />
          </IconButton>
        }
        items={[
          {
            type: 'item',
            isDestructive: true,
            label: 'Delete project',
            onClick: onDeleteClick
          }
        ]}
      />
    </div>
  )
}

export default Settings
