import React, { useState } from 'react'

import { Dropdown, Text, Icon, Button } from '@invisionapp/helios-one-web'

import styles from '../sidebar/css/select-options.css'

const OPTIONS_PUBLIC = 'All members of $team can access this space'
const OPTIONS_PRIVATE = 'Only people invited can access this space'

const SelectOptions = props => {
  const { isPublic, changeVisibility, teamName } = props

  const [isOpen, setIsOpen] = useState(false)

  const selectedDescription = isPublic
    ? OPTIONS_PUBLIC.replace('$team', teamName)
    : OPTIONS_PRIVATE
  const selectedIcon = isPublic
    ? <Icon name='Team' size='24' color='surface-100' className={styles.iconTeam} isDecorative />
    : <Icon name='Lock' size='24' isDecorative color='surface-100' className={styles.iconLock} />

  const menuItems = [
    {
      iconNode: (<Icon name='Team' size='24' color='surface-100' isDecorative className={styles.iconTeam} />),
      label: OPTIONS_PUBLIC.replace('$team', teamName),
      onClick: () => changeVisibility(true),
      isSelected: isPublic,
      type: 'item'
    },
    {
      iconNode: (<Icon name='Lock' size='24' color='surface-100' isDecorative className={styles.iconLock} />),
      label: OPTIONS_PRIVATE,
      onClick: () => changeVisibility(false),
      isSelected: !isPublic,
      type: 'item'
    }
  ]

  return (
    <Dropdown
      placement='bottom-center'
      className={styles.dropdownContainer}
      domNode={document.body}
      canCloseOnItemClick
      canCloseOnClick
      items={menuItems}
      isOpen={isOpen}
      onChangeVisibility={setIsOpen}
      size='larger'
      aria-label='Change the visibility of the space with these options'
      triggerNode={(
        <Button type='button' order='secondary' size='48' as='span' className={styles.triggerContainer}>
          <div>
            {selectedIcon}
          </div>
          <div className={styles.detailsContainer}>
            <Text color='surface-100' size='body-14'>
              <span className={styles.itemTitle}>
                {selectedDescription}
              </span>
            </Text>
          </div>
          <Icon className={styles.triggerIcon} name={isOpen ? 'NavigateUp' : 'NavigateDown'} size='24' color='surface-100' isDecorative />
        </Button>
      )}
      width={600}
    />
  )
}

export default SelectOptions
