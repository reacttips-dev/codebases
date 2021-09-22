/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React from 'react'
import { Dropdown, IconButton } from '@invisionapp/helios'
import { Settings as SettingsIcon } from '@invisionapp/helios/icons'

import styles from '../../css/project-prototype/settings.css'

const Settings = ({ deleteProject }) => {
  return (
    <div className={styles.root}>
      <Dropdown
        aria-label='Project Settings'
        closeOnClick
        items={[{
          destructive: true,
          label: 'Delete Project',
          onClick: deleteProject,
          type: 'item'
        }]}
        placement='top'
        align='center'
        trigger={(
          <IconButton withTooltip tooltip='Settings'>
            <SettingsIcon size={24} />
          </IconButton>
        )}
        unstyledTrigger
      />
    </div>
  )
}

export default Settings
