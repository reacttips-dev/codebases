import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Dropdown, Text, DocumentIcon } from '@invisionapp/helios'
import { InVision } from '@invisionapp/helios/icons'

import {
  FILTER_ARCHIVED_ONLY,
  FILTER_CREATED_BY_ANYONE,
  FILTER_CREATED_BY_ME
} from '../../constants/FilterTypes'

import styles from '../../css/filter-dropdown.css'

const FreehandXFilterDropdown = ({
  align,
  name,
  onSelect,
  options,
  selected,
  externalDocConfig,
  externalDocFilterEntries,
  isSearch,
  useName,
  mqs
}) => {
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (options) {
      setFilteredOptions(options)
    }
  }, [options])

  const selectItem = idx => {
    onSelect(idx)
  }

  const toggleVisibility = () => {
    setIsOpen(!isOpen)
  }

  const getDocumentIcon = name => {
    const dictionary = {
      'All types': 'all-types',
      'InVision': 'invision'
    }
    return dictionary[name]
  }

  const getDropdownText = () => {
    const thirdpartyDocsSelectedTitle = externalDocFilterEntries && externalDocFilterEntries[selected] ? externalDocFilterEntries[selected].parentTitle ? `${externalDocFilterEntries[selected].parentTitle} ${externalDocFilterEntries[selected].title}` : externalDocFilterEntries[selected].title : ''
    let selectedDisplayValue = selected

    const dictionary = {
      'team': FILTER_CREATED_BY_ANYONE,
      'user': FILTER_CREATED_BY_ME
    }

    if (selected === `team` || selected === `user`) {
      selectedDisplayValue = dictionary[selected]
    }

    return thirdpartyDocsSelectedTitle !== '' ? thirdpartyDocsSelectedTitle : selectedDisplayValue
  }

  const getFreehandXOptions = () => {
    const externalDocTypes = (externalDocConfig &&
      externalDocConfig.filterExtResourceConfigs ? externalDocConfig.filterExtResourceConfigs.flat().map(externalType => {
        const typeKey = externalType.id

        return {
          onClick: !externalType.children && (() => selectItem(externalType.id)),
          selected: !externalType.children && typeKey === selected,
          label: externalType.title,
          icon: <DocumentIcon size='16' src={externalType.logoSrc} title={externalType.title} />,
          type: 'item',
          items: externalType.children ? externalType.children.flat().map(subType => (
            {
              label: subType.title,
              icon: <DocumentIcon size='16' src={subType.logoSrc} title={subType.title} />,
              selected: subType.id === selected,
              onClick: () => {
                selectItem(subType.id)
                toggleVisibility()
              },
              type: 'item'
            }
          )) : null
        }
      }) : [])

    const invisionDocType = filteredOptions.map((item, idx) => {
      const IconComponent = item.name.toLowerCase() === 'invision'
        ? <InVision size={16} className={`${styles.icon} ${styles.invisionIcon}`} />
        : <DocumentIcon size='16' documentType={getDocumentIcon(item.name)} className={styles.icon} />
      return ({
        onClick: () => selectItem(useName ? item.name : idx),
        selected: item.name === selected,
        label: item.name,
        icon: name === 'typeFilter' && getDocumentIcon(item.name) && IconComponent,
        type: 'item'
      })
    })

    const freehandXOptions = invisionDocType.concat(externalDocTypes)
    if (!isSearch) {
      freehandXOptions.push({ type: 'divider' })
      freehandXOptions.push({
        onClick: () => selectItem(FILTER_ARCHIVED_ONLY),
        selected: FILTER_ARCHIVED_ONLY === selected,
        label: FILTER_ARCHIVED_ONLY,
        type: 'item'
      })
    }

    return freehandXOptions
  }

  const getOtherOptions = () => {
    const dictionary = {
      'Created by anyone': 'team',
      'Created by me': 'user'
    }

    const createdByType = filteredOptions.map((item, idx) => ({
      onClick: () => selectItem(useName ? item.name : idx),
      selected: name === 'createdByFilter' ? dictionary[item.name] === selected : item.name === selected,
      label: item.name,
      type: 'item'
    }))

    return createdByType
  }

  const alignCalc = (mqs && mqs.sDown) || align === 'left' ? 'left' : 'right'

  return (
    <div className={cx(styles.root, { [styles.alignLeft]: align === 'left' })}>
      <Dropdown
        aria-label='Document type filter dropdown'
        menuClassName={styles.dropdownMenu}
        items={name === 'typeFilter' ? getFreehandXOptions() : getOtherOptions()}
        open={isOpen}
        align={alignCalc}
        width={175}
        onRequestToggleVisibility={toggleVisibility}
        trigger={<Text order='body' color={null} element='span'>{getDropdownText()}</Text>}
        closeOnClick
      />
    </div>
  )
}

FreehandXFilterDropdown.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  selected: PropTypes.string,
  externalDocConfig: PropTypes.object,
  externalDocFilterEntries: PropTypes.object,
  isSearch: PropTypes.bool,
  useName: PropTypes.bool,
  mqs: PropTypes.object
}

FreehandXFilterDropdown.defaultProps = {
  options: [],
  selected: 'All documents',
  isSearch: false,
  useName: false
}

export default FreehandXFilterDropdown
